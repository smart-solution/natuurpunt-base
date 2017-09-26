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

def queries(id, term):
    return '/queries/nodes?rootNodeId={}&term={}&fields=id,name,isFolder&nodeType=cm:folder'.format(id,term)

def children(id):
    return '/nodes/{}/children'.format(id)

def node(id):
    return '/nodes/{}'.format(id)

def move(id):
    return '/nodes/{}/move'.format(id)

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
