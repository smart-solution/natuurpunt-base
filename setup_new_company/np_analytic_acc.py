# -*- coding: utf-8 -*-
import time
import base64
import xmlrpclib

server='localhost'
dbname='natuurpunt_prod_1_6'
uid=1
pwd='n2aevl8w'

#replace localhost with the address of the server
sock = xmlrpclib.ServerProxy('http://%s:8069/xmlrpc/object'%(server))

print "START"
accrel = {}

# Find all usable taxes of NPE
# Copy the taxes
acc_ids = sock.execute(dbname, uid, pwd, 'account.analytic.account', 'search', [('company_id','=',6)]) 
print "ACCIDS:",acc_ids

for acc_id in acc_ids:
    acc_res = sock.execute(dbname, uid, pwd, 'account.analytic.account', 'copy', acc_id, {'company_id':9})
    accrel[acc_id] = acc_res
    print "ACC RES:",acc_res

# Fix the parent_id
for acc_id in acc_ids:
    pacc_res = sock.execute(dbname, uid, pwd, 'account.analytic.account', 'read', acc_id, ['parent_id'])
    print "PACC_RES:",pacc_res
    if pacc_res and pacc_res['parent_id']:
        pacc_ids = sock.execute(dbname, uid, pwd, 'account.analytic.account', 'search', [('id','=',pacc_res['parent_id'][0]),('company_id','=',6)]) 
        pacc_code = sock.execute(dbname, uid, pwd, 'account.analytic.account', 'read', pacc_ids[0], ['code'])
        print "PACC CODE:",pacc_code
        nacc_ids = sock.execute(dbname, uid, pwd, 'account.analytic.account', 'search', [('code','=',pacc_code['code']),('company_id','=',9)]) 
        print "NACC IDS:",nacc_ids
        acw_res = sock.execute(dbname, uid, pwd, 'account.analytic.account', 'write', accrel[acc_id], {'parent_id','=',nacc_ids[0]}) 
        print "AWS RES:",acw_res


#
## Remove the copy from the name
#for tax_id in alltax_ids:
#    tax_res = sock.execute(dbname, uid, pwd, 'account.tax', 'read', tax_id, ['name'])
#    ntax_res = sock.execute(dbname, uid, pwd, 'account.tax', 'write', [tax_id], {'name':ntax_res['name'][:-7]})
#


print " "
print " "
print "############################### ANALYTICAL ACCOUNT CREATED ##########################"
print " "
print " "

print "END"

