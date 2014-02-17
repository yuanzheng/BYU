// Copyright 2007 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
* @fileoverview Base64 en/decoding. Not much to say here except that we
* work with decoded values in arrays of bytes. By "byte" I mean a number
* in [0, 255].
*
*/

Base64 = {};


/**
* Maps bytes to characters.
* @type {Object}
* @private
*/
Base64.byteToCharMap_ = null;


/**
* Maps characters to bytes.
* @type {Object}
* @private
*/
Base64.charToByteMap_ = null;


/**
* Maps bytes to websafe characters.
* @type {Object}
* @private
*/
Base64.byteToCharMapWebSafe_ = null;


/**
* Maps websafe characters to bytes.
* @type {Object}
* @private
*/
Base64.charToByteMapWebSafe_ = null;


/**
* Our default alphabet, shared between
* ENCODED_VALS and ENCODED_VALS_WEBSAFE
* @type {string}
*/
Base64.ENCODED_VALS_BASE =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz' +
    '0123456789';


/**
* Our default alphabet. Value 64 (=) is special; it means "nothing."
* @type {string}
*/
Base64.ENCODED_VALS =
    Base64.ENCODED_VALS_BASE + '+/=';


/**
* Our websafe alphabet.
* @type {string}
*/
Base64.ENCODED_VALS_WEBSAFE =
    Base64.ENCODED_VALS_BASE + '-_.';


/**
* Whether this browser supports the atob and btoa functions. This extension
* started at Mozilla but is now implemented by many browsers. We use the
* ASSUME_* variables to avoid pulling in the full useragent detection library
* but still allowing the standard per-browser compilations.
*
* @type {boolean}
*/
Base64.HAS_NATIVE_SUPPORT = false;

//Browser.Engine.gecko ||
//Browser.Engine.webkit ||
//Browser.Engine.presto ||
//typeof (atob) == 'function';

/**
* Base64-encode an array of bytes.
*
* @param {Array.<number>} input An array of bytes (numbers with value in
*     [0, 255]) to encode.
* @param {boolean=} opt_webSafe Boolean indicating we should use the
*     alternative alphabet.
* @param {boolean=} insertLineBreak Boolan indicating we have a line break after
*     encoding 57 characters.
* @return {string} The base64 encoded string.
*/
Base64.encodeByteArray = function (input, opt_webSafe, insertLineBreak) {
    if (!(typeof input == 'array' || (typeof input == 'object' && typeof input.length == 'number'))) {
        throw Error('encodeByteArray takes an array as a parameter');
    }

    Base64.init_();

    var byteToCharMap = opt_webSafe ?
                      Base64.byteToCharMapWebSafe_ :
                      Base64.byteToCharMap_;

    var output = [];

    for (var i = 0; i < input.length; i += 3) {
        var byte1 = input[i];
        var haveByte2 = i + 1 < input.length;
        var byte2 = haveByte2 ? input[i + 1] : 0;
        var haveByte3 = i + 2 < input.length;
        var byte3 = haveByte3 ? input[i + 2] : 0;

        var outByte1 = byte1 >> 2;
        var outByte2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
        var outByte3 = ((byte2 & 0x0F) << 2) | (byte3 >> 6);
        var outByte4 = byte3 & 0x3F;

        if (!haveByte3) {
            outByte4 = 64;

            if (!haveByte2) {
                outByte3 = 64;
            }
        }

        output.push(byteToCharMap[outByte1],
                byteToCharMap[outByte2],
                byteToCharMap[outByte3],
                byteToCharMap[outByte4]);

        if(insertLineBreak && (((i + 3) % 57) == 0)) {
            output.push(' \r\n');
        }
    }

    return output.join('');
};


/**
* Base64-encode a string.
*
* @param {string} input A string to encode.
* @param {boolean=} opt_webSafe If true, we should use the
*     alternative alphabet.
* @param {boolean=} insertLineBreak Boolan indicating we have a line break after
*     encoding 57 characters.
* @return {string} The base64 encoded string.
*/
Base64.encodeString = function (input, opt_webSafe, insertLineBreak) {
    // Shortcut for Mozilla browsers that implement
    // a native base64 encoder in the form of "btoa/atob"
    if (Base64.HAS_NATIVE_SUPPORT && !opt_webSafe && !insertLineBreak) {
        return btoa(input);
    }
    return Base64.encodeByteArray(Base64.stringToByteArray(input), opt_webSafe, insertLineBreak);
};


