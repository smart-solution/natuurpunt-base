# -*- coding: utf-8 -*-
##############################################################################
#
#    Smart Solution bvba
#    Copyright (C) 2010-Today Smart Solution BVBA (<http://www.smartsolution.be>).
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

{
    "name" : "report_account_open_items",
    "version" : "1.0",
    "author" : "Smart Solution (fabian.semal@smartsolution.be)",
    "website" : "www.smartsolution.be",
    "category" : "Generic Modules/Accounting",
    "description": """This wizard will identify all open items as valid on the end of a fiscal period. This wizard follows the same logic compared with year-end closing, but can be applied on whichever fiscal period in the past.
""",
    "depends" : ["account",],
    "data" : [
        'report_account_open_items_view.xml',
        'report_account_open_items_data.xml',
        'security/report_account_open_items_security.xml'
#        'security/ir.model.access.csv'
        ],
    "active": False,
    "installable": True
}
