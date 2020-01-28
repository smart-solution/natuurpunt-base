# coding: utf-8
"""
print crm invoice wizard
"""
import logging
from openerp.osv import fields, osv
from openerp.tools.translate import _
from openerp import tools
from openerp import netsvc
import base64

_logger = logging.getLogger(__name__)

REPORT_TYPES = [('factuur','account.invoice'),
                ('vordering','account.vordering'),
                ('kostennota','account.expense')]

REPORT_THIRDPAYER_EXTENSION = [('factuur','.thirdpayer'),
                               ('vordering',''),
                               ('kostennota','')]

LAYOUTS_FULL = [('factuur','Factuur'),('vordering','Vordering'),('kostennota','Kostennota'),]
LAYOUTS_SENT = [('vordering','Vordering'),('kostennota','Kostennota'),]

class account_invoice_sent(osv.osv):
    _name = 'account.invoice.sent'

    _columns = {
        'invoice_id' : fields.many2one('account.invoice', 'invoice', select=True),
        'ir_attachment_id': fields.many2one('ir.attachment', 'cmis', select=True),
        'name': fields.char('report name', size=64,),
        'state': fields.selection([
            ('draft','Draft'),
            ('print_pdf','Print PDF'),
            ('done','Done'),
            ('except','Except'),
        ], 'Status'),
    }

    _defaults = {
        'state': 'draft',
    }

    def get_account_invoice_sent(self, cr, uid, inv_ids, context=None):
        '''
        uitzoeken of we gaan gebruik maken van de versie in alfresco of 
        nieuw pdf document mogen aanmaken.
        '''
        ids = self.search(cr,uid,[('invoice_id','in',inv_ids),])
        for invoice_sent in self.browse(cr,uid,ids):
            return invoice_sent.ir_attachment_id

    def render_report(self,cr,uid,inv,context=None):
        inv_ids = [inv[0].invoice_id.id]
        report_name = inv[0].name
        ir_actions_report = self.pool.get('ir.actions.report.xml')
        report_ids = ir_actions_report.search(cr, uid, [('report_name','=',report_name)])
        ctx = {} if context is None else dict(context)
        ctx.update({'bypass_create':True})
        for report in ir_actions_report.browse(cr, uid, report_ids, context=ctx):
            report_service = 'report.' + report_name
            service = netsvc.LocalService(report_service)
            result, res_format = service.create(cr, uid, inv_ids, {'model': 'account.invoice'}, context=ctx)            
            result = base64.b64encode(result)
        return report_name, result

    def action_account_invoice_print_pdf(self, cr, uid, ids, context=None):
        if context == None:
            context = {}
        inv = self.browse(cr,uid,ids,context=context)
        inv_ids = [inv[0].invoice_id.id]
        inv_sent = self.get_account_invoice_sent(cr,uid,inv_ids,context)
        vals = {
            'state':'done',
        }
        try:
            if inv_sent:
                vals['ir_attachment_id'] = inv_sent.id
            else:
                report_name, report = self.render_report(cr,uid,inv,context)
                invoice_report_name = inv[0].invoice_id.internal_number+'.pdf'
                attachment_data = {
                    'name': invoice_report_name,
                    'datas_fname': invoice_report_name,
                    'datas': report,
                    'res_model': 'account.invoice',
                    'res_id': inv[0].invoice_id.id,
                    'partner_id': inv[0].invoice_id.partner_id.id,
                }
                att_id = self.pool.get('ir.attachment').create(cr, uid, attachment_data, context=context)
                vals['ir_attachment_id'] = att_id
                vals['name'] = invoice_report_name
        except:
            vals['state'] = 'except'   
        return self.write(cr,uid,ids,vals,context=context)

    def action_done(self, cr, uid, ids, context=None):
        # mark invoice as sent
        inv = self.browse(cr,uid,ids,context=context) 
        return self.pool.get('account.invoice').write(cr, uid, inv[0].invoice_id.id, {'sent':True}, context=context) 

    def action_except(self, cr, uid, ids, context=None):
        # mark invoice as not sent because of exception in rendering and storeing pdf
        inv = self.browse(cr,uid,ids,context=context)
        return self.pool.get('account.invoice').write(cr, uid, inv[0].invoice_id.id, {'sent':False}, context=context)

