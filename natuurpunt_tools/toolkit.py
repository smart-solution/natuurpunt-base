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
from unidecode import unidecode

def sql_wrapper(sqlstat, method=None):
    def execute_sql(cr):
        cr.execute(sqlstat)
        if method and method == 'dictfetchone':
            return cr.dictfetchone()
        return cr.dictfetchall()
    return execute_sql

def compose(*functions):
    return reduce(lambda f, g: lambda x: g(f(x)), functions, lambda x: x)

def get_included_product_ids(prod_object, cr, uid, prod_id):
    """returns included product ids from combined product.
    all except 'gewoon lid' have included products
    @param mem: id of combined product
    @param return: list ids or membership_product id list if empty
    """
    if prod_id:
        included_prod_ids = prod_object.read(cr, uid, prod_id, ['included_product_ids'])['included_product_ids']
        return sorted(included_prod_ids) if included_prod_ids else [prod_id]
    else:
        included_prod_ids = prod_object.search(cr, uid, [('membership_product','=',True),('included_product_ids','=',False)])
        return included_prod_ids

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

def make_unicode(input):
    if type(input) != unicode:
        input =  input.decode('utf-8')
        return input
    else:
        return input

def difflib_cmp(search_for, search_results, limit=1):
    weighted_results = []
    b = unidecode(search_for.lower())
    for result in search_results:
        a = unidecode(result[1].lower())
        ratio = difflib.SequenceMatcher(None, make_unicode(a), make_unicode(b)).ratio()
        weighted_results.append((result[0], ratio))
    res = sorted(weighted_results, key=lambda x: x[1], reverse=True)
    if len(res) >= limit:
        return res[0:limit]
    else:
        return res

def get_match_vals(vals):
    """
    subset of fields needed to match
    """
    match_fields = ['first_name','last_name']
    ref = AttrDict()
    [setattr(ref,k,v) for k,v in vals.iteritems() if k in match_fields]
    return ref

def match_with_existing_partner(obj,cr,uid,data):
    """
    when we could not find a partner by its unique identifier = email
    we do an extra check if we can find it based on address and name
    """

    vals, logger, alert = data

    def concat_names(p):
        try:
            return p.first_name + '_' + p.last_name
        except:
            return ''

    def match_on_fullname(target_ids):
        match_target_list = []
        for partner in obj.browse(cr,uid,target_ids):
            match_target_list.append((partner.id, concat_names(partner)))
        return difflib_cmp(concat_names(ref_vals), match_target_list)[0] if match_target_list else False

    def match_names_seperatly(cmp_res):
        """
        return tuple partner object,boolean full match
        """
        logger.info("partner fullname match diff:{}".format(cmp_res))
        if cmp_res:
            partner = obj.browse(cr,uid,cmp_res[0])
            if cmp_res[1] == 1.0:
                return (partner,True)
            if cmp_res[1] > 0.5:
                first_name = partner.first_name if partner.first_name else ''
                cmp_res_first_name = difflib_cmp(ref_vals.first_name, [(partner.id, first_name)])[0]
                last_name =  partner.last_name if partner.last_name else ''
                cmp_res_last_name = difflib_cmp(ref_vals.last_name, [(partner.id, last_name)])[0]
                logger.info("partner firstname match diff:{}".format(cmp_res_first_name))
                logger.info("partner lastname match diff:{}".format(cmp_res_last_name))
                # rules, priority full match to less match
                rules = [lambda f,l : f == 0 and l == 1.0,    # no firstname, 100% lastname
                         lambda f,l : f >= 0.7 and l >= 0.85] # seperate firstname/lastname
                res = [func(cmp_res_first_name[1],cmp_res_last_name[1]) for func in rules]
                # return partner,full match or partial match
                return (partner,res[0]) if any(res) else (False,False)
            else:
                return (False,False)
        else:
            return (False,False)

    ref_vals = get_match_vals(vals)
    if 'street_id' in vals and vals['street_id']:
       target_domain = [
            ('street_id','=',vals['street_id']),
            ('zip_id','=',vals['zip_id']),
            ('street_nbr','=',vals['street_nbr']),
       ]
    else:
       target_domain = [
            ('street','=',vals['street']),
            ('zip','=',vals['zip']),
            ('street_nbr','=',vals['street_nbr']),
       ]
    partner = compose(
                match_on_fullname,
                match_names_seperatly,
                lambda (p,full_match): p if p and (not(p.donation_line_ids) or full_match) else False
              )(obj.search(cr,uid,target_domain))
    log = {
        'alert':[alert] if partner else [],
        'renewal':False
    }
    return (partner if partner else False, vals, log)

def partner_url(obj, cr):
    link = "<b><a href='{}?db={}#id={}&view_type=form&model=res.partner'>"
    html_end = "</a></b>"
    base_url = obj.pool.get('ir.config_parameter').get_param(cr, SUPERUSER_ID, 'web.base.url')
    return link, base_url, html_end

def send_internal_alerts(obj,cr,uid,data):
    """
    """
    partner, vals, log = data
    for alert in log['alert']:
        link, base_url, html_end = partner_url(obj, cr)
        contact = partner.name + '[email = ' + vals['email'] + ']'
        body = link.format(base_url,cr.dbname,partner.id) + contact + ' : ' + alert + html_end
        mail_group_id = obj.pool.get('mail.group').group_word_lid_alerts(cr,uid)
        message_id = obj.pool.get('mail.group').message_post(cr, uid, mail_group_id,
                                body=body,
                                subtype='mail.mt_comment', context={})
        obj.pool.get('mail.message').set_message_read(cr, uid, [message_id], False)
    return partner, log

def uids_in_group(obj, cr, uid, group, partner=False, context=None):
    mod_obj = obj.pool.get('ir.model.data')
    model_data_ids = mod_obj.search(cr, uid,[('model', '=', 'res.groups'), ('name', '=', group)], context=context)
    if model_data_ids:
        res_id = mod_obj.read(cr, uid, model_data_ids, fields=['res_id'], context=context)[0]['res_id']
        if res_id:
            group_obj = obj.pool.get('res.groups').browse(cr, uid, res_id)
            if partner:
                return [user.partner_id.id for user in group_obj.users]
            else:
                return [user.id for user in group_obj.users]
        else:
            return []
    else:
        return []

def get_approval_state(obj, cr, uid, inv, context = None):
    mod_obj = obj.pool.get('purchase.approval.item')
    mod_ids = mod_obj.search(cr, uid,[('invoice_id', '=', inv.id)], context=context)
    res = mod_obj.read(cr, uid, mod_ids, fields=['state'], context=context)
    state = res[0]['state'] if res else False
    return state

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
