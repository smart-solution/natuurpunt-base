# -*- coding: utf-8 -*-
##############################################################################
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

from openerp.osv import fields, osv
import logging
from openerp import SUPERUSER_ID
from openerp.tools.translate import _
import json

_logger = logging.getLogger('natuurpunt_cmis')

class memory_cmis_dropoff(osv.TransientModel):
    _name = 'memory.cmis.dropoff'

    _columns = {
        'json_object' : fields.char('json_object'),
    }

    def move_dropoff_document(self, cr, uid, json_data, context=None):
       attach_obj = self.pool.get('ir.attachment')
       vals = { 
           'res_model': context['active_model'],
           'res_id': context['active_id'],
           'object_id': json_data['id'],
           'name': json_data['name'],
           'datas_fname': json_data['name'],
       }
       # Create the Attachment
       attach_id = attach_obj.create(cr, uid, vals, context=context)

    def cmis_document_link(self, cr, uid, ids, context=None):
        """
        process the selected list of the documents on the ressource cmis dropoff
        directory and move from dropoff to target directory
        """
        wizard = self.browse(cr, uid, ids[0])
        json_string = wizard.json_object
        for json_data in json.loads(json_string):
            self.move_dropoff_document(cr,uid,json_data,context=context)


# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
