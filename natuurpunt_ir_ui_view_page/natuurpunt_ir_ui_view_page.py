##############################################################################
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

from openerp.tools.safe_eval import safe_eval as eval
from openerp import tools
import openerp.modules
from openerp.osv import fields, osv
from openerp.tools.translate import _
from openerp import SUPERUSER_ID
from lxml import etree
from natuurpunt_tools import sql_wrapper
from functools import partial
from openerp.osv.orm import BaseModel
# List of etree._Element subclasses that we choose to ignore when parsing XML.
from openerp.tools import SKIPPED_ELEMENT_TYPES

"""
def view_inheritance_monitor(original_function):      
    def new_function(*args,**kwargs):
        x = original_function(*args,**kwargs)                
        print "****>>>>>>", PreOrderTreeTraversalManager.tree()
        print args, kwargs
        return x                                             
    return new_function

BaseModel.fields_view_get = view_inheritance_monitor(BaseModel.fields_view_get)
"""
import logging

logger = logging.getLogger(__name__)

def neighborhood(iterator):
    prev = None
    for current in iterator:
        yield (prev,current)
        prev = current

def get_groups(cr,group):
    module, name = group.split(".")
    sql_stat = "SELECT res_id FROM ir_model_data WHERE " + \
               " module='{}' and name = '{}'".format(module,name)
    res = sql_wrapper(sql_stat)(cr)
    return (res[0]['res_id'],module) if res else False

def get_module(cr,view_id):
    sql_stat = "SELECT module FROM ir_model_data WHERE " + \
               " model='ir.ui.view' and res_id = {}".format(view_id)
    res = sql_wrapper(sql_stat)(cr)
    return res[0]['module'] if res else False

def process_page_element(cr,view_id,page):
    groups = filter(None,map(partial(get_groups,cr),page.attrib['groups'].split(","))) if 'groups' in page.attrib else False
    module = get_module(cr,view_id)
    return {
        'ref_id': view_id,
        'name': page.attrib['name'] if 'name' in page.attrib else page.attrib['string'],
        'groups_id' : [(6, 0, [group_id[0] for group_id in groups])] if groups else False,
        'module' : module if module else False,
    }

def encode(s):
    if isinstance(s, unicode):
        return s.encode('utf8')
    return s

def locate(source, spec):
    """ Locate a node in a source (parent) architecture.

    Given a complete source (parent) architecture (i.e. the field
    `arch` in a view), and a 'spec' node (a node in an inheriting
    view that specifies the location in the source view of what
    should be changed), return (if it exists) the node in the
    source view matching the specification.

    :param source: a parent architecture to modify
    :param spec: a modifying node in an inheriting view
    :return: a node in the source matching the spec

    """
    if spec.tag == 'xpath':
        nodes = source.xpath(spec.get('expr'))
        return nodes[0] if nodes else None
    elif spec.tag == 'field':
        # Only compare the field name: a field can be only once in a given view
        # at a given level (and for multilevel expressions, we should use xpath
        # inheritance spec anyway).
        for node in source.getiterator('field'):
            if node.get('name') == spec.get('name'):
                return node
        return None

    for node in source.getiterator(spec.tag):
        if isinstance(node, SKIPPED_ELEMENT_TYPES):
            continue
        if all(node.get(attr) == spec.get(attr) \
                for attr in spec.attrib
                    if attr not in ('position','version')):
            # Version spec should match parent's root element's version
            if spec.get('version') and spec.get('version') != source.get('version'):
                return None
            return node
    return None


def apply_inheritance_specs(source, specs_arch, inherit_id=None):
    """ Apply an inheriting view.

    Apply to a source architecture all the spec nodes (i.e. nodes
    describing where and what changes to apply to some parent
    architecture) given by an inheriting view.

    :param source: a parent architecture to modify
    :param specs_arch: a modifying architecture in an inheriting view
    :param inherit_id: the database id of the inheriting view
    :return: a modified source where the specs are applied

    """
    specs_tree = etree.fromstring(encode(specs_arch))
    # Queue of specification nodes (i.e. nodes describing where and
    # changes to apply to some parent architecture).
    specs = [specs_tree]

    while len(specs):
        spec = specs.pop(0)
        if isinstance(spec, SKIPPED_ELEMENT_TYPES):
            continue
        if spec.tag == 'data':
            specs += [ c for c in specs_tree ]
            continue
        node = locate(source, spec)
        if node is not None:
            pos = spec.get('position', 'inside')
            if pos == 'replace':
                if node.getparent() is None:
                    source = copy.deepcopy(spec[0])
                else:
                    for child in spec:
                        node.addprevious(child)
                    node.getparent().remove(node)
            elif pos == 'attributes':
                for child in spec.getiterator('attribute'):
                    attribute = (child.get('name'), child.text or None)
                    if attribute[1]:
                        node.set(attribute[0], attribute[1])
                    else:
                        del(node.attrib[attribute[0]])
            else:
                sib = node.getnext()
                for child in spec:
                    if pos == 'inside':
                        node.append(child)
                    elif pos == 'after':
                        if sib is None:
                            node.addnext(child)
                            node = child
                        else:
                            sib.addprevious(child)
                    elif pos == 'before':
                        node.addprevious(child)
                    else:
                        raise_view_error("Invalid position value: '%s'" % pos, inherit_id)
        else:
            attrs = ''.join([
                ' %s="%s"' % (attr, spec.get(attr))
                for attr in spec.attrib
                if attr != 'position'
            ])
            tag = "<%s%s>" % (spec.tag, attrs)
            if spec.get('version') and spec.get('version') != source.get('version'):
                raise_view_error("Mismatching view API version for element '%s': %r vs %r in parent view '%%(parent_xml_id)s'" % \
                                    (tag, spec.get('version'), source.get('version')), inherit_id)
            raise_view_error("Element '%s' not found in parent view '%%(parent_xml_id)s'" % tag, inherit_id)

    return source

