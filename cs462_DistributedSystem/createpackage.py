#! /usr/bin/env python

import os
import tempfile
import zipfile
from os.path import join, getsize
import subprocess
from shutil import copy, copytree, move

#this script's job is to package a directory into a zip file specified in the args, and upload it to S3.
 
#defaults
AWSKey = "AKIAJHJXHTMTVQYVZJOA"
AWSSecret = "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"
S3Bucket = "cs462-packages"
 
#option parsing
from optparse import OptionParser
parser = OptionParser(usage="usage: %prog sourcepath packagename")
parser.add_option("-s", "--source", help="path to source files", dest="sourcepath")
parser.add_option("-n", "--name", help="name of package in S3", dest="packagename")
(options, args) = parser.parse_args()
 
if options.sourcepath is None or options.packagename is None:
    parser.error("Missing Arguments")
#check source path
if not os.path.isdir(options.sourcepath):
    parser.error("Invalid source path")
 
options.sourcepath = os.path.normpath(options.sourcepath)
print "options"
print options.sourcepath
 

"""
#create zipfile
ziptemp, ziptempname = tempfile.mkstemp()
os.close(ziptemp)
print ziptempname
 
zip = zipfile.ZipFile(ziptempname, 'w')
 
allfiles = []
 
for root, dirs, files in os.walk(options.sourcepath):
    for file in files:
        allfiles.append(os.path.join(root, file))
 
def relPath(filename):
    return filename[len(options.sourcepath)+1:]
 
#print "-"*20
for each in allfiles:
    #print relPath(each)
    try: zip.write(each, relPath(each))
    except IOError: print "Error adding %s" % each
zip.close()
 
"""
subprocess.call(["zip -r -P byu zip_package.zip package",""], shell=True)

#upload to S3
from boto.s3.connection import S3Connection
conn = S3Connection(AWSKey, AWSSecret)
bucket = conn.create_bucket(S3Bucket)
from boto.s3.key import Key
k = Key(bucket)

"""./createpackage.py --source package --name ASongPackage5.zip , this is the name shows up S3 bucket"""
k.key = options.packagename
#k.set_contents_from_filename(ziptempname)


"""zip_package.zip is the name on my laptop"""
k.set_contents_from_filename("zip_package.zip")
 
#delete temp file
#os.remove(ziptempname)
#os.remove("zip_package.zip");
print "Done"

