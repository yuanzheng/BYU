/**
* ViewerInfo data class.
* @class ViewerInfo
*/
var ViewerInfo = new Class({

    /**
    * The encrypted message key.
    * @property messageKey
    * @type EncryptedData
    */
    messageKey: null,

    /**
    * The encrypted message digest.
    * @property messageDigest
    * @type EncryptedData
    */
    messageDigest: null,

    /**
    * Method to produce an object for use with JSON.stringify().
    * @method toJsonObject
    * @return {Object} The object to be serialized.
    */
    toJsonObject: function () {
        var jsonObject = {};
        jsonObject.MessageKey = this.messageKey.toJsonObject();
        if (this.messageDigest != null)
            jsonObject.MessageDigest = this.messageDigest.toJsonObject();
        return jsonObject;
    }

});

/**
* Method to retreive this object from a JSON object.
* @method fromJsonObject
* @param jsonObject {Ojbect} Object to parse.
* @return {ViewerInfo} ViewerInfo parsed from the passed object.
*/
ViewerInfo.fromJsonObject = function (jsonObject) {
    var parsedObject = new ViewerInfo();
    if (jsonObject.MessageDigest)
        parsedObject.messageDigest = EncryptedData.fromJsonObject(jsonObject.MessageDigest);
    parsedObject.messageKey = EncryptedData.fromJsonObject(jsonObject.MessageKey);
     return parsedObject;
};