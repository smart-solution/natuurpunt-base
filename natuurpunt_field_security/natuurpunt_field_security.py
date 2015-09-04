# -*- coding: utf-8 -*-
##############################################################################
#
#    Natuurpunt VZW
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

class res_partner(osv.osv):
    _name = 'res.partner'
    _inherit = 'res.partner'
    
    def is_zip_ids_unique(self, cr, uid, ids, zip_ids, context=None):
        for zip in zip_ids:
            if len(self.search(cr,uid,[('zip_ids','in',zip.id)])) > 1:
                return False
        return True

    def _check_zip_ids_on_organisation_partner_afdeling(self, cr, uid, ids, context=None):
        for partner in self.browse(cr, uid, ids):
            if partner.zip_ids:
                return self.is_zip_ids_unique(cr, uid, ids, partner.zip_ids)
        return True
 
    _constraints = [
        (_check_zip_ids_on_organisation_partner_afdeling,
         "Gemeentes afdeling moeten uniek per afdeling zijn.",
         ['zip_ids']),
     ]

res_partner()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: