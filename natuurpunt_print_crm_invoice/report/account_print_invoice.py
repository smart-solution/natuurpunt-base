# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2004-2010 Tiny SPRL (<http://tiny.be>).
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

import time
from openerp.report import report_sxw

class account_crm_invoice(report_sxw.rml_parse):
    def __init__(self, cr, uid, name, context):         
        print "CUSTOM INVOICE THIRDPAYER"            
        super(account_crm_invoice, self).__init__(cr, uid, name, context=context)
        self.localcontext.update({
                                  'time': time,
                                  'tax_summarize': self._tax_summarize,                                  
                                  })
         
    def _tax_summarize(self, invoice_id, context=None):
        cr = self.cr
        uid = self.uid
        tax_lines = self.pool.get('account.invoice.tax').search(cr, uid, [('invoice_id','=',invoice_id)])
        if not tax_lines:
            return []
        tax_grouped = {}
        for line in self.pool.get('account.invoice.tax').browse(cr, uid, tax_lines):
            val =  []
            val.append(line.name)
            val.append(line.base)
            val.append(line.amount) 
            key = line.name
            if not key in tax_grouped:
                tax_grouped[key] = val
            else:
                tax_grouped[key][1] += val[1]
                tax_grouped[key][2] += val[2]
        return tax_grouped.values()

report_sxw.report_sxw(
    'report.account.invoice.thirdpayer',
    'account.invoice',
    'addons/natuurpunt_print_crm_invoice/report/account_print_invoice.rml',
    parser=account_crm_invoice
)
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: