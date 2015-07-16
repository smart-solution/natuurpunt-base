# -*- encoding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2004-2009 Tiny SPRL (<http://tiny.be>).
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
from openerp.tools.translate import _

class fleet_vehicle(osv.osv):
    _inherit = 'fleet.vehicle'
    
    _columns = {
        'asset_id': fields.many2one('account.asset.asset', 'Asset', select=True),
        'key_elec': fields.char('Keycode electr', len=16),
        'key_mech': fields.char('Keycode mech', len=16),
        'keur': fields.boolean('Keuringsbewijs'),
        'gelijk': fields.boolean('Gelijkvormigheidsattest'),
        'inschr': fields.boolean('Inschrijvingsbewijs'),
        'ident': fields.boolean('Identificatieverslag'),
    }
    
    _defaults = {
        'keur': True,
        'gelijk': True,
        'inschr': True,
        'ident': True,
    }

fleet_vehicle()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
