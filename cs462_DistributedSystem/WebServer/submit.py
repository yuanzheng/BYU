import cgi
import cgitb
cgitb.enable()
import urllib2
import urllib
import json
from Cheetah.Template import Template 

""" press submit button ->
    /submit -> index() -> validation() -> submit_done
    (it includes http://localhost:8010/submitimage)
    -> submit_page()


"""

def index(req):
    """ 'false' is the optional default value """
    input_bool = req.form.getfirst("filesubmit", "false")

    input_bool = cgi.escape(input_bool)

    if input_bool == "false":
        submit_page(req,[])

    elif input_bool == "true":
        validation(req) 
    else:
        raise NameError("submit templ error!")



def submit_page(req, error):
   
    t=Template(file='/home/yuanzheng/Public/public_html/cs462/lab3/WebServer/site_tmpl/submit.tmpl')

    t.errorlist = error

    if len(error) is not 0:
        imageurl = req.form.getfirst("imageurl")
        detailurl = req.form.getfirst("detailurl")
        tags = req.form.getfirst("tags")
        description = req.form.getfirst("description")
        submituser = req.form.getfirst("submituser")
        t.f = {'imageurl':imageurl, 'detailurl':detailurl, 'tags':tags, 'description':description, 'submituser':submituser}
    else:
        t.f = {'imageurl':"", 'detailurl':"", 'tags':"", 'description':"", 'submituser':""}

    
    m = Template(file='/home/yuanzheng/Public/public_html/cs462/lab3/WebServer/site_tmpl/template.tmpl')

    m.main = t.__str__()
    
    req.content_type = "text/html"
    req.write(m.__str__())
    

def validation(req):
    
    error = []  
    imageurl = req.form.getfirst("imageurl")
    detailurl = req.form.getfirst("detailurl")
    tags = req.form.getfirst("tags")
    description = req.form.getfirst("description")
    submituser = req.form.getfirst("submituser")
   
    if not imageurl:
        error.append("image url is empty")
    elif not imageurl.endswith(".jpg"): 
		error.append("imageurl should end with .jpg")

    if not detailurl:
        error.append("detail url is empty")

    if not tags:
        error.append("tags is empty")

    if not description:
        error.append("description is empty")
    elif len(description) > 1000:
		error.append("description is longer than 1000 characters")

    if not submituser:
        error.append("submit user is empty")

    if len(error) is not 0:
        submit_page(req, error)
    else:
        data = {'imageurl':imageurl, 'detailurl':detailurl, 'tags': tags, 'description':description, 'submituser':submituser}
        submit_done(req, data)
    

def submit_done(req, data):
    #url = "http://imaj-app.lddi.org:8010/submitimage"
    url = "http://localhost:8010/submitimage"

    """ convert it so it can be posted correctly """
    code_data = urllib.urlencode(data)

    response = urllib2.urlopen(url, code_data)
    i_data = json.load(response)
    #return i_data

    if i_data['success'] == True:
        complete_tmpl(req, code_data, i_data)
    else:
        submit_page(req, i_data)
    


def complete_tmpl(req, msg, resp):
    t=Template(file='/home/yuanzheng/Public/public_html/cs462/lab3/WebServer/site_tmpl/submitcomplete.tmpl')
    t.return_msg = resp
    t.submit_msg = msg

    m = Template(file='/home/yuanzheng/Public/public_html/cs462/lab3/WebServer/site_tmpl/template.tmpl')
    m.main = t.__str__()

    req.content_type = "text/html"
    req.write(m.__str__())


def submit_error(data):
    t=Template(file='/home/yuanzheng/Public/public_html/cs462/lab3/WebServer/site_tmpl/submitcomplete.tmpl')                                                                  
    m = Template(file='/home/yuanzheng/Public/public_html/cs462/lab3/WebServer/site_tmpl/template.tmpl')                                                               
    m.main = t.__str__()
    req.content_type = "text/html"
    req.write(m.__str__())                                                    




