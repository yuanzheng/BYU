import cgi
import cgitb
cgitb.enable()
import urllib2
import urllib
import json
from Cheetah.Template import Template

def index(req):

    #recent_data = urllib2.urlopen("http://imaj-app.lddi.org:8010/list/recent")
    #pop_data = urllib2.urlopen("http://imaj-app.lddi.org:8010/list/popular")

    recent_data = urllib2.urlopen("http://localhost:8010/list/recent")
    pop_data = urllib2.urlopen("http://localhost:8010/list/popular")

    t=Template(file='/home/yuanzheng/Public/public_html/cs462/lab3/WebServer/site_tmpl/index.tmpl')
    
    r_data = json.load(recent_data)
    """ a list, but all elements are dictionaries """
    t.recent = r_data["images"]
   
    """ add more element into each dict, viewurl which involves /view? and 
       the value of imagekey """
    for each in r_data["images"]:
        each["viewurl"] = "view?imagekey=" + each["imagekey"]

    p_data = json.load(pop_data)
    t.popular = p_data["images"]

    for each in p_data["images"]:
        each["viewurl"] = "view?imagekey=" + each["imagekey"]


    m = Template(file='/home/yuanzheng/Public/public_html/cs462/lab3/WebServer/site_tmpl/template.tmpl')

    m.main = t.__str__()

    req.content_type = "text/html"
    req.write(m.__str__())


def view(req):

    """ get the request """
    imagekey = req.form.getfirst("imagekey","")
    imagekey = cgi.escape(imagekey)
    
    """ build a new url, and send request to appServer """
    url = "http://localhost:8010/image?imagekey=" + imagekey

    """  urlopen() GET Request     """
    imagedata = urllib2.urlopen(url)
    #return imagedata.read()
    i_data = json.load(imagedata)


    t=Template(file='/home/yuanzheng/Public/public_html/cs462/lab3/WebServer/site_tmpl/view.tmpl')
    t.image = i_data

    m = Template(file='/home/yuanzheng/Public/public_html/cs462/lab3/WebServer/site_tmpl/template.tmpl')

    m.main = t.__str__()

    req.content_type = "text/html"
    req.write(m.__str__())



""" jquery call this method """
def ratesubmit(req):
    get_id = req.form.getfirst("id", "")
    get_rating = req.form.getfirst("rating", "")

    #url = "http://imaj-app.lddi.org:8010/ratesubmit"
    url = "http://localhost:8010/ratesubmit"
    data = "imagekey=" + get_id + "&rating=" + get_rating
    
    """ post data """
    rating_data = urllib2.urlopen(url, data)

    #return rating_data
    i_data = json.load(rating_data)

    #return rating_data.read()
    return i_data["rating"]


def commentsubmit(req):
    get_iKey = req.form.getfirst("imagekey", "")
    get_iUser = req.form.getfirst("commentuser", "")
    get_iComment = req.form.getfirst("comment", "")

    #url = "http://imaj-app.lddi.org:8010/commentsubmit"
    url = "http://localhost:8010/commentsubmit"
    data = "imagekey=" + get_iKey + "&commentuser=" + get_iUser + "&comment=" + get_iComment

    """ post data """
    response_data = urllib2.urlopen(url, data)
    i_data = json.load(response_data)

    if i_data['complete'] == True:
        json_resp = json.dumps("{'complete':True}")
        return json_resp
    return i_data

    #return response_data.read()


def tmpl(req):
    t= Template(file='/home/yuanzheng/Public/public_html/cs462/lab2/test.tmpl')
    t.title="Recent Images"
    t.body="this is text"

    m = Template(file='/home/yuanzheng/Public/public_html/cs462/lab2/template.tmpl')
    m.main = t.__str__()


    req.content_type = "text/html"
    req.write(m.__str__())
    

