/**
* Package data class.
* @class Message
*/
var Package = new Class({

    /**
    * The contents of the message.
    * @property contents
    * @type Object
    */
    encryptedMessage: null,

    /**
    * Attributes that are authetnicated by the MAC.
    * @property AuthenticatedAttributes
    * @type Object<string, Object>
    */
    attributes: null,

    /**
    * List of attachments.
    * @property viewers
    * @type Object<string, AttachmentInfo>
    */
    viewers: null,

    /**
    * Constructor.
    * @method initialize
    */
    initialize: function () {
        this.attributes = {};
        this.viewers = {};
    },

    /**
    * Method to produce an object for use with JSON.stringify().
    * @method toJsonObject
    * @return {Object} The object to be serialized.
    */
    toJsonObject: function () {
        var jsonObject = {};
        jsonObject.EncryptedMessage = this.encryptedMessage.toJsonObject();
        if (Object.getLength(this.attributes) > 0) {
            var attributes = new Array();
            for (var key in this.attributes) {
                attributes.push({ Key: key, Value: this.attributes[key] });
            }
            jsonObject.Attributes = attributes;
        }
        if (Object.getLength(this.viewers) > 0) {
            var viewers = new Array();
            for (var key in this.viewers) {
                viewers.push({ Key: key, Value: this.viewers[key].toJsonObject() });
            }
            jsonObject.Viewers = viewers;
        }
        return jsonObject;
    }

});

/**
* Method to retreive this object from a JSON object.
* @method fromJsonObject
* @param jsonObject {Ojbect} Object to parse.
* @return {Package} Package parsed from the passed object.
*/
Package.fromJsonObject = function (jsonObject) {
    var parsedObject = new Package();
    parsedObject.encryptedMessage = EncryptedData.fromJsonObject(jsonObject.EncryptedMessage);
    if (jsonObject.Attributes) {
        for (var i = 0; i < jsonObject.Attributes.length; i++) {
            var item = jsonObject.Attributes[i];
            parsedObject.attributes[item.Key] = item.Value;
        }
    }
    if (jsonObject.Viewers) {
        for (var i = 0; i < jsonObject.Viewers.length; i++) {
            var item = jsonObject.Viewers[i];
            parsedObject.viewers[item.Key] = ViewerInfo.fromJsonObject(item.Value);
        }
    }
    return parsedObject;
};