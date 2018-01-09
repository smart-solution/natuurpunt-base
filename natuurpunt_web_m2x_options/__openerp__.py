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

{
    "name" : "natuurpunt_web_m2x_options",
    "version" : "1.0",
    "author" : "Natuurpunt (joeri.belis@natuurpunt.be)",
    "website" : "www.natuurpunt.be",
    "category" : "base",
    "description": """
    - add web_m2x_options to views
""",
    "depends" : ["account","organisation_structure","purchase","natuurpunt_crm","analytic","natuurpunt_vat_mandatory","web_m2x_options",],
    "data" : ["natuurpunt_web_m2x_options_view.xml",],
    "init_xml" : [],
    "update_xml" : [],
    "active": False,
    "installable": True
}