/**
 * Turns a string into an array of bytes; a "byte" being a JS number in the
 * range 0-255.
 * @param {string} str String value to arrify.
 * @return {Array.<number>} Array of numbers corresponding to the
 *     UCS character codes of each character in str.
 */
Base64.stringToByteArray = function(str) {
  var output = [], p = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    while (c > 0xff) {
      output[p++] = c & 0xff;
      c >>= 8;
    }
    output[p++] = c;
  }
  return output;
};



/**
* Base64-decode a string.
*
* @param {string} input to decode.
* @param {boolean=} opt_webSafe True if we should use the
*     alternative alphabet.
* @return {string} string representing the decoded value.
*/
Base64.decodeString = function (input, opt_webSafe) {
    // Shortcut for Mozilla browsers that implement
    // a native base64 encoder in the form of "btoa/atob"
    if (Base64.HAS_NATIVE_SUPPORT && !opt_webSafe) {
        return atob(Base64.stripNonBase64Chars(input));
    }

    return String.fromCharCode.apply(null, Base64.decodeStringToByteArray(input, opt_webSafe));
};

/**
* Removes non Base64 characters from the string.
* @param {string} input to decode.
* @param {boolean=} opt_webSafe True if we should use the
*     alternative alphabet.
* @return {string} The input string without any non-base64 characters.
*/
Base64.stripNonBase64Chars = function(input, opt_webSafe) {
    // Replace any characters that are not base64.
    if(!opt_webSafe) {
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    }
    else {
        input = input.replace(/[^A-Za-z0-9\-\_\.]/g, "");
    }

    return input;
};


/**
* Base64-decode a string.
*
* @param {string} input to decode (length not required to be a multiple of 4).
* @param {boolean=} opt_webSafe True if we should use the
*     alternative alphabet.
* @return {Array} bytes representing the decoded value.
*/
Base64.decodeStringToByteArray = function (input, opt_webSafe) {
    Base64.init_();

    input = Base64.stripNonBase64Chars(input);

    var charToByteMap = opt_webSafe ?
                      Base64.charToByteMapWebSafe_ :
                      Base64.charToByteMap_;

    var output = [];

    for (var i = 0; i < input.length; ) {
        var byte1 = charToByteMap[input.charAt(i++)];

        var haveByte2 = i < input.length;
        var byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
        ++i;

        var haveByte3 = i < input.length;
        var byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 0;
        ++i;

        var haveByte4 = i < input.length;
        var byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 0;
        ++i;

        if (byte1 == null || byte2 == null ||
        byte3 == null || byte4 == null) {
            throw Error();
        }

        var outByte1 = (byte1 << 2) | (byte2 >> 4);
        output.push(outByte1);

        if (byte3 != 64) {
            var outByte2 = ((byte2 << 4) & 0xF0) | (byte3 >> 2);
            output.push(outByte2);

            if (byte4 != 64) {
                var outByte3 = ((byte3 << 6) & 0xC0) | byte4;
                output.push(outByte3);
            }
        }
    }

    return output;
};


/**
* Lazy static initialization function. Called before
* accessing any of the static map variables.
* @private
*/
Base64.init_ = function () {
    if (!Base64.byteToCharMap_) {
        Base64.byteToCharMap_ = {};
        Base64.charToByteMap_ = {};
        Base64.byteToCharMapWebSafe_ = {};
        Base64.charToByteMapWebSafe_ = {};

        // We want quick mappings back and forth, so we precompute two maps.
        for (var i = 0; i < Base64.ENCODED_VALS.length; i++) {
            Base64.byteToCharMap_[i] =
          Base64.ENCODED_VALS.charAt(i);
            Base64.charToByteMap_[Base64.byteToCharMap_[i]] = i;
            Base64.byteToCharMapWebSafe_[i] =
          Base64.ENCODED_VALS_WEBSAFE.charAt(i);
            Base64.charToByteMapWebSafe_[
          Base64.byteToCharMapWebSafe_[i]] = i;
        }
    }
};
