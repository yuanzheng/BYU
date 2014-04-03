#! /usr/bin/env python
from boto.s3.connection import S3Connection
from boto.s3.key import Key
import zipfile
import subprocess
import urllib
from boto.ec2.elb import ELBConnection
from shutil import copy, copytree, move


AWSKey = "AKIAJHJXHTMTVQYVZJOA"
AWSSecret = "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"
S3Bucket = "cs462-packages"
PackageName = "ASongPackage5.zip"
 
print "Bootstrap process starting..."
 
def download():
	#download S3
	
	conn = S3Connection(AWSKey, AWSSecret)
	bucket = conn.create_bucket(S3Bucket)
	
	k = Key(bucket)
	k.key = PackageName
	k.get_contents_to_filename("/tmp/ASongPackage5.zip")
 
#then expand the zip onto the local drive
def extract_it():
	zip = zipfile.ZipFile("/tmp/ASongPackage5.zip", 'r')
	zip.setpassword("byu")
	zip.extractall("/tmp")



 
#if desired, call a script inside the package to continue configuration.
def config():
	subprocess.call(["sudo chmod a+x /tmp/package/config.py",""], shell=True) 
	subprocess.call(["/tmp/package/config.py",""], shell=True)
	subprocess.call(["sudo service apache2 start", ""], shell=True)

	subprocess.call(["sudo chmod a+x /home/ubuntu/public_html/AppServer/daemon-execution.py",""], shell=True)  
	subprocess.call(["sudo ./home/ubuntu/public_html/AppServer/daemon-execution.py start",""], shell=True)

	subprocess.call(["sudo chmod a+x /home/ubuntu/public_html/AppServer/ImageProcessing-daemon.py",""], shell=True) 
	subprocess.call(["sudo ./home/ubuntu/public_html/AppServer/ImageProcessing-daemon.py start",""], shell=True)

def loadbalancer():
	# Establish the connection with the load balancer
	conn = ELBConnection(AWSKey, AWSSecret)
	# Gets instance-id information
	instance_id = urllib.urlopen("http://169.254.169.254/latest/meta-data/instance-id").read()
	# webserver-lb is second in the list
	# lb = conn.get_all_load_balancers()[1]
	# Now register the instance
	# lb.register_instances(instance_id)
	conn.register_instances('webserver-lb', instance_id)



if __name__ == "__main__":
	download()
	extract_it()
	config()
	loadbalancer()
	#os.remove(myfile)
