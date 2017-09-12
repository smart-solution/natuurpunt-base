from openerp.report import report_sxw

class natuurpunt_rml_parse(report_sxw.rml_parse):
    def __init__(self, cr, uid, name, context):
        super(natuurpunt_rml_parse, self).__init__(cr, uid, name, context=context)
        self.localcontext.update({
            'display_address_contact': self._display_address_contact,
            'get_reference': self._get_reference,
            })

    def _display_address_contact(self, partner_id, customer_contact_id=False, use_company_address=False, context=None):
        cr = self.cr
        uid = self.uid
        if not(use_company_address) and customer_contact_id:
            prefix = 'p/a '
            address = customer_contact_id
        else:
            prefix = 't.a.v. '
            address = partner_id

        address_format = address.country_id and address.country_id.address_format or \
              "%(street)s\n%(street2)s\n%(city)s %(state_code)s %(zip)s\n%(country_name)s"
        args = {
            'state_code': address.state_id and address.state_id.code or '',
            'state_name': address.state_id and address.state_id.name or '',
            'country_code': address.country_id and address.country_id.code or '',
            'country_name': address.country_id and address.country_id.name or '',
            'company_name': address.parent_id and address.parent_name or '',
        }
        for field in self.pool.get('res.partner')._address_fields(cr, uid, context=context):
            args[field] = getattr(address, field) or ''
        if customer_contact_id:
            args['customer_contact_name'] = customer_contact_id.name
            address_format = prefix + '%(customer_contact_name)s\n' + address_format
        return address_format % args
    
    def _get_reference(self,reference):
        if reference:
            return 'Uw Referentie: ' + str(reference)
        else:
            return  ''
