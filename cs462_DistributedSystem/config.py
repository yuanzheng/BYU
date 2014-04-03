#! /usr/bin/env python
print "Configure Servers Started!!!"
from shutil import copy, copytree, move
import subprocess
 
#the copy and copytree methods can help you move stuff out of your expanded package to various places on the server.

copytree("/tmp/package/WebServer", "/home/ubuntu/public_html/WebServer")
copytree("/tmp/package/AppServer", "/home/ubuntu/public_html/AppServer")
#copytree("/tmp/package/www", "/home/ubuntu/public_html/www")
#copytree("/tmp/package/doc", "/home/ubuntu/public_html/doc")
copy("/tmp/package/httpd.conf", "/etc/apache2/")
copy("/tmp/package/ports.conf", "/etc/apache2/")

#copy("/tmp/package/index.py", "/home/ubuntu/public_html/labs")
 
#executing commandline calls can be done with the subprocess module
#subprocess.call(["yum -y install some-package-I-forgot-in-my-AMI",""], shell=True)
 
#make sure to start any services required for this server.
 
print "Configure Servers Complete"
