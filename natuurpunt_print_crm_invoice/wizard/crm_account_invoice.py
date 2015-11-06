# coding: utf-8
"""
print crm invoice wizard
"""
import logging
from openerp.osv import fields, osv
from openerp.tools.translate import _
from openerp import tools

_logger = logging.getLogger(__name__)

REPORT_TYPES = [('factuur','account.invoice'),
                ('vordering','account.vordering'),
                ('kostennota','account.expense')]

REPORT_THIRDPAYER_EXTENSION = [('factuur','.thirdpayer'),
                               ('vordering',''),
                               ('kostennota','')]

LAYOUTS_FULL = [('factuur','Factuur'),('vordering','Vordering'),('kostennota','Kostennota'),]
LAYOUTS_SENT = [('vordering','Vordering'),('kostennota','Kostennota'),]

class print_invoice_wizard(osv.osv_memory):
    def _get_layouts(self, cr, uid, context=None):
        """Get the layouts selection, dynamic check if invoice is sent or not and adjust the possible layouts     
        @return: list of tuples
        """
        if 'active_ids' in context:
            ids = context.get('active_ids', False)
            invoice_sent = self.pool.get('account.invoice').read(cr, uid, ids, ['sent'],context=context)[0]['sent']
            return LAYOUTS_SENT if invoice_sent else LAYOUTS_FULL
        else:
            return LAYOUTS_FULL      
    
    _name = 'print.invoice.wizard'
    _description = 'natuurpunt wizard to print invoice'
    _columns = {                
        'layout': fields.selection(_get_layouts, 'Document layout', required=True),
        'third_payer_id': fields.integer('Third payer ID', help='Third payer ID'),
        'use_third_payer_address':fields.boolean('Use third payer address'),
        'name':fields.char('Custom customer reference', size=64),
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
    
    def init_print_crm_invoice_dialog(self, cr, uid, ids, use_third_payer_address=False, name=None, third_payer_id=0, context=None):
        id = self.create(cr, uid, {'use_third_payer_address': use_third_payer_address, 
                                   'name': name,
                                   'third_payer_id':third_payer_id,})
        self.account_invoice_ids = ids
        res = self.show_print_crm_invoice_dialog(cr, uid, id, context)
        return res    

    def print_crm_invoice(self, cr, uid, ids, context=None):
        if context is None:
            context = {}    
        try:
            context['print_invoice_wizard'] = ids # inform invoice_print origin
        except:
            raise osv.except_osv(_('Error'), _('Print options invoice wizard exception!'))            
        else: 
            return self.pool.get('account.invoice').invoice_print(cr, uid, self.account_invoice_ids, context=context)    
        
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
        print_invoice_wizard_obj = self.pool.get('print.invoice.wizard')                    
                        
        #process print options from wizard                        
        if 'print_invoice_wizard' in context:
            wiz_ids = context.get('print_invoice_wizard', False)
            wiz_data = print_invoice_wizard_obj.read(cr, uid, wiz_ids)[0]                        
            data['name'] = wiz_data['name']
            values['name'] = wiz_data['name']
            values['sent'] = True if wiz_data['layout'] == 'factuur' else False
            # convert layout to report
            report_name = [t[1]for t in REPORT_TYPES if wiz_data['layout'] == t[0]][0]
            # use thirdpayer version if option is selected and available for this layout
            if wiz_data['use_third_payer_address']:         
                report_name += [t[1]for t in REPORT_THIRDPAYER_EXTENSION if wiz_data['layout'] == t[0]][0]
        else:
            # print crm invoice wizard
            if data['type'] == 'out_invoice':
                third_payer_id = data['third_payer_id'][0] if data['third_payer_id'] else False
                #print_wizard = 'print.invoice.wizard' if data['sent'] else 'print.invoice.wizard'
                return print_invoice_wizard_obj.init_print_crm_invoice_dialog(cr, uid, ids, 
                                                                              use_third_payer_address=False, 
                                                                              name=data['name'], 
                                                                              third_payer_id=third_payer_id)
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
