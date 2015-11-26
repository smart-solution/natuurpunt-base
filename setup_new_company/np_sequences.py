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

# Find all sequences of NPE
account_ids = sock.execute(dbname, uid, pwd, 'ir.sequence', 'search', [('company_id','=',6)]) 
print "SEQIDS:",account_ids

res_acc_ids = []

# Copy each sequence and change company_id

for account_id in account_ids:
    account_res = sock.execute(dbname, uid, pwd, 'ir.sequence', 'copy', account_id, {'company_id':9})

print " "
print " "
print "############################### SEQUENCES CREATED ##########################"
print " "
print " "





print "END"

#for a_data in a_datas:
#    sock.execute(dbname, uid, pwd, 'product.product', 'write', [a_data['product_id'][0]], {'main_supplier_id':a_data['name'][0]})

