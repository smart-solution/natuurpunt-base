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
import json

_logger = logging.getLogger(__name__)

content_type_header = {'Content-type': 'application/json'}
user_session = '/users/session'

def get_pom_address(d):
    try:
        if len(d) <= 1:
            return d[0]['crabAddress']
        else:
            raise osv.except_osv(_("Error!"),_("pom webservice: communication returns more than 1 address!"))
    except KeyError:
        return []

def merge_two_dicts(x, y):
    z = x.copy()   # start with x's keys and values
    z.update(y)    # modifies z with y's keys and values & returns None
    return z

def authentication_header(url,username,password):
    data = {
        'username':username,
        'password':password,
        'expiresIn':'36000',
        'platform':'NP',
        'appName':'POM-sender',
        'environmentId':'N/A',
    }
    _logger.info("Opening new POM session")
    response = requests.post(url+user_session, data=json.dumps(data), headers=content_type_header)
    response.raise_for_status()
    resjson = response.json()
    return {'X-Authentication' : str(resjson['authToken'])}

def setup_pom_webservice(url,headers):
    def api_call_wrapper(rest):
        response = requests.get(url+rest,headers=headers)
        response.raise_for_status()
        return response
    return api_call_wrapper

@contextmanager
def pom_webservice_handler(url,username,password):
    try:
        headers = merge_two_dicts(content_type_header,authentication_header(url,username,password))
        pom_webservice = setup_pom_webservice(url,headers)
        yield pom_webservice
        _logger.info("Closing POM session for {}".format(headers))
        requests.delete(url+user_session,headers=headers)
    except requests.exceptions.Timeout:
        raise osv.except_osv(_("Error!"),_("pom webservice: Timeout"))
    except requests.exceptions.TooManyRedirects:
        raise osv.except_osv(_("Error!"),_("pom webservice: Too many redirects"))
    except requests.exceptions.RequestException as err:
        _logger.exception(err)
        raise osv.except_osv(_("pom webservice Request Error!"),_(err))
    except requests.exceptions.HTTPError as err:
        _logger.exception(err)
        raise osv.except_osv(_("pom webservice HTTPError!"),_(err))

@contextmanager
def open_pom_connection(url,username,password):
    def get_data(rest):
        with pom_webservice_handler(url,username,password) as pom_api:
            response = pom_api(rest)
            return response.json()
    yield get_data

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
