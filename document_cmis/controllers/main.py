# -*- encoding: utf-8 -*-
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

import openerp
import simplejson
import logging
import base64

_logger = logging.getLogger(__name__)

from openerp.addons.web.controllers.main import content_disposition

class Alfresco_Reports(openerp.addons.web.controllers.main.Reports):

    @openerp.addons.web.http.httprequest
    def index(self, req, action, token):
        action_load = simplejson.loads(action)
        if 'attachment_use' in action_load and action_load['attachment_use']:
            if isinstance(action_load['report_file'], list):
                context = dict(req.context)
                context.update(action_load["context"])

                file_name = action_load['report_file'][0]
                report = base64.b64decode(action_load['report_file'][1])
                report_mimetype = self.TYPES_MAPPING.get('pdf', 'octet-stream')

                return req.make_response(report,
                    headers=[
                         ('Content-Disposition', content_disposition(file_name, req)),
                         ('Content-Type', report_mimetype),
                         ('Content-Length', len(report))],
                    cookies={'fileToken': token})
        else: 
            return super(Alfresco_Reports,self).index(req, action, token)

