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

# Find all accounts of NPE
account_ids = sock.execute(dbname, uid, pwd, 'account.account', 'search', [('company_id','=',6)]) 
print "ACCIDS:",account_ids

res_acc_ids = []

# Copy each account and change company id and parent account to null
# copy is overloaded in account/account.py. If an account is copied, the children are copied too
# TO chage in account.py:
# 621 #        default.update(code=_("%s (copy)") % (account['code'] or ''))
# 622         default.update(code=_("%s") % (account['code'] or ''))

account_res = sock.execute(dbname, uid, pwd, 'account.account', 'copy', account_ids[0], {'company_id':9,'parent_id':False})

print " "
print " "
print "############################### ACCOUNTS CREATED ##########################"
print " "
print " "





print "END"

#for a_data in a_datas:
#    sock.execute(dbname, uid, pwd, 'product.product', 'write', [a_data['product_id'][0]], {'main_supplier_id':a_data['name'][0]})

