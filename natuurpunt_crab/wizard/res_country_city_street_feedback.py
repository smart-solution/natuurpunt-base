# coding: utf-8
from osv import fields, osv
from openerp.tools.translate import _

WARNING_TYPES = [('warning','Warning'),('info','Information'),('error','Error')]

class res_country_city_street_feedback(osv.osv_memory):
    _name = 'res.country.city.street.feedback'
    _description = 'feedback res.country.city.street file import'
    _columns = {
        'type': fields.selection(WARNING_TYPES, string='Type', readonly=True),
        'title': fields.char(string="Title", size=100, readonly=True),
        'message': fields.text(string="Message", readonly=True),
        'feedback_stream': fields.binary('Feedback File Stream', readonly=True),
        'feedback_fname': fields.char('File name', size=40),
    }
    _req_name = 'title'

    def _get_view_id(self, cr, uid):
        """Get the view id
        @return: view id, or False if no view found
        """
        res = self.pool.get('ir.model.data').get_object_reference(cr, uid,
                'natuurpunt_crab', 'crab_import_feedback_view')
        return res and res[1] or False

    def message(self, cr, uid, id, context):
        message = self.browse(cr, uid, id)
        message_type = [t[1]for t in WARNING_TYPES if message.type == t[0]][0]
        print '%s: %s' % (_(message_type), _(message.title))
        res = {
               'name': '%s: %s' % (_(message_type), _(message.title)),
               'view_type': 'form',
               'view_mode': 'form',
               'view_id': self._get_view_id(cr, uid),
               'res_model': 'res.country.city.street.feedback',
               'domain': [],
               'context': context,
               'type': 'ir.actions.act_window',
               'target': 'new',
               'res_id': message.id
        }
        return res

    def warning(self, cr, uid, title, message, feedback_stream, context=None):
        id = self.create(cr, uid, {'title': title, 'message': message, 'type': 'warning',
                                   'feedback_stream': feedback_stream,
                                   'feedback_fname': 'feedback.csv'})
        res = self.message(cr, uid, id, context)
        return res

    def info(self, cr, uid, title, message, feedback_stream, context=None):
        id = self.create(cr, uid, {'title': title, 'message': message, 'type': 'info',
                                   'feedback_stream': feedback_stream,
                                   'feedback_fname': 'feedback.csv'})
        res = self.message(cr, uid, id, context)
        return res

    def error(self, cr, uid, title, message, feedback_stream, context=None):
        id = self.create(cr, uid, {'title': title, 'message': message, 'type': 'error',
                                   'feedback_stream': feedback_stream,
                                   'feedback_fname': 'feedback.csv'})
        res = self.message(cr, uid, id, context)
        return res