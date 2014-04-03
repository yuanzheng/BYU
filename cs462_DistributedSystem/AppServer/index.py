
import cgi
import uuid   #generate fake image numbers
import time   #for lab4
import boto   #connect to sdb
import funcs  #for lab4
import urllib2
import urllib
import json

AWSKey = "AKIAJHJXHTMTVQYVZJOA"
AWSSecret = "2YVZfFXQ7mhdFeUnMjcMOJ8uc5GBjz5LXhmh8LiM"
imageDomain = "picture"
commentDomain = "comment"


def image(req):
    request = req.form.getfirst("imagekey","")

    image_domain = _getImageDomain()
    image_info = image_domain.get_item(request)
    #return image_info
    #return image_info.name
    """ image is a dictionary """

    comment_domain = _getCommentDomain()
    """ don't use sort, since it cannot sort it """
    query = "['imagekey' = '%s'] intersection ['status' = 'approved']" % request
    # comment list from simpleDB
    result = comment_domain.query(query)
    comment_list = [i for i in result]
    
    return _response(image_info, comment_list, request)
    

def _response(image_info, comment_list, key):

    response = dict()
    response["imagekey"] = key
    response["imageURL"] = "http://theimageproject.s3.amazonaws.com/" + key + "m.jpg"
    response["detailURL"] = image_info["detailurl"]
    response["imageheight"] = image_info["imageheight"]
    response["imagewidth"] = image_info["imagewidth"]
    response["tag"] = image_info["tag"]
    #size_tag = len(image_info["tag"])
    """
    if size_tag <= 1:
        response["tag"] = image_info["tag"]
    else:
        response["tag"] = image
    """
    response["description"] = image_info["description"]
    response["submituser"] = image_info["submituser"]
    response["submitdate"] = image_info["submitdate"] 
    #return float(image_info["rating"])/100
    response["rating"] = float(image_info["rating"]) / 100
    response["ratingcount"] = int(image_info["ratingcount"])

    response["comments"] = list()

    for each in comment_list:
        comment = dict()
        comment["commentkey"] = each.name
        comment["submituser"] = each["submituser"]
        comment["submitdate"] = each["submitdate"]
        comment["comment"] = each["comment"]
        response["comments"].append(comment)          

    data = json.dumps(response)
    return data



    
def _getImageDomain():
    sdb = boto.connect_sdb(AWSKey, AWSSecret)
    domain = sdb.lookup(imageDomain)
    
    return domain

 
def _getCommentDomain():
    sdb = boto.connect_sdb(AWSKey, AWSSecret)
    domain = sdb.lookup(commentDomain)
    
    return domain


def theImages(r_images, size):
    images = []
    
    for i in range(size):
        """ get the key of each image """
        imagekey = r_images[i].name

        """ thumburl: .... + t.jpg because this is a small tab image """
        image_dict = {"imagekey":imagekey, "thumburl":"http://theimageproject.s3.amazonaws.com/" + imagekey + "t.jpg", "submituser":r_images[i]['submituser'], "submitdate":r_images[i]['submitdate'], "description":r_images[i]['description'], "rating":r_images[i]['rating']}
        images.append(image_dict)

    return images


def ratesubmit(req):
    image_key = req.form.getfirst("imagekey", "")
    """ webserver submited the rating is '3.21' float point in string """
    rating = float(req.form.getfirst("rating",""))

    image_domain = _getImageDomain()
    image_info = image_domain.get_item(image_key)

    """ the rating from database is '123' integer in string """
    oldrating = float(image_info["rating"])/100
    oldratingcount = int(image_info["ratingcount"])

    newrating = oldrating + ((rating - oldrating)/(oldratingcount+1))
    newratingcount = oldratingcount + 1

    """ rating returning to webserver should be float point number, but updating
    database should be integer in string ('234') """

    image_info["rating"] = int(newrating*100)
    image_info["ratingcount"] = "%0#5d" % newratingcount
    image_info["ratesort"] = "%s%s" %(image_info['rating'], image_info['submitdate'])

    image_info.save()

    """ ? func.addCommentToQueue()  ? """
    """ ? return json.dumps() ? """
    #return {"rating": newrating}
    return json.dumps({"rating":newrating})


