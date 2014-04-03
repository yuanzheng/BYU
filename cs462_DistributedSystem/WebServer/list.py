import urllib2
import json
from Cheetah.Template import Template

def popular(req):
    
    query = req.form.getfirst("nextratesort", "false")

    request = "http://localhost:8010/list/popular"

    if query is not "false":
	request += "?nextratesort=" + query

    pop_data = urllib2.urlopen(request)

    #return pop_data.read()
    t=Template(file='/home/yuanzheng/Public/public_html/cs462/lab3/WebServer/site_tmpl/popular.tmpl')
    
    """ a list, but all elements are dictionaries """
    p_data = json.load(pop_data)
    t.imagelist = p_data["images"]

    t.nextratesort = p_data["nextratesort"]

    """ add more element into each dict, viewurl which involves /view? and 
    the value of imagekey """
    for each in p_data["images"]:
        each["viewurl"] = "/view?imagekey=" + each["imagekey"]


    m = Template(file='/home/yuanzheng/Public/public_html/cs462/lab3/WebServer/site_tmpl/template.tmpl')

    m.main = t.__str__()

    req.content_type = "text/html"
    req.write(m.__str__())


def recent(req):

    query = req.form.getfirst("nextsubmitdate", "false")
    
    request = "http://localhost:8010/list/recent"
    if query is not "false":
        request += '?nextsubmitdate=' + query

    recent_data = urllib2.urlopen(request)
    #return recent_data.read()

    t=Template(file='/home/yuanzheng/Public/public_html/cs462/lab3/WebServer/site_tmpl/recent.tmpl')
    r_data = json.load(recent_data)
    t.imagelist = r_data["images"]
   
    t.nextsubmitdate = r_data["nextsubmitdate"]

    """ Add link for each image """
    for each in r_data["images"]:
        each["viewurl"] = "/view?imagekey=" + each["imagekey"]

    #return r_data["images"]
    m = Template(file='/home/yuanzheng/Public/public_html/cs462/lab3/WebServer/site_tmpl/template.tmpl')

    m.main = t.__str__()

    req.content_type = "text/html"
    req.write(m.__str__())

