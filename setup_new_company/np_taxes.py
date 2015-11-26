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
taxrel = {}

# Find all usable taxes of NPE
# Copy the taxes
tax_ids = sock.execute(dbname, uid, pwd, 'account.tax', 'search', [('company_id','=',6),('parent_id','=',False)]) 
sub_tax_ids = sock.execute(dbname, uid, pwd, 'account.tax', 'search', [('company_id','=',6),('parent_id','!=',False)]) 
print "TAXIDS:",tax_ids

for tax_id in tax_ids:
    tax_res = sock.execute(dbname, uid, pwd, 'account.tax', 'copy', tax_id, {'company_id':9})
    taxrel[tax_id] = tax_res
    print "TAX RES:",tax_res

# Copy the subtaxes
for stax_id in sub_tax_ids:
    ptax_res = sock.execute(dbname, uid, pwd, 'account.tax', 'read', stax_id, ['parent_id'])
    print "PTAXRES:",ptax_res['parent_id'][0]
    stax_res = sock.execute(dbname, uid, pwd, 'account.tax', 'copy', stax_id, {'company_id':9, 'parent_id':taxrel[ptax_res['parent_id'][0]]})

alltax_ids = tax_ids + sub_tax_ids

# Remove the copy from the name
for tax_id in alltax_ids:
    tax_res = sock.execute(dbname, uid, pwd, 'account.tax', 'read', tax_id, ['name'])
    ntax_res = sock.execute(dbname, uid, pwd, 'account.tax', 'write', [tax_id], {'name':ntax_res['name'][:-7]})





print " "
print " "
print "############################### TAX CREATED ##########################"
print " "
print " "

print "END"

