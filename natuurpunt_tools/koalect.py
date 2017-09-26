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

from osv import osv
from tools.translate import _
from contextlib import contextmanager
import requests
import logging

_logger = logging.getLogger(__name__)

def setup_koalect_webservice(url,headers):
    def api_call_wrapper(page,limit):
        response = requests.get(url.format(page,limit),headers=headers)
        response.raise_for_status()
        return response
    return api_call_wrapper

@contextmanager
def koalect_webservice_handler(url,headers):
    try:
        koalect_webservice = setup_koalect_webservice(url,headers)
        yield koalect_webservice
    except requests.exceptions.Timeout:
        raise osv.except_osv(_("Error!"),_("Koalect webservice: Timeout"))
    except requests.exceptions.TooManyRedirects:
        raise osv.except_osv(_("Error!"),_("Koalect webservice: Too many redirects"))
    except requests.exceptions.RequestException as err:
        _logger.exception(err)
        raise osv.except_osv(_("Koalect webservice Request Error!"),_(err))
    except requests.exceptions.HTTPError as err:
        _logger.exception(err)
        raise osv.except_osv(_("Koalect webservice HTTPError!"),_(err))

def koalect_webservice(url,key):
    mem = []
    page = []
    limit = 10
    headers = {'Authorization':key}
    def get_data_from_mem_or_call_api(id,koalect_api):
        # id in memoize
        try:
            index = [item[0] for item in mem].index(id)
            return mem[index]
        except ValueError:
            if mem and mem[-1][0] < id:
                return id
            else: # consume webservice
                response = koalect_api(page[-1]+1 if page else 1,limit)
                koalect_data = response.json()
                data = [(d['id'], d) for d in koalect_data['data']]
                mem.extend(data)
                page.extend([koalect_data['page']])
                return get_data_from_mem_or_call_api(id,koalect_api)
    def get_data(id):
        # support recursive call to get_data
        if isinstance( id, ( int, long ) ):
            with koalect_webservice_handler(url,headers) as koalect_api:
                return get_data_from_mem_or_call_api(id,koalect_api)
        else:
            return id
    return get_data

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
