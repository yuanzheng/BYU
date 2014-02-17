/**
* A similar Encoding implementation to that of the one in C#.
* @class Encoding
*/
var Encoding = {};

/**
* Provides UTF8 encoding in javascript
* @class Encoding.UTF8
*/
Encoding.UTF8 = (function () {
    var UTF8Encoding = new Class({

        /**
        * Gets the byte representation of a string.
        * @method getBytes
        * @param {String} str String to encode.
        * @return {Array.<byte>} Byte representation of the string.
        */
        getBytes: function (str) {
            var bytes = [];
            for (var i = 0; i < str.length; i++) {
                bytes.push(str.charCodeAt(i) % 256);
            }

            return bytes;
        },

        /**
        * Gets the string representation of the bytes.
        * @method getString
        * @param {Array.<byte>} str The bytes to decode.
        * @return {String} Representation of the string.
        */
        getString: function (bytes) {
            var result = "";
            for (var i = 0; i < bytes.length; i++) {
                result += String.fromCharCode(bytes[i]);
            }

            return result;
        }


    });

    return new UTF8Encoding();
})();