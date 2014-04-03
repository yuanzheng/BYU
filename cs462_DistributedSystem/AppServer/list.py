
import uuid   #generate fake image numbers
import time   #for lab4
import boto   #connect to sdb
import urllib2
import urllib
import json

AWSKey = "AKIAJHJXHTMTVQYVZJOA"
AWSSecret = "2YVZfFXQ7mhdFeUnMjcMOJ8uc5GBjz5LXhmh8LiM"
imageDomain = "picture"
commentDomain = "comment"

def recent(req):

    request = req.form.getfirst("nextsubmitdate", "false")

    domain = _getImageDomain()
    # Query for all approved images with any submit date (magic number), sorted by submit date
    if request is "false":
        query = "['submitdate' <= '2900'] intersection ['status' = 'approved'] sort 'submitdate' desc"
    else:
        query = "['submitdate' <= '%s'] intersection ['status' = 'approved'] sort 'submitdate' desc" % request


    return _response(domain, query)


def popular(req):
    request = req.form.getfirst("nextratesort", "false")

    domain = _getImageDomain()
    
    # Query for all approved images with any submit date (magic number), sorted by submit date
    if request is "false":
        query = "['ratesort' <= '999'] intersection ['status' = 'approved'] sort 'ratesort' desc"
    else:
        query = "['ratesort' <= '%s'] intersection ['status' = 'approved'] sort 'ratesort' desc" % request

    return _response(domain, query)


def _getImageDomain():
    sdb = boto.connect_sdb(AWSKey, AWSSecret)
    domain = sdb.lookup(imageDomain)
    return domain


def _response(domain, query):

    # Get elevent rows, first 10 rows is for print the page, the 11th for next submitdate
    numRows = 11

    # Run the query
    result = domain.query(query, numRows)
    
    # Result is a generator; get 
    rawImages = [i for i in result]
    # return rawImages[0]['rating']

    size = len(rawImages)

    response = dict()
    response["images"] = list()
    
    if size < numRows:
        """ recentImages is the list of all image info """
        response["images"] = theImages(rawImages, size)
        
        response["nextsubmitdate"] = ''
        response["nextratesort"] = ''
    else:
        response["images"] = theImages(rawImages, size-1)
        response["nextsubmitdate"] = rawImages[size-1]['submitdate']
        response["nextratesort"] = rawImages[size-1]['ratesort']
    data = json.dumps(response)
    return data


def theImages(r_images, size):
    images = []
    
    #return r_images[6].name

    for i in range(size):
        """ get the key """
        imagekey = r_images[i].name
        image_dict = {"imagekey":imagekey, "thumburl":"http://theimageproject.s3.amazonaws.com/" + imagekey + "t.jpg", "submituser":r_images[i]['submituser'], "submitdate":r_images[i]['submitdate'], "description":r_images[i]['description'], "rating":r_images[i]['rating']}
        images.append(image_dict)

    return images







