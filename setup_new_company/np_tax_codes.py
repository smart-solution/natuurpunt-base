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
tc_ids_1 = sock.execute(dbname, uid, pwd, 'account.tax.code', 'search', [('parent_id','=',False), ('company_id','=',6)]) 
print "TC IDS:",tc_ids_1

tcrel = {}

# LEVEL 1
print "LEVEL1"
for tc in tc_ids_1:
    tcsres = sock.execute(dbname, uid, pwd, 'account.tax.code', 'read', tc, ['name','code'])
    print "TCS RES:",tcsres
    tcres = sock.execute(dbname, uid, pwd, 'account.tax.code', 'create', {'name':tcsres['name'], 'code':tcsres['code'], 'company_id':9})
    tcrel[tc] = tcres

#LEVEL 2
print "LEVEL2"
tcsids2 = []
for tc in tc_ids_1:
    tc_ids_2 = sock.execute(dbname, uid, pwd, 'account.tax.code', 'search', [('parent_id','=',tc)]) 
    tcsids2 += tc_ids_2

    for tc2 in tc_ids_2:
        tcsres = sock.execute(dbname, uid, pwd, 'account.tax.code', 'read', tc2, ['name','code'])
        print "TCS RES:",tcsres
        tcres = sock.execute(dbname, uid, pwd, 'account.tax.code', 'create', {'name':tcsres['name'], 'code':tcsres['code'], 'parent_id':tcrel[tc], 'company_id':9})
        tcrel[tc2] = tcres

# LEVEL 3
print "LEVEL3"
tcsids3 = []
for tc in tcsids2:
    tc_ids_3 = sock.execute(dbname, uid, pwd, 'account.tax.code', 'search', [('parent_id','=',tc)]) 
    tcsids3 += tc_ids_3

    for tc3 in tc_ids_3:
        tcsres = sock.execute(dbname, uid, pwd, 'account.tax.code', 'read', tc3, ['name','code'])
        tcres = sock.execute(dbname, uid, pwd, 'account.tax.code', 'create', {'name':tcsres['name'], 'code':tcsres['code'], 'parent_id':tcrel[tc], 'company_id':9})
        print "TCS RES:",tcsres
        tcrel[tc3] = tcres

# LEVEL 4
print "LEVEL4"
tcsids4 = []
for tc in tcsids3:
    tc_ids_4 = sock.execute(dbname, uid, pwd, 'account.tax.code', 'search', [('parent_id','=',tc)]) 
    tcsids4 += tc_ids_4

    for tc4 in tc_ids_4:
        tcsres = sock.execute(dbname, uid, pwd, 'account.tax.code', 'read', tc4, ['name','code'])
        print "TCS RES:",tcsres
        tcres = sock.execute(dbname, uid, pwd, 'account.tax.code', 'create', {'name':tcsres['name'], 'code':tcsres['code'], 'parent_id':tcrel[tc], 'company_id':9})
        tcrel[tc4] = tcres

# LEVEL 5
print "LEVEL5"
tcsids5 = []
for tc in tcsids4:
    tc_ids_5 = sock.execute(dbname, uid, pwd, 'account.tax.code', 'search', [('parent_id','=',tc)]) 
    tcsids5 += tc_ids_5

    for tc5 in tc_ids_5:
        tcsres = sock.execute(dbname, uid, pwd, 'account.tax.code', 'read', tc5, ['name','code'])
        print "TCS RES:",tcsres
        tcres = sock.execute(dbname, uid, pwd, 'account.tax.code', 'create', {'name':tcsres['name'], 'code':tcsres['code'], 'parent_id':tcrel[tc], 'company_id':9})
        tcrel[tc5] = tcres

print "TCREL:",tcrel

print " "
print " "
print "############################### TAX CODES CREATED ##########################"
print " "
print " "
print "END"