# submit comments --- called by webserver
def commentsubmit(req):
    # Generate a UUID for this comment
    commentkey = uuid.uuid1()

    # Create a new item in the comment domain
    domain = _getCommentDomain()
    c = domain.new_item(commentkey)
    c['submituser'] = req.form.getfirst("commentuser","") 
    c['imagekey'] = req.form.getfirst("imagekey", "")
    c['comment'] = req.form.getfirst("comment","")
    c['submitdate'] = time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())
    # save it into simpleDB
    c.save()

    submituser = req.form.getfirst("commentuser", "")
    imagekey = req.form.getfirst("imagekey", "")

    msg = "Comment submit by %s for imagekey %s" % (submituser,imagekey)
    log(msg)

    # ApprovalProcess -- Put the comment in the SQS approval queue (implementation not important for Lab 3)
    funcs.commentApprovalProcess(commentkey, c)

    response = {'complete':True, 'commentkey':'%s' % str(commentkey)}
    return json.dumps(response)


# approve comment result   --- last step called by Approval client (Daemon)
def commentresult(req):
    domain = _getCommentDomain()

    commentkey = req.form.getfirst("commentkey","")
    item = domain.get_item(commentkey)

    # item['commentkey'] = commentkey
    item['approveuser'] = req.form.getfirst("approveuser","")

    # must use '==', but not 'is'. Because req.form.getfirst() return
    # a u"true" (unicode string)
    if req.form.getfirst("approved","") == "true":
        item['status'] = "approved"
    else:
        item['status'] = "denied"
        
    item.save()

    msg = "Comment status changed to %s:%s" % (item['status'], str(commentkey))
    log(msg)

    # return It may return anything, as long as the HTTP status code is 200. 



# This method creates a UUID for the image, saves its information to SimpleDB,
# and sends a message through the image processing queue. ---- called by Webserver
def submitimage(req):
    imagekey = uuid.uuid1()
    
    """ save it into simpleDB """
    # Create a new item in the comment domain
    domain = _getImageDomain()
    c = domain.new_item(imagekey)
    c['tag'] = req.form.getfirst("tags", "")
    c['imageurl'] = req.form.getfirst("imageurl", "")
    c['detailurl'] = req.form.getfirst("detailurl", "")
    c['description'] = req.form.getfirst("description", "")
    c['submituser'] = req.form.getfirst("submituser", "")
    c['submitdate'] = time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())
    c['rating'] = "000"
    c['ratingcount'] = "00000"
    c['ratesort'] = "%s%s" % (c['rating'], c['submitdate'])
    # save it into simpleDB
    c.save()

    msg = "processed submission by %s (%s)" % (req.form.getfirst("submituser", ""), imagekey)
    log(msg)

    """ imageprocess add image into SQS queue """
    funcs.imageProcess(str(imagekey), c['submitdate'])

    response = {"success":True, "imagekey":"%s" % str(imagekey)}
    """ the reason using json is for ensuring the return is still a list. without json, return is string"""
    return json.dumps(response)


""" invoked by ApproveImage (lab6), update the simpleDB """
def approvalresult(req):
    domain = _getImageDomain()

    imagekey = req.form.getfirst("imagekey","")
    item = domain.get_item(imagekey)

    item['imagekey'] = imagekey
    item['approveuser'] = req.form.getfirst("approveuser","")

    # must use '==', but not 'is' (unicode string)
    if req.form.getfirst("approved","") == "true":
        item['status'] = "approved"
    else:
        item['status'] = "denied"
    # updates the status of the image in SimpleDB to "approved" or "denied" as appropriate. 
    item.save()

    # It also posts as message to the LoggingService to state that result of the approval. 
    msg = "Image status changed to %s:%s" % (item['status'], str(imagekey))
    log(msg)

    # return It may return anything, as long as the HTTP status code is 200. 
    

def log(msg):
    url = "http://imaj.lddi.org:8080/log/submit"
    student = "song"
    _type = "INFO"
    system = "appserver"

    data = {"student":student, "type":_type, "system":system, "message":msg}

    code_data = urllib.urlencode(data)
    send = urllib2.urlopen(url, code_data)












