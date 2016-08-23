# -*- coding: utf-8 -*-
##############################################################################
#
#    Natuurpunt VZW
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

import os
import tempfile
from lxml import etree, objectify
from collections import Counter
import difflib

def sql_wrapper(sqlstat):
    def execute_sql(cr):
        cr.execute(sqlstat)
        return cr.dictfetchall()
    return execute_sql

def compose(*functions):
    return reduce(lambda f, g: lambda x: g(f(x)), functions, lambda x: x)

def sum_groupby(groupby_obj, keys_to_sum=None):
    if not keys_to_sum:
        return None
    res = []
    for key,group in groupby_obj:
       c = Counter()
       for dict in [d for d in group]:
           c.update({k:dict[k] for k in keys_to_sum})
       res.append((key,c))
    return res

def difflib_cmp(search_for, search_results, limit=1):
    weighted_results = []
    for result in search_results:
        ratio = difflib.SequenceMatcher(None, result[1].lower(), search_for.lower()).ratio()
        weighted_results.append((result[0], ratio))
    res = sorted(weighted_results, key=lambda x: x[1], reverse=True)
    if len(res) >= limit:
        return res[0:limit]
    else:
        return res

def uids_in_group(obj, cr, uid, group, partner=False, context=None):
    mod_obj = obj.pool.get('ir.model.data')
    model_data_ids = mod_obj.search(cr, uid,[('model', '=', 'res.groups'), ('name', '=', group)], context=context)
    res_id = mod_obj.read(cr, uid, model_data_ids, fields=['res_id'], context=context)[0]['res_id']
    if res_id:
        group_obj = obj.pool.get('res.groups').browse(cr, uid, res_id)
        if partner:
            return [user.partner_id.id for user in group_obj.users]
        else:
            return [user.id for user in group_obj.users]
    else:
        return []

def create_node(tag, data, *sub_nodes):
    def create_element():
        obj = objectify.Element(tag)
        for key, value in data.iteritems():
            obj.addattr(key,value)
        map(lambda sub_node: obj.append(sub_node()),sub_nodes)
        return obj
    return create_element

def create_xml(*functions):
    xml = '<?xml version="1.0" encoding="UTF-8"?><root></root>'
    root = objectify.fromstring(xml)
    node = []
    node_append = lambda f : map(node_append,f) if isinstance(f,list) else node.append(f())
    map(node_append, functions)
    map(root.append, node)
    objectify.deannotate(root)
    etree.cleanup_namespaces(root)
    return root

def silentremove(filename):
    try:
        os.remove(filename)
    except OSError as e: # this would be "except OSError, e:" before Python 2.6
        if e.errno != errno.ENOENT: # errno.ENOENT = no such file or directory
            raise # re-raise exception if a different error occured

def transform(xml,xslt,data):
    xml_data = tempfile.NamedTemporaryFile(delete=False)
    xml_template = tempfile.NamedTemporaryFile(delete=False)
    xslt_stylesheet = tempfile.NamedTemporaryFile(delete=False)
    try:
        # xml data,xml template and stylesheet strings to file objs on disk
        xml_data.write(etree.tostring(data))
        xml_template.write(xml)
        xslt_stylesheet.write(xslt)
    finally:
        xml_data.close()
        xml_template.close()
        xslt_stylesheet.close()
        # setup transformation
        xml_input = etree.parse(xml_template.name)
        xslt_root = etree.parse(xslt_stylesheet.name)
        transformation = etree.XSLT(xslt_root)

        lom_tree = transformation(xml_input, xmldata=etree.XSLT.strparam(xml_data.name))
        silentremove(xml_data.name)
        silentremove(xml_template.name)
        silentremove(xslt_stylesheet.name)
        return etree.tostring(lom_tree, pretty_print=True)

class AttrDict(dict):
    """
    A dictionary with attribute-style access. It maps attribute access to
    the real dictionary.
    """
    def __init__(self, init={}):
        dict.__init__(self, init)
    def __getstate__(self):
        return self.__dict__.items()
    def __setstate__(self, items):
        for key, val in items:
            self.__dict__[key] = val
    def __repr__(self):
        return "%s(%s)" % (self.__class__.__name__, dict.__repr__(self))
    def __setitem__(self, key, value):
        return super(AttrDict, self).__setitem__(key, value)
    def __getitem__(self, name):
        return super(AttrDict, self).__getitem__(name)
    def __delitem__(self, name):
        return super(AttrDict, self).__delitem__(name)
    __getattr__ = __getitem__
    __setattr__ = __setitem__

    def copy(self):
        ch = AttrDict(self)
        return ch
    @classmethod
    def create_empty(cls,*args, **kwargs):
        return cls(dict((k, False) for k in args))
    @classmethod
    def create_empty_from_list(cls,list_arg):
        return cls({k:False for k in list_arg})
    @classmethod
    def fill(cls,source,target):
        if source:
            [setattr(target,k,v) for k,v in source.iteritems() if hasattr(target,k)]

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