class print_invoice_wizard(osv.osv_memory):
    def _get_layouts(self, cr, uid, context=None):
        """Get the layouts selection, dynamic check if invoice is sent or not and adjust the possible layouts     
        @return: list of tuples
        """
        return LAYOUTS_FULL
    
    _name = 'print.invoice.wizard'
    _description = 'natuurpunt wizard to print invoice'
    _columns = {                
        'layout': fields.selection(_get_layouts, 'Document layout', required=True),
        'third_payer_id': fields.integer('Third payer ID', help='Third payer ID'),
        'use_third_payer_address':fields.boolean('Use third payer address'),
        'name':fields.char('Custom customer reference', size=64),
        'invoice_id': fields.many2one('account.invoice', 'invoice')
    }
    
    _defaults = {
        'layout': 'factuur',
        'third_payer_id':0,
    }    
             
    def _get_view_id(self, cr, uid):
        """Get the view id
        @return: view id, or False if no view found
        """
        res = self.pool.get('ir.model.data').get_object_reference(cr, uid,
                'natuurpunt_print_crm_invoice', 'print_crm_invoice_view')
        return res and res[1] or False

    def show_print_crm_invoice_dialog(self, cr, uid, id, context):
        message = self.browse(cr, uid, id)
        res = {
               'name': '%s' % (_('Print options invoice')),
               'view_type': 'form',
               'view_mode': 'form',
               'view_id': self._get_view_id(cr, uid),
               'res_model': self._name,
               'domain': [],
               'context': context,
               'type': 'ir.actions.act_window',
               'target': 'new',
               'res_id': message.id
        }
        return res    
    
    def init_print_crm_invoice_dialog(self, cr, uid, ids, use_third_payer_address=False, data=None, context=None):
        name=data['name']
        third_payer_id = data['third_payer_id'][0] if data['third_payer_id'] else False
        id = self.create(cr, uid, {'use_third_payer_address': use_third_payer_address, 
                                   'name': name,
                                   'third_payer_id':third_payer_id,
                                   'invoice_id':ids[0]})
        res = self.show_print_crm_invoice_dialog(cr, uid, id, context)
        return res

    def get_report_name(self, wiz_data):
        # convert layout to report
        report_name = [t[1]for t in REPORT_TYPES if wiz_data['layout'] == t[0]][0]
        # use thirdpayer version if option is selected and available for this layout
        if wiz_data['use_third_payer_address']:
            report_name += [t[1]for t in REPORT_THIRDPAYER_EXTENSION if wiz_data['layout'] == t[0]][0]
        return report_name

    def print_crm_invoice(self, cr, uid, ids, context=None):
        invoice_sent = self.pool.get('account.invoice.sent')
        wiz_data = self.read(cr, uid, ids)[0]
        inv_vals = {'name':wiz_data['name'],}
        invoice_id = wiz_data['invoice_id'][0]
        self.pool.get('account.invoice').write(cr, uid, [invoice_id], inv_vals, context=context)
        wf_service = netsvc.LocalService('workflow')
        vals = {
            'invoice_id': invoice_id,
            'name': self.get_report_name(wiz_data)
        } 
        account_invoice_sent_id = invoice_sent.create(cr,uid,vals)
        wf_service.trg_validate(uid, 'account.invoice.sent', account_invoice_sent_id, 'print_pdf', cr)
        for invoice_sent in invoice_sent.browse(cr,uid,[account_invoice_sent_id]):
            if invoice_sent.state == 'done':
                att_ids = [invoice_sent.ir_attachment_id.id]
                return {
                    'type': 'ir.actions.report.xml',
                    'report_type': 'controller',
                    'attachment_use': True,
                    'report_file': self.pool.get('ir.attachment').download_from_alfresco(cr,uid,att_ids,context=context)
                }
            else:
                raise osv.except_osv(_('Error!'),_("Probleem bij aanmaken van PDF!"))

        
class account_invoice(osv.osv):     
    _inherit = 'account.invoice'
    
    def invoice_print(self, cr, uid, ids, context=None):
        '''
        override/replace
        This function prints the invoice and mark it as sent, so that we can see more easily the next step of the workflow
        '''
        values = {}
        if context is None:
            context = {}            
        assert len(ids) == 1, 'This option should only be used for a single id at a time.'

        _logger.info("Printing invoice ids %s", ids)        
        data = self.read(cr, uid, ids)[0]

        if data['sent']:
            invoice_sent_obj = self.pool.get('account.invoice.sent')
            invoice_sent_ids = invoice_sent_obj.search(cr,uid,[('invoice_id','in',ids)])
            for invoice_sent in invoice_sent_obj.browse(cr,uid,invoice_sent_ids):
                att_ids = [invoice_sent.ir_attachment_id.id]
                return {
                    'type': 'ir.actions.report.xml',
                    'report_type': 'controller',
                    'attachment_use': True,
                    'report_file': self.pool.get('ir.attachment').download_from_alfresco(cr,uid,att_ids,context=context)
                }          
                        
        # print crm invoice wizard
        if data['type'] == 'out_invoice':
            print_invoice_wizard_obj = self.pool.get('print.invoice.wizard')
            return print_invoice_wizard_obj.init_print_crm_invoice_dialog(cr,uid,ids,use_third_payer_address=False,data=data)
        else:
            values = {'sent':True}
            # default print logic without option wizard
            report_name = 'account.invoice'
                
        if values:
            self.write(cr, uid, ids, values, context=context)
        
        datas = {
             'ids': ids,
             'model': 'account.invoice',
             'form': data
        }
        return {
            'type': 'ir.actions.report.xml',
            'report_name': report_name,
            'datas': datas,
            'nodestroy' : True
        }        
        
account_invoice()
