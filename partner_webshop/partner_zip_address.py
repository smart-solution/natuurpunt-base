#!/usr/bin/env python
# -*- encoding: utf-8 -*-
##############################################################################
#
##############################################################################

from openerp.osv import osv, fields

class res_partner(osv.osv):
    _name = 'res.partner'
    _inherit = 'res.partner'

    _columns = {
                'first_name': fields.char('first_name'),
                'last_name': fields.char('last_name'),
		'street_nonbr': fields.char('Street No Nbr'),
		'street_nbr': fields.char('Number', size=16),
		'street_bus': fields.char('Bus', size=16),
    }

res_partner()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

