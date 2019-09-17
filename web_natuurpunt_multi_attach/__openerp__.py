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
    "name": "Multiple Attachments Uploader", 
    "version": "1.0", 
    'author': 'Joeri Belis',
    'website': 'https://www.natuurpunt.be',
    "category": "Web",
    'sequence':0,
    "summary": "Attach Multiple Files to any Object",
    "description": """
    Module to upload multiple attachments.
    """,
    "depends": ["web"],
    'js': ['static/src/js/natuurpunt_multi_attach.js'],
    'qweb': ['static/src/xml/*.xml'],
    "installable": True, 
    "auto_install": False
}

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
