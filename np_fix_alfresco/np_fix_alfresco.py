# -*- coding: utf-8 -*-
import time
import base64
import xmlrpclib
from cmislib.model import CmisClient, Repository

server='localhost'
dbname='natuurpunt'
uid=1
pwd='n2aevl8w'

#replace localhost wity the address of the server
sock = xmlrpclib.ServerProxy('http://%s:8069/xmlrpc/object'%(server))

"""Connect to the CMIS Server and returns the document repository"""
client = CmisClient('http://192.168.1.225:8080/alfresco/s/cmis', 'admin', 'a2aevl8w')
repo = client.getDefaultRepository()

def process(cmis_naam, cmis_object_id):
   print "***** Start processing {} *****".format(cmis_naam)
   process_cmis_dir(repo.getObject(cmis_object_id))
   print "***** End processing {} *****".format(cmis_naam)

def process_cmis_dir(cmisDir):
    query = """ 
            select cmis:objectId, cmis:name
            from cmis:folder
            where in_folder('%s')
            order by cmis:lastModificationDate desc
            """ % cmisDir
    childrenRS = repo.query(query)
    children = childrenRS.getResults()

    docs_to_move = lambda x : x.getChildren().getResults()

    counter = 1
    for child in children:
        for invoice in invoice_data:
            #print invoice['id']

            if str(invoice['id']) == child.properties['cmis:name'] and invoice['number']:
                try:
                    print "%s -> %s (%s)"%(invoice['id'],invoice['number'],counter)
                    if [x for x in children if x.properties['cmis:name'] == invoice['number']]:
                        print "Can't rename folder {} -> {} because it already exists".format(child.properties['cmis:name'],invoice['number'])
                        sourceFolder = repo.getObjectByPath(cmisDir.getPaths()[0] + '/' + child.properties['cmis:name'])
                        targetFolder = repo.getObjectByPath(cmisDir.getPaths()[0] + '/' + invoice['number'])

                        for doc in docs_to_move(sourceFolder):
                            print "move document {}".format(doc.getPaths()[0])
                            cmisDoc = repo.getObjectByPath(doc.getPaths()[0])
                            cmisDoc.move(sourceFolder, targetFolder)

                        if not docs_to_move(sourceFolder):
                            print "Delete empty folder {}".format(sourceFolder.getName())
                            sourceFolder.deleteTree()
                    else:
                        # Modify the directory name                   
                        props = {}
                        props['cmis:name'] = invoice['number']
                        child.updateProperties(props)
                        print "Folder {} renamed".format(child.properties['cmis:name'])
                    counter = counter + 1
                except:
                    continue

"""creditnota"""
invoice_ids = sock.execute(dbname, uid, pwd, 'account.invoice', 'search', [('state','not in',['draft,cancel']),('type','=','in_refund')])
invoice_data = sock.execute(dbname, uid, pwd, 'account.invoice', 'read', invoice_ids, ['number'])
process('B-Aankoopfacturen','workspace://SpacesStore/bafc9b21-d4af-4f5d-b673-566c4745079c')
process('A-Aankoopfacturen','workspace://SpacesStore/9b9e3c12-a389-43f9-8c21-874318b8935e')
process('L-Aankoopfacturen','workspace://SpacesStore/17249eee-44ba-41b4-b708-4515ab4fdd68')
process('C-Aankoopfacturen','workspace://SpacesStore/6c3be249-411a-4540-ac06-d89cbd49c417')
process('E-Aankoopfacturen','workspace://SpacesStore/5d791e55-01db-41a5-9df1-83acfc82eb1a')
process('S-Aankoopfacturen','workspace://SpacesStore/696a5d01-00ad-42f9-b20b-1909cdf37706')
process('N-Aankoopfacturen','workspace://SpacesStore/1f908f32-502c-43fb-8134-e8aa2f197791')

"""aankoopfacturen"""
invoice_ids = sock.execute(dbname, uid, pwd, 'account.invoice', 'search', [('state','not in',['draft,cancel']),('type','=','in_invoice')])
invoice_data = sock.execute(dbname, uid, pwd, 'account.invoice', 'read', invoice_ids, ['number'])
process('B-Aankoopfacturen','workspace://SpacesStore/bafc9b21-d4af-4f5d-b673-566c4745079c')
process('A-Aankoopfacturen','workspace://SpacesStore/9b9e3c12-a389-43f9-8c21-874318b8935e')
process('L-Aankoopfacturen','workspace://SpacesStore/17249eee-44ba-41b4-b708-4515ab4fdd68')
process('C-Aankoopfacturen','workspace://SpacesStore/6c3be249-411a-4540-ac06-d89cbd49c417')
process('E-Aankoopfacturen','workspace://SpacesStore/5d791e55-01db-41a5-9df1-83acfc82eb1a')
process('S-Aankoopfacturen','workspace://SpacesStore/696a5d01-00ad-42f9-b20b-1909cdf37706')
process('N-Aankoopfacturen','workspace://SpacesStore/1f908f32-502c-43fb-8134-e8aa2f197791')

print "DONE"



