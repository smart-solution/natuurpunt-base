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

class Binary(openerp.addons.web.controllers.main.Binary):
    _cp_path = '/web_natuurpunt_multi_attach/binary'

    @openerp.addons.web.http.httprequest
    def upload_attachment(self, req, callback, model, id, ufile):
        return super(Binary, self).upload_attachment(req, callback, model, id, ufile)