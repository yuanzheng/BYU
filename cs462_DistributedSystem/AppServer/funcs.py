# Lab4
import uuid
import time
import boto
import json
import Image
import ImageDraw
import urllib
import urllib2
from boto.sqs.message import RawMessage
from boto.s3.connection import S3Connection
from boto.s3.key import Key

AWSKey = "AKIAJHJXHTMTVQYVZJOA"
AWSSecret = "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"
imageQueue = "imageprocess"
commQueue = "commentprocess"
imageRQueue = "imageresult"
imagePQueue = "imageprocess"
approvalprocessQueue = "approvalprocess"
imageDomain = "picture"
S3Bucket = "theimageproject"
original_image = "original.jpg"
main_image = "main.jpg"
thumbnail_image = "thumbnail.jpg"


""" connect to simpleDB """
def _getImageDomain():
    sdb = boto.connect_sdb(AWSKey, AWSSecret)
    domain = sdb.lookup(imageDomain)
            
    return domain

def _getImageProcessQueue(name):
    
    # Connect the queue
    sqs = boto.connect_sqs(AWSKey, AWSSecret)
    # create_queue either create image processingQueue or retrive it if it is already existed
    queue = sqs.create_queue(name)

    return queue

def setSQS(data, queue):
    # Put the message in the queue
    # m is raw message object
    # queue only accept message object
    m = RawMessage()
    m.set_body(json.dumps(data))
    # add comment to Queue
    status = queue.write(m)


""" 
    commentsubmit -> save(newItem) -- simpleDB
                  -> commentApprovalProcess -- addCommentToQeue()
    Approvecomment -> send(http request) -> AppServer -- /commentresult
"""
def commentApprovalProcess(commentkey, c):
    data = dict()
    data['commentkey'] = str(commentkey)
    data['submitdate'] = c['submitdate']
    data['comment'] = str(c['comment'])
    data['submituser'] = str(c['submituser'])
    # Connect to SQS and open the queue
    q = _getImageProcessQueue(commQueue)
    """
    sqs = boto.connect_sqs(AWSKey, AWSSecret)
    q = sqs.create_queue(commQueue)
    """
    # build the comment_process queue
    setSQS(data, q)
    """
    # Put the message in the queue
    # m is raw message object
    # queue only accept message object
    m = RawMessage()
    m.set_body(json.dumps(data))
    # add comment to Queue
    status = q.write(m)
    """


"""
    create imageprocess queue --- used by Image Processing Daemon
    /submitimage -> save(item) -- simpleDB
    -> imageProcess -- addImageToImageProcessQueue
    -> imageProcessDaemon -> imageresult -- addittoimageresultQueue
                          -> S3
    ProcessingResultDaemon reads imageresultQueue
"""
def imageProcess(imagekey,submitdate): 

    data = dict()
    data["imagekey"] = imagekey
    data["submitdate"] = submitdate
    
    # Connect to SQS and open the queue
    q = _getImageProcessQueue(imageQueue)
    """
    sqs = boto.connect_sqs(AWSKey, AWSSecret)
    q = sqs.create_queue(imageQueue)
    """
    setSQS(data,q)


"""
    retrive data from imageresult queue
"""
def readImageResult():
    # Open the queue
    q = _getImageProcessQueue(imageRQueue)
    """
    sqs = boto.connect_sqs(AWSKey, AWSSecret)
    # create_queue either create imageRQueue or retrive it if it is already existed
    q = sqs.create_queue(imageRQueue)
    """
    q.set_message_class(RawMessage)

    # Get all the messages in the queue
    results = q.get_messages()

    # log("imageResultQueue %s" % len(results))
    data = dict()

    # ???? how many results? do I need this loop ???
    # no, just take the first one (as long as you can get one, since there 
    # may be many processing daemon reading this queue in every 10 seconds.
    if len(results) != 0:
        msg = json.loads(results[0].get_body())
        # deQueue
        q.delete_message(results[0])
        return msg

    return data


""" if msg from imageresult is not null, then updata simpleDB """
def update_simpleDB(msg):
    """ update and retrieve from simpleDB """
    domain = _getImageDomain()
    c = domain.get_item(msg['imagekey'])
    c['imageheight'] = msg['imageheight']
    c['imagewidth'] = msg['imagewidth']
    c.save()

# lab5 image processing daemon call
# Read data from imageprocess queue -- imagekey, get the imageurl from simpleDB
def readImageProcessQueue():

    q = _getImageProcessQueue(imagePQueue)

    q.set_message_class(RawMessage)

    # Get all the messages in the queue
    results = q.get_messages()

    data = dict()

    # ???? how many results? do I need this loop ???
    # no, just take the first one (as long as you can get one, since there 
    # may be many processing daemon reading this queue in every 10 seconds.
    if len(results) != 0:
        msg = json.loads(results[0].get_body())
        # deQueue
        q.delete_message(results[0])
        return msg

    return data

# Download the image through the imageurl. Modify the download 
# image, it include create the main image with waterMark and 
# the thumbnail image. It also
# @param msg the data from imageProcess_Queue, it
#        includes 'imagekey' and 'image submite date'
# @return images it includes both main and thumbnail images' names, and size 
#         of the main image
def processImage(msg):
    downloadImage(msg)

    size = createMainImage()
    createThumbnail()

    m = "Image processing is done!"
    log(m)
    return size



def createThumbnail():

    image = Image.open(original_image)
    # (width, height)
    x, y = image.size
    dimension = 0,0

    if x == y:
        dimension = 75, 75

    elif x > y:
        dimension = 600, 75
    else:
        dimension = 75, 600

    # create a thumbnail image
    image.thumbnail(dimension)
    # pass thumbnail image to crop
    region = crop_image(image)
    # the new image is saved
    region.save(thumbnail_image, 'JPEG')

    m = "Thumbnail is created"
    log(m)


def crop_image(im):
    w,h = im.size
    
    # (l, u) : the coordinate of leftupper corner
    # (r, e) : the coordinate of rightbottom corner
    l = 0
    u = 0
    r = w
    e = h
    
    if w > 75:
        l = (w-75)/2
        r = w- (w-75)/2
                                             
    if h > 75:
        u = (h-75)/2
        e = h-(h-75)/2

    region = im.crop((l,u,r,e))
    
    return region


# create main image: longest dimension 600x600
def createMainImage():
    dimension = 600, 600
    image = Image.open(original_image)

    x, y = image.size
    
    # resize the image
    image.thumbnail(dimension)
    # add the water mark
    addWatermark(image)

    image.save(main_image, 'JPEG')
    # the new size    
    size = image.size
    
    m = "Main image is created (%dx%d)" % size
    log(m)
    return size


# add water mark on the main image
def addWatermark(image):

    watermark = Image.new("RGBA", image.size)
    waterdraw = ImageDraw.ImageDraw(watermark, "RGBA")
    waterdraw.text((10,10), "The Image Project")

    watermask = watermark.convert("L").point(lambda x: min(x,100))

    watermark.putalpha(watermask)

    image.paste(watermark, None, watermark)

    m = "WaterMark is added"
    log(m)


# download image from url, save it as original.jpg
def downloadImage(msg):
    
    domain = _getImageDomain()
    item = domain.get_item(msg['imagekey'])
    url = item['imageurl']

    download = urllib2.urlopen(url)
    localfile = open(original_image, 'w')
    localfile.write(download.read())
    localfile.close()

    m = "Image download is done :%s" % str(msg['imagekey'])
    log(m)

# create image_Result Queue
# @param msg the image data from simpleDB
# @param size the new main image dimensions
def imageResultQueue(msg, size):
    data = dict()

    data['imagekey'] = str(msg['imagekey'])
    data['imagewidth'],data['imageheight'] = size
    data['processeddate'] = time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())

    q = _getImageProcessQueue(imageRQueue)
    # build the comment_process queue
    setSQS(data, q)

    m = "Create Image Result Queue is done :%s" % str(msg['imagekey'])
    log(m)

# image processing daemon -> S3
def update_S3(msg):

    """ update S3 """
    conn = S3Connection(AWSKey, AWSSecret)
    bucket = conn.create_bucket(S3Bucket)

    # the key is the imagekey
    k1 = Key(bucket)
    k1.key = str(msg['imagekey']) + "m.jpg" 
    k1.set_contents_from_filename(main_image)
    k1.set_acl('public-read')

    k2 = Key(bucket)
    k2.key = str(msg['imagekey']) + "t.jpg"
    k2.set_contents_from.filename(thumbnail_image)
    k2.set_acl('public-read')

    m = "Update_S3 is done :%s" % str(msg['imagekey'])
    log(m)

"""
    create image approval process queue
"""
def ApprovalProcess(msg):
    data = dict()
    # The messages received from the imageresult queue
    # ???? format ??? str or int
    data['imagekey'] = str(msg['imagekey'])
    data['imageheight'] = str(msg['imageheight'])
    data['imagewidth'] = str(msg['imagewidth'])

    # retrive rest data from simpleDB 
    domain = _getImageDomain()
    item = domain.get_item(msg['imagekey'])

    data['imageURL'] = item['imageurl']
    data['tag'] = item['tag']
    data['description'] = item['description']
    data['submituser'] = item['submituser']
    data['submitdate'] = item['submitdate']

    # Connect to SQS and create the approval process queue
    sqs = boto.connect_sqs(AWSKey, AWSSecret)
    q = sqs.create_queue(approvalprocessQueue)

    # Put the message in the queue
    # m is raw message object
    # queue only accept message object
    m = RawMessage()
    m.set_body(json.dumps(data))
    # add comment to Queue
    status = q.write(m)

        
        
        
def log(msg):
    url = "http://imaj.lddi.org:8080/log/submit"
    student = "song"
    _type = "INFO"
    system = "appserver"

    data = {"student":student, "type":_type, "system":system, "message":msg}

    code_data = urllib.urlencode(data)
    send = urllib2.urlopen(url, code_data)



        















