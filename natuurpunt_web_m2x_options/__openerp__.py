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
    "depends" : [
        "web_m2x_options",
        "natuurpunt_vat_mandatory",
        "natuurpunt_account",
        "natuurpunt_sale",
        "natuurpunt_sale_partner",
        "natuurpunt_membership",
        "natuurpunt_projects",
        "natuurpunt_mailing",
        "natuurpunt_bankstmt",
        "natuurpunt_crm_fixes",
        "natuurpunt_crm",
        "organisation_structure",
        "multi_analytical_account",
        "natuurpunt_purchase",
        "natuurpunt_purchase_search",
        "partner_inactive",
        "analytic",
        "purchase_requisition",
        "base",
        "membership",
        "purchase",
        "sale",
        "product",
        "account_followup",
        "account_sale_invoice_customer_account",
        "account_purchase_invoice_supplier_account",
        "stock",],
    "data" : ["natuurpunt_web_m2x_options_view.xml",],
    "init_xml" : [],
    "update_xml" : [],
    "active": False,
    "installable": True
}
