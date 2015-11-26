# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2010-2012 OpenERP SA (<http://openerp.com>).
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

import logging
import openerp
from openerp.osv import osv, fields

_logger = logging.getLogger(__name__)

class res_users(osv.Model):
    _inherit = 'res.users'

    def _auth_oauth_signin(self, cr, uid, provider, validation, params, context=None):
        oauth_uid = validation['user_id']
        oauth_email = validation['email']
        
        # eerste keer signup?
        user_ids = self.search(cr, uid, [("email_work", "=", oauth_email),("oauth_uid", "=", False)])
        if user_ids:
            assert len(user_ids) == 1
            user = self.browse(cr, uid, user_ids[0], context=context)
            user.write({'oauth_uid': oauth_uid})
            user.write({'oauth_provider_id': provider})
        
        # default 
        return super(res_users, self)._auth_oauth_signin(cr, uid, provider, validation, params, context=context)
