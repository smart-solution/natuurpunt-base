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

from network import get_eth0
from toolkit import sql_wrapper
from toolkit import compose
from toolkit import sum_groupby
from toolkit import create_node
from toolkit import create_xml
from toolkit import transform
from toolkit import uids_in_group
from toolkit import match_with_existing_partner
from toolkit import send_internal_alerts
from toolkit import get_approval_state
from toolkit import get_included_product_ids
from koalect import koalect_webservice
from pom import open_pom_connection, get_pom_address, setup_pom_http

import report

import visitor
