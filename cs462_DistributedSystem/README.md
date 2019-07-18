# CS 462 Distributed System -- Projects Overview #

For the class project, we will be building a website that allows users to submit pictures and comment on 
and rate other user's submissions.

This system is for the purposes of teaching distributed system architecture. Each lab is a piece of a 
system that works together to provide a picture contest website. Users can submit pictures, rate pictures, 
and leave comments on pictures. All pictures and comments are reviewed before posting on the website.

Not all services required to run this website will be built by students. In particular, a Class Server 
will provide load balancing services and logging services. DNS services will also need to be configured 
prior to students building their labs.

![System Design](https://github.com/yuanzheng/BYU/blob/master/cs462_DistributedSystem/462_Lab_Overview.png)

### Lab 1: ###

1. Sign in to the AWS management Console (http://aws.amazon.com/console/)
   passwd: mvimpvm

2. Setup Linux(using Ubuntu AMI)
   Launch EC2 instance: 	   
   * go to EC2 tab
   * click `Launch Instance`, under the `Community AMIs` tab, searching for `ami-a403f7cd` (Amazon Machine Image (AMI) Ubuntu image ), select it!

	.... follow `Request Instances Wizard`, (a the first time, only need to set the server name, create and download the Key Pair. The key Pair is used to setup the remote connection from commandline, after ubuntu AMI being launched. (yuanzheng.pem))
// next time remote logining the server plattform from commandLine, we must be in the directory containing the public key.

You can see your instance in the table.

3. Setup connection 
    * click `Instances` on the NavBar
    * check your instance, and right click the name of your instance, choose `connection`, the popup shows all connection info.
    * Remote connection by using command terminal in the your keypair directory, `ssh -i yuanzheng.pem ubuntu@ec2-174-129-150-212.compute-1.amazonaws.com`. (note: machine name is ubuntu@)
    * then auto exchange keys, finish.

4. Setup Apache server
    * update Ubuntu first: $sudo apt-get update
    * install apache2, maybe mysql, php5
    * install python libraries: <br>
      >(install with the sudo apt-get install <package> command)<br>
      >libapache2-mod-python<br>
      >python-cheetah         #Templating engine<br>
      >python-dev<br>
      >python-setuptools<br>
      >python-simplejson<br>
      >python-pycurl<br>
      >python-imaging<br>
    * install EC2 AMI and API tools<br>
		  > (2011:<br>
      >  add: <br>
      >  deb `http://us.ec2.archive.ubuntu.com/ubuntu/` karmic multiverse<br>
      >  deb-src `http://us.ec2.archive.ubuntu.com/ubuntu/` karmic main<br>
      >  into `/etc/apt/sources.list.d/multiverse.list` file<br>
	> (another way, run: sudo add-apt-repository "deb http://...." -- 直接修改/etc/apt/sources.list)<br>
		  > (Instead of `us.ec2.archive.ubuntu.com/ubuntu/ ` it may instead be something like `us-west-2.ec2.archive.ubuntu.com/ubuntu/`.)<br>
		  > )<br>
      
		  > (2014:<br>
		  > Edit your /etc/apt/sources.list file and uncomment the following lines:<br>
		  > deb `http://us.archive.ubuntu.com/ubuntu/` precise multiverse<br>
		  > deb-src `http://us.archive.ubuntu.com/ubuntu/` precise multiverse<br>
		  > deb `http://us.archive.ubuntu.com/ubuntu/` precise-updates multiverse<br>
		  > deb-src `http://us.archive.ubuntu.com/ubuntu/` precise-updates multiverse<br>
		  > Instead of `us.archive.ubuntu.com` it may instead be something like `us-east-1.ec2.archive.ubuntu.com`. If the lines don't exist, just add them. Also, depending on your Ubuntu version, you'll replace `precise` with something like `lucid` (you should see other lines as examples when you open the file for editing).<br>
		  > )<br>
      > Then<br>
      > sudo apt-get update<br>
      > sudo apt-get install ec2-ami-tools ec2-api-tools<br>
    * modify httpd.conf file (/etc/apache2/)<br>
      >DirectoryIndex `index.html index.py`<br>
      >AddHandler `mod_python.py`<br>
      >PythonHandler `mod_python.publisher`<br>
      >PythonDebug On<br>
      <br>
      >maybe change the port number, root directory ....<br>

5. create simple test page
   if ec2-50-17-54-37.compute-1.amazonaws.com
   view: http:50.17.54.37/

>>After you are done modifying your custom AMI, you will need to persist the machine image and register it as an AMI. Store your machines in the cs462-machines bucket. Name your AMI with your username or netid, or something that will keep it from colliding with the names chosen by other students.

6. creating and registering your AMI
  * Bundle the volume
	  * got the X509 certificate and the private key and put them on /mnt<br>
      >(x509 private key is from TA)
    * get the Account Number and X509 certificate (through AWS->count->Security Credentials (maybe login again), AccountNumber: 180836119647)
    * scp -i yuanzheng.pem X509Cert.pem ubuntu@ec2-50-17-54-37.compute-1.amazonaws.com:~/public_html<br>
      >(The order on command: scp -i yuanzheng.pem private key immediately, and copy it to ~/ home directory)<br>
		  >scp -i yuanzheng.pem PrivateKey.pem ubuntu@ec2-50-17-54-37.compute-1.amazonaws.com:~/public_html
	  * copy cerificate and private key into /mnt/<br>
		  >cp PrivateKey.pem /mnt/<br>
		  >cp X509Cert.pem /mnt/<br>
    * created the AMI bundle in /mnt/image<br>
		  >sudo mkdir /mnt/image<br>
		  >cd /mnt/<br>
		  >sudo ec2-bundle-vol -k PrivateKey.pem -c X509Cert.pem -u AccountNumber -d /mnt/image<br>
		  >('enter,ignore ...')<br>
		  >Waiting ...<br>

7. Upload the bundle to S3<br>
  >ec2-upload-bundle -b cs462-machines/TheImageName(song) -m /mnt/image/image.manifest.xml -a <access key> -s <secret key>(through AWS->count->Security Credentials TO GET access key(AKIAJHJXHTMTVQYVZJOA) and secret key(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))

8. Register the AMI<br>
	>ec2-register cs462-machines/TheImageName(song)/image.manifest.xml --K PrivateKey.pem -C X509Cert.pem (now I got image id, 'ami-1adf2c73')

9. Bootstrapping the Server<br>
    * Package Upload Script<br>
      >This script will package your local code into a zip file and upload it to S3. <br>
	    >This script should upload the package to the cs462-packages bucket. (createpackage.py  -- executable)<br>
    * UserData Script<br>
	    >This script is copied into the UserData field (or passed as a command line argument) when launching an AMI. This script knows how to download the package from S3 and expand it onto the local disk. (userdata.py)<br>
    * Server Config Script<br>
      >This script is inside your local code, and is included in the package on S3. <br>
	    >This script is executed by the UserData Script, and is used to install packages.<br>
	    >(config.py  -- executable, put it into package)


### lab2: ###

1. AppServer return a string, "http://imaj-app.lddi.org:8010/list/recent or popular". It's not dict()
So we need json.load() to convert it.
$recent is the list [{....}, {...}, ...]
$image is each dict {} from the list $recent
$image.thumburl is the one of keys in each dict ({..., thumburl:"324242.2sdf2.243", ...}), and return the value. 
2.
3. The root directory for each template is where the index.py locates.

all templates are put into fold site_tmpl. HOwever, all links inside template.tmpl should be changed:
example:
	<li><a href="./">Home</a></li>
	<li><a href="./list/popular">Popular</a></li>
	<li><a href="./list/recent">Recent</a></li>
	<li><a href="./submit">Submit</a></li>
Directory: http://localhost:8080/cs462/lab2/
		   http://localhost:8080/cs462/lab2/site_tmpl
		   ...
Note: ./ current directory is not site_tmpl. It is the parent directory, http://localhost:8080/cs462/lab2/
		style sheet should be modified, <link rel="stylesheet" type="text/css" href="./site_tmpl/style.css" />
		So it cannot be just href="style.css"

*** Since all templates are in the folder, check all links in each template, if they point to the correct directories. 
    For lab2 the correct root directory is http://localhost:8080/cs462/lab2/ ***

/list/recent

The root directory is at http://localhost:8080/cs462/lab2/list/recent
1.
2.
3.




//////////////////////// change the port on my local machine, each lab uses diff port /////////
(It cannot be setup on AWI, only for my laptop)
cs360 lab uses 8080
cs462 lab uses 8060

1. vim /etc/httpd.conf
2. <VirtualHost *:8080>
      DocumentRoot /home/yuanzheng/Public/public_html/
      <Directory />
          ....
3. <VirtualHost *:8060>
      DocumentRoot /home/yuanzheng/Public/public_html/cs462/lab2
      <Directory />
          ...
4. ports.conf  --- add one more port (Listen 8060)



//////////////////////////////// localhost:8060/view?imagekey=123123   ////////////////
When click a pic, it will send /view?imagekey=12345 request to server, so we need a 'view' method
In root directory, index.py file 
Since both /index.py/view  and /view should work, 'view' should be one of method in index.py

( add a view method:     def view(req): )
The previous httpd.config cannot run /view (in index.py )

Modification of httpd.conf
```Html
          #AddHandler mod_python .py
          SetHandler mod_python
          <Files ~ "\.(css|js|jpg|png)$">
            SetHandler default-handler
          </Files>
```


//////////////////// submit page
open the submit page and send submit page both, use the same method
call.
In the main page, 'submit' button will send request for /submit/
if there is no such directory, server will looking for submit.py file
in root directory.
Since submit.tmpl, <form action="/submit" method="post" 
We cannot create a submit direstory. So the best way is to create a
submit.py in root directory.
					

////////////////////// urlencode()
data = {....}
urllib.urlencode(data);
The reason is for avoid someone adding query code as part.
e.g. /comment?


Load Balancer:
in Userdata.py, adding a function
it should inlude, 
```Python
import urllib
from boto.ec2.elb import ELBConnection
 
AWSKey = "{redacted}"
AWSSecretKey = "{redacted}"
 
# Establish the connection with the load balancer
conn = ELBConnection(AWSKey, AWSSecretKey)
 
# Gets instance-id information
instance_id = urllib.urlopen("http://169.254.169.254/latest/meta-data/instance-id").read()
 
# webserver-lb is second in the list
lb = conn.get_all_load_balancers()[1]
 
# Now register the instance
lb.register_instances(instance_id)
```


### lab3: ###
```Python
def getImageDomain():
	sdb = boto.connect_sdb(AWSKey, AWSSecret)
	domain = sdb.lookup(imageDomain)
	return domain

def _getmostrecentimage():
	domain = _getImageDomain()
	query = "['submitdate' <= '2900'] intersection ['status'='approved'] 	sort 'submitdate' desc"

params = urllib.urlencode("
```
