/**
* Message data class.
* @class Message
*/
var Message = new Class({

    /**
    * The contents of the message.
    * @property contents
    * @type Object
    */
    contents: null,

    /**
    * Attributes that are authetnicated by the MAC.
    * @property AuthenticatedAttributes
    * @type Object<string, Object>
    */
    authenticatedAttributes: null,

    /**
    * List of attachments.
    * @property attachments
    * @type Object<string, AttachmentInfo>
    */
    attachments: null,

    /**
    * Constructor.
    * @method initialize
    */
    initialize: function () {
        this.authenticatedAttributes = {};
        this.attachments = {};
    },

    /**
    * Method to produce an object for use with JSON.stringify().
    * @method toJsonObject
    * @return {Object} The object to be serialized.
    */
    toJsonObject: function () {
        var jsonObject = {};
        jsonObject.Contents = this.contents;

        if (Object.getLength(this.authenticatedAttributes) > 0) {
            var attributes = new Array();
            for (var key in this.authenticatedAttributes) {
                attributes.push({ Key: key, Value: this.authenticatedAttributes[key] });
            }
            jsonObject.Attributes = attributes;
        }
        if (Object.getLength(this.attachments) > 0) {
            var attachments = new Array();
            for (var key in this.attachments) {
                viewers.push({ Key: key, Value: this.attachments[key].toJsonObject() });
            }
            jsonObject.Attachments = attachments;
        }

        return jsonObject;
    }

});

/**
* Method to retreive this object from a JSON object.
* @method fromJsonObject
* @param jsonObject {Ojbect} Object to parse.
* @return {Message} Message parsed from the passed object.
*/
Message.fromJsonObject = function (jsonObject) {
    var parsedObject = new Message();
    parsedObject.contents = jsonObject.Contents;

    if (jsonObject.Attributes) {
        for (var i = 0; i < jsonObject.Attributes.length; i++) {
            var item = jsonObject.Attributes[i];
            parsedObject.authenticatedAttributes[item.Key] = item.Value;
        }
    }
    if (jsonObject.Attachments) {
        for (var i = 0; i < jsonObject.Attachments.length; i++) {
            var item = jsonObject.Attachments[i];
            parsedObject.attachments[item.Key] = AttachmentInfo.fromJsonObject(item.Value);
        }
    }

    return parsedObject;
};