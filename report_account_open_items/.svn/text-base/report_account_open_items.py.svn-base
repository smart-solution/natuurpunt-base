# -*- coding: utf-8 -*-
##############################################################################
#
#    Smart Solution bvba
#    Copyright (C) 2010-Today Smart Solution BVBA (<http://www.smartsolution.be>).
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

from osv import osv, fields
from openerp.tools.translate import _


class account_open_items(osv.osv_memory):

    _name = 'account.open.items'
    _description = 'Account Open Items Report'

    _columns = {
        'period_id': fields.many2one('account.period', 'Period', required=True)
    }

    def open_items_get(self, cr, uid, ids, context=None):
	"""Gets all open items for a specific period""" 
        obj_acc_move_line = self.pool.get('account.move.line')

        data = self.browse(cr, uid, ids, context=context)

        if context is None:
            context = {}

	print "PERIOD ID:",str(data[0].period_id.id)
	# Get the periods before the wanted fiscal period
        cr.execute("SELECT id FROM account_period WHERE date_start <= (SELECT date_stop FROM account_period WHERE id = %s)", (str(data[0].period_id.id),))
        period_set = ','.join(map(lambda id: str(id[0]), cr.fetchall()))
	# Get the periods after the wanted fiscal period
        cr.execute("SELECT id FROM account_period WHERE date_start > (SELECT date_stop FROM account_period WHERE id = %s)", (str(data[0].period_id.id),))
        period2_set = ','.join(map(lambda id: str(id[0]), cr.fetchall()))
	print "PERIOD 1:",period_set
	print "PERIOD 2:",period2_set
	periods = period_set.split(',')
	if not periods:
	    return False

	company_id = self.pool.get('res.users').browse(cr, uid, uid).company_id.id

	query_line = obj_acc_move_line._query_get(cr, uid,
                obj='account_move_line', context={'periods': periods})
	print "QUERY LINES:",query_line

	item_ids = []

        #report of the accounts with defferal method == 'unreconciled'
        cr.execute('''
            SELECT a.id
            FROM account_account a
            LEFT JOIN account_account_type t ON (a.user_type = t.id)
            WHERE a.active
              AND a.type != 'view'
              AND a.company_id = %s
              AND t.close_method = %s''', (company_id, 'unreconciled', ))
        account_ids = map(lambda x: x[0], cr.fetchall())
	print "ACC IDS:",account_ids

        if account_ids:
            cr.execute('''
                  SELECT id
                  FROM account_move_line
                  WHERE account_id IN %s
                     AND ''' + query_line + '''
                     AND reconcile_id IS NULL''', (tuple(account_ids),))
	    item_ids  += map(lambda x: x[0], cr.fetchall())
	    print "OPEN ITEMS 1:",item_ids

            #We have also to consider all move_lines that were reconciled
            #on another fiscal year, and report them too
            cr.execute('''
                  SELECT id
                     FROM account_move_line b
                     WHERE b.account_id IN %s
                       AND b.reconcile_id IS NOT NULL
                       AND b.period_id IN ('''+period_set+''')
                       AND b.reconcile_id IN (SELECT DISTINCT(reconcile_id)
                                          FROM account_move_line a
                                          WHERE a.period_id IN ('''+period2_set+'''))''', (tuple(account_ids),))
	    item_ids += map(lambda x: x[0], cr.fetchall())
	    print "OPEN ITEMS 2:",item_ids

        return {
                'domain': "[('id','in',%s)]"%(item_ids),
                'name': 'Open Items',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'view_id': False,
                'res_model': 'account.move.line',
                'type': 'ir.actions.act_window'
        }

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
