#!/usr/bin/env python
# -*- encoding: utf-8 -*-
##############################################################################
#
##############################################################################

from openerp.osv import fields, osv

class res_partner_classification(osv.osv):
    _name = 'res.partner.classification'
    _description = 'Partner Class'

    _columns = {
        'name': fields.char('Name', size=64, required=True, translate=True),
        'debit': fields.boolean('Debit'),
        'credit': fields.boolean('Credit'),
                }

res_partner_classification()

class res_partner(osv.osv):
    _name = 'res.partner'
    _inherit = 'res.partner'
    _columns = {
        'partner_classification_id': fields.many2one('res.partner.classification', 'Partner Class', select=True),
                }

res_partner()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:# -*- coding: utf-8 -*-

