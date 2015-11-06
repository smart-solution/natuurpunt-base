# -*- encoding: utf-8 -*-
{
        "name" : "Natuurpunt Print CRM invoice",
        "version" : "1.0",
        "author" : "Joeri Belis",
        "description" : "Wizard to print CRM invoice",
        "website" : "http://www.natuurpunt.be",
        "category" : "Partner management",
        "depends" : ["natuurpunt_crm"],
        "data" : [
          "natuurpunt_print_crm_invoice_wizard.xml",
          "natuurpunt_print_crm_invoice_report.xml",
          "security/ir.model.access.csv",
          ],
        "css": ["static/src/css/natuurpunt_print_crm_invoice.css"],
        "active": False,
        "installable": True,
}

