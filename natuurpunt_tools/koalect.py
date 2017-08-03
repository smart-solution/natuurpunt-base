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

def setup_koalect_rest_api(headers):
    server_url = 'http://api.koalect.com/openapi/transactions?page={}&limit={}'
    def api_call_wrapper(page,limit):
        response = requests.get(server_url.format(page,limit),headers=headers)
        response.raise_for_status()
        return response
    return api_call_wrapper

@contextmanager
def koalect_api_handler(headers):
    try:
        koalect_rest_api = setup_koalect_rest_api(headers)
        yield koalect_rest_api
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

def consume_koalect_webservice(headers,page):
    with koalect_api_handler(headers) as koalect_api:
        response = koalect_api(page,10)
    koalect_data = response.json()
    #keep the sorted order from new to older
    data = [(d['id'], d) for d in koalect_data['data']]
    return [koalect_data['page']], data

def koalect_webservice(headers):
    mem = []
    page = []
    def store_in_memory(t):
        mem.extend(t[1])
        page.extend(t[0])
    def get_koalect_data(id):
        # id in memoize
        try:
            index = [item[0] for item in mem].index(id)
            return mem[index]
        except ValueError:
            if mem and mem[-1][0] < id:
                return []
            else: # consume more
                store_in_memory(consume_koalect_webservice(headers,page[-1]+1 if page else 1))
                return get_koalect_data(id)
    return get_koalect_data

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