class PreOrderTreeTraversalManager(object):
    __TREE = None
    @staticmethod
    def set_tree(node_id):
        # Setup singleton tree
        if PreOrderTreeTraversalManager.__TREE is None:
            PreOrderTreeTraversalManager.__TREE = []
        PreOrderTreeTraversalManager.__TREE.append(node_id)
    @staticmethod
    def kill_tree():
        # Kills tree
        if PreOrderTreeTraversalManager.__TREE is None:
            # exception handling
            pass
        else:
            PreOrderTreeTraversalManager.__TREE = None
    @staticmethod
    def tree(node_id=None):
        # print tree
        if node_id:
            return [d for d in PreOrderTreeTraversalManager.__TREE if node_id in d] 
        else:
            return PreOrderTreeTraversalManager.__TREE

class ir_ui_view_page(osv.osv):
    _name = 'ir.ui.view.page'

    _columns = {
        'name': fields.char('Page name', required=True),
        'ref_id': fields.many2one('ir.ui.view', 'View', select=True, required=True, ondelete='cascade'),
        'groups_id': fields.many2many('res.groups', 'ir_ui_view_page_group_rel','page_id', 'gid', 'Groups', help=""),
        'changes': fields.integer('changes'),
        'modules' : fields.char('in module(s)',),
    }
    
class view_with_page(osv.osv):
      _inherit = 'ir.ui.view'

      _columns = {
          'page_ids': fields.one2many('ir.ui.view.page', 'ref_id', 'pages'),
      }

      def get_inheriting_views_arch(self, cr, uid, view_id, model, context=None):
          """
          pre order tree traversal monitor for possible unexpected overrids of group permissions
          """
          sql_inherit = super(view_with_page, self).get_inheriting_views_arch(cr, uid, view_id, model, context)
          if 'pages_from_view' in context:
              node = self.browse(cr,uid,view_id,context=context)
              if node.inherit_id.id == False:
                  PreOrderTreeTraversalManager.kill_tree()
              PreOrderTreeTraversalManager.set_tree(view_id)
          return sql_inherit


      def _recalc_pages_from_view(self, cr, uid, context=None):
          context = context or {}
          logger.info('Calculation of pages from view started')
          view_ids = self.search(cr, uid, [('inherit_id','=',False),('type','=','form')], context=context)
          filtered_view_ids = [x for x in view_ids if x != 895]
          if view_ids:
              for view_id in filtered_view_ids:
                  logger.info('view -> {}'.format(view_id))
                  self.pages_from_view(cr, uid, [view_id], context=context)
          logger.info('Calculation of pages from view ended')
          return True

      def test_pages_from_view(self,cr,uid,ids,context=None):
          return self._recalc_pages_from_view(cr,uid,context=context)

      def pages_from_view(self,cr,uid,ids,context=None):
          switcher = {
              'page'  : process_page_element,
              # future tag support
          }

          page_ids = []
          for record in self.browse(cr, uid, ids, context):
              # delete all before reloading
              delete_one2many = [(2, oid.id) for oid in record.page_ids]
              if delete_one2many:
                  self.write(cr, SUPERUSER_ID, record.id, {'page_ids': delete_one2many}, context)
              context['pages_from_view'] = True
              self.pool.get(record.model).fields_view_get(cr,uid,view_id=ids[0],view_type='form',context=context)
              for prev_view_id,current_view_id in neighborhood(iter(PreOrderTreeTraversalManager.tree())):
                  if not prev_view_id:
                      view = self.browse(cr, uid, current_view_id, context)
                      source = etree.fromstring(encode(view.arch))
                      depth = {current_view_id:0}
                      pages = []
                      seq = 0
                  else:
                      view = self.browse(cr, uid, current_view_id, context)
                      source = apply_inheritance_specs(source, view.arch, current_view_id)
                      depth[current_view_id] = depth[view.inherit_id.id] + 1
                  for elem in source.iter():
                      func = switcher.get(elem.tag, lambda cr,view,elem: False)
                      val = func(cr,current_view_id,elem)
                      if val:
                          seq = seq + 1
                          val['seq'] = seq
                          pages.append(val)
          def create_page_record(values):
              del values['seq']
              values['changes'] = changes
              if not modules:
                  values['modules'] = values['module']
              else:
                  values['modules'] = ','.join(modules)
              del values['module']
              page_ids.append(self.pool.get('ir.ui.view.page').create(cr,uid,values)) 
          for prev,current in neighborhood(sorted(pages, key=lambda k: (k['name'], k['seq']))):
              if prev and prev['name'] <> current['name']:
                  create_page_record(prev)
                  changes = 0
                  modules = [current['module']]
              elif prev and prev['name'] == current['name']:
                  if prev['groups_id'] <> current['groups_id']:
                      changes = changes + 1
                      modules.append(current['module'])
              else:
                  changes = 0
                  modules = [current['module']]
          else:
              current = False
          if current:
              create_page_record(current)
          self.write(cr,uid,ids,{'page_ids':[(6,0,page_ids)]})
