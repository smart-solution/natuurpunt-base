#!/usr/bin/env python
# -*- encoding: utf-8 -*-
##############################################################################
#
##############################################################################

from openerp.osv import osv, fields

class npdm_partner(osv.osv):
    _name = 'npdm.partner'

    _columns = {
        'name': fields.char('Name', len=24),
		'company_id': fields.many2one('res.company', 'Company'),
		'partner_id': fields.many2one('res.partner', 'Parnter'),
        'old_code': fields.char('Old Code', len=24),
    }

npdm_partner()

class res_partner(osv.osv):
    _name = 'res.partner'
    _inherit = 'res.partner'

    _columns = {
		'old_code_ids': fields.one2many('npdm.partner', 'partner_id', 'Old Codes'),
    }

res_partner()

class npdm_account(osv.osv):
    _name = 'npdm.account'

    _columns = {
        'name': fields.char('Name', len=24),
		'company_id': fields.many2one('res.company', 'Company'),
		'account_id': fields.many2one('account.account', 'Account'),
        'old_code': fields.char('Old Code', len=24),
    }

npdm_account()

class account_account(osv.osv):
    _name = 'account.account'
    _inherit = 'account.account'

    _columns = {
		'old_code_ids': fields.one2many('npdm.account', 'account_id', 'Old Codes'),
    }

account_account()

class npdm_journal(osv.osv):
    _name = 'npdm.journal'

    _columns = {
        'name': fields.char('Name', len=24),
		'company_id': fields.many2one('res.company', 'Company'),
		'journal_id': fields.many2one('account.journal', 'Journal'),
        'old_code': fields.char('Old Code', len=24),
    }

npdm_journal()

class account_journal(osv.osv):
    _name = 'account.journal'
    _inherit = 'account.journal'

    _columns = {
		'old_code_ids': fields.one2many('npdm.journal', 'journal_id', 'Old Codes'),
    }

account_account()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

