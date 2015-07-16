# coding: utf-8
"""
Import CRAB wizard
"""
import base64, os
import logging
import cStringIO
from tempfile import mkstemp
from openerp.osv import fields, osv
from openerp.tools.translate import _
from openerp import tools

_logger = logging.getLogger(__name__)

class CSVException(Exception):
    pass

class res_country_city_street_import(osv.osv_memory):
    _name = 'res.country.city.street.import'
    _description = 'import res.country.city.street file'
    _columns = {
        'crab_data':fields.binary('CRAB File', required=True),
        'dry_run':fields.boolean('Dry run'),
        'delimiter':fields.char('Delimiter', size=1 , required=True),
    }
    _defaults = {
        'delimiter': '|',
    }

    def _validate_line(self, line,delimiter):
        try:
            record_list = line.decode('utf-8').strip().split(delimiter)
        except UnicodeDecodeError, ex:
            raise osv.except_osv(_('Error'), ex)
        try:
            zip = record_list[0]
            if not(len(zip)) == 4 or not(zip.isdigit()):
                raise CSVException(_('zip validation error'))
        except IndexError:
            raise CSVException(_('zip missing error'))
        try:
            code = record_list[1]
        except IndexError:
            raise CSVException(_('code missing error'))
        try:
            name = record_list[2]
        except IndexError:
            raise CSVException(_('name missing error'))
        return zip,code,name

    def import_crab_csv(self, cr, uid, ids, context=None):
        data = self.read(cr, uid, ids)[0]
        try:
            crabdata = data['crab_data']
            dryrun = data['dry_run']
            delimiter = data['delimiter']
        except:
            raise osv.except_osv(_('Error'), _('Please select the file to be imported !'))

        street_obj = self.pool.get('res.country.city.street')
        city_obj = self.pool.get('res.country.city')

        feedback_template = lambda a,b:'{0}{1}{2}\r\n'.format(a.strip(),delimiter,b)

        feedback_buf=cStringIO.StringIO()
        (fileno, fp_name) = mkstemp('.csv', 'openerp_')
        try:
            os.write(fileno,base64.decodestring(crabdata))
            os.close(fileno)

            # universal-newline mode
            with open(fp_name, 'U') as csv_in_file:
                total_count = 0
                create_count = 0
                skipped_count = 0
                for line in csv_in_file:
                    if not line.strip() == '':
                        total_count += 1
                        try:
                            zip,code,name = self._validate_line(line,delimiter)
                        except CSVException, ex:
                            skipped_count += 1
                            feedback = feedback_template(line,ex)
                        else:
                            city = city_obj.search(cr,uid, [('zip','=',zip)])
                            city_rec = city_obj.browse(cr,uid,city[0]) if city else None
                            street = street_obj.search(cr,uid,[('code','=',code),('zip','=',zip)])

                            # add new street to city
                            if city and not street:
                                if dryrun == False:
                                    street_id = street_obj.create(cr,uid, {
                                        'city_id':city_rec.id,
                                        'zip':zip,
                                        'code':code,
                                        'name':name,
                                        'country_id':city_rec.country_id.id,
                                        }, context=context)

                                create_count += 1
                                feedback = feedback_template(line,_('OK'))
                            else:
                                skipped_count += 1
                                feedback = feedback_template(line,_('zip/code exists error'))

                        # client side logging
                        feedback_buf.write(feedback)
                        # server side logging
                        _logger.debug(feedback)

        except (IOError, OSError):
            raise osv.except_osv(_('IOError/OSError'), _('File can not be imported !'))
        finally:
            os.remove(fp_name)

        out=base64.encodestring(feedback_buf.getvalue())
        feedback_buf.close()
        feedback = _('{0} items imported / {1} items skipped  / {2} total items'.format(create_count,skipped_count,total_count))
        return self.pool.get('res.country.city.street.feedback').info(cr, uid, title='Import CRAB CSV feedback', message=feedback, feedback_stream=out)