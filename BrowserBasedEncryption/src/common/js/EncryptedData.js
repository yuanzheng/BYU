/**
* Encrypted data class.
* @class EncryptedData
*/
var EncryptedData = new Class({

    /**
    * Gets the information needed for decryption.  Can contain information
    * such as which algorithm was used, and what the IV or other parameters were.
    * @property encryptionInfo
    * @type Array.<byte>
    */
    encryptionInfo: null,

    /**
    * Gets the encrypted data.
    * @property value
    * @type Array.<byte>
    */
    value: null,

    /**
    * Method to produce an object for use with JSON.stringify().
    * @method toJsonObject
    * @return {Object} The object to be serialized.
    */
    toJsonObject: function () {
        var jsonObject = {};
        if (this.encryptionInfo != null)
            jsonObject.EncryptionInfo = Base64.encodeByteArray(this.encryptionInfo);
        jsonObject.Value = Base64.encodeByteArray(this.value);
        return jsonObject;
    }

});

/**
* Method to retreive this object from a JSON object.
* @method fromJsonObject
* @param jsonObject {Ojbect} Object to parse.
* @return {EncryptedData} EncryptedData parsed from the passed object.
*/
EncryptedData.fromJsonObject = function (jsonObject) {
    var parsedObject = new EncryptedData();
    if (jsonObject.EncryptionInfo)
        parsedObject.encryptionInfo = Base64.decodeStringToByteArray(jsonObject.EncryptionInfo);
    parsedObject.value = Base64.decodeStringToByteArray(jsonObject.Value);
    return parsedObject;
};