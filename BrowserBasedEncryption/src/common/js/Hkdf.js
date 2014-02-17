/**
* HKDF uses a key derivation function based upon the article 
* at http://eprint.iacr.org/2010/264.pdf.  The public functions
* of this class are used by other parts of the kiwi system to
* generate the keys that they use.
* (RFC: http://tools.ietf.org/search/rfc5869)
* 
* This HKDF does not use a salt, and assumes that passed in keys
* are cryptographically random.  Uses SHA-512 as the base of its
* HMAC function.
* @class Hkdf
*/
var Hkdf = (function () {
    var Hkdf = new Class({

        hmacOutputLength: 64,

        salt: [0xe0, 0x66, 0x4c, 0xd5, 0xd7, 0x80, 0x49, 0x60,
            0x1f, 0xe3, 0x1f, 0xb3, 0xf8, 0x8c, 0xd5, 0x4e,
            0xe0, 0x38, 0x30, 0x2a, 0x87, 0xcf, 0x1c, 0x6c,
            0x52, 0x51, 0x24, 0x3b, 0xe1, 0x26, 0x02, 0xa5,
            0x44, 0x8a, 0xb1, 0xf6, 0xe0, 0x04, 0xce, 0xa0,
            0xf6, 0x44, 0x89, 0xdd, 0xe4, 0x5a, 0x68, 0x67,
            0x87, 0xa2, 0x6a, 0x11, 0xd9, 0x4d, 0x7f, 0x33,
            0x3f, 0x59, 0x65, 0x4d, 0xfc, 0x93, 0xe0, 0x52],

        /**
        * Creates an authentication token
        * @method deriveAuthenticationToken
        * @param {byte[]} authenticationServerKey Authentication server's key
        * @param {String} userId ID of the user to generate a token for
        * @param {PeriodBase} period Period for which this token is valid
        */
        deriveAuthenticationToken: function (authenticationServerKey, userId, period, tokenSize) {
            throw "NotSupportedException";
        },

        /**
        * Creates a creator key
        * @method deriveCreatorKey
        * @param {byte[]} keyServerKey Key server's key
        * @param {String} creatorId ID of the user to generate a creator key for
        * @param {PeriodBase} period Period for which this token is valid
        */
        deriveCreatorKey: function (keyServerKey, creatorId, period, keySize) {
            throw "NotSupportedException";
        },

        /**
        * Creates a viewer key for the given creator.
        * @method deriveViewerKey
        * @param {byte[]} creatorkey Creator's key
        * @param {String} viewerId ID of viewer of the creator's sent content.
        */
        deriveViewerKey: function (creatorkey, viewerId, keySize) {
            return this.hkdfExpand(this.getCorrectLengthkey(creatorkey),
				Encoding.UTF8.getBytes("DeriveViewerKey" + viewerId.toUpperCase().trim()),
				keySize);
        },

        /**
        * Derives a set of keys based on the viewer key with the given nonce.
        * @method deriveViewerKeyBasedKeys
        * @param {byte[]} viewerKey Viewer key
        * @param {byte[]} nonce Nonce that adds randomness
        * @param {int} count Total number of viewer key based keys desired
        * @param {int} keySize 
        */
        deriveViewerKeyBasedKeys: function (viewerKey, nonce, count, keySize) {
            var keySizes = new Array(count);
            for (var i = 0; i < count; i++)
                keySizes[i] = keySize;

            return this.deriveViewerKeyBasedKeysMixed(viewerKey, nonce, keySizes);
        },

        /**
        * Derives a set of keys based on the viewer key with the given nonce.
        * @method deriveViewerKeyBasedKeys
        * @param {byte[]} viewerKey Viewer key
        * @param {byte[]} nonce Nonce that adds randomness
        * @param {int[]} keySizes The sizes of the keys desired
        * @return Array with various viewer key based keys.
        */
        deriveViewerKeyBasedKeysMixed: function (viewerKey, nonce, keySizes) {
            var keySizesSum = 0;
            for (var i = 0; i < keySizes.length; i++)
                keySizesSum += keySizes[i];

            var keyMaterial = this.hkdfExpand(this.getCorrectLengthkey(viewerKey),
				Encoding.UTF8.getBytes("DeriveViewerBasedKeys").concat((nonce == null) ? [] : nonce).concat([keySizes.length % 256]),
				keySizesSum);

            // Break up the key, creating a key y keys of x length,
            // where y is the number of keys given by the length of
            // keySizes, and x is the key size provided by keySizes
            // at index i.
            var keys = new Array(keySizes.length);
            var position = 0;
            for (var i = 0; i < keys.length; i++) {
                keys[i] = new Array(keySizes[i]);
                Array.copyTo(keyMaterial, position, keys[i], 0, keySizes[i]);
                position += keySizes[i];
            }

            return keys;
        },

        /**
        * Creates a key based on a password.
        * @method derivePasswordKey
        * @param {String} userId ID of the user
        * @param {String} password Bytes of the password
        * @param {int} keySize Key size desired of the password.
        * @return Key based on the password.
        */
        derivePasswordKey: function (userId, password, keySize) {
            var keyMaterial = Encoding.UTF8.getBytes(password);
            var correctKey = this.getCorrectLengthkey(keyMaterial);
            var encodedUserId = Encoding.UTF8.getBytes("DerivePasswordKey" + userId.toUpperCase().trim());
            return this.hkdfExpand(correctKey, encodedUserId, keySize);
        },

        /**
        * Extract operation of the HKDF.  Used to add entropy to the input keyring material.
        * Not used currently because all the input keyring material we have already has 
        * maximum entropy.
        * @method hkdfExtract
        * @param {byte[]} salt Salt value for the HKDF. Can be null, in which case a salt of all zeroes is used. The salt is preferable the same lenfth as the HMAC output length.
        * @param {byte[]} inputKeyingMaterial Key ring material to add entropy to.
        * @return A psuedorandom key with the required entropy.
        */
        hkdfExtract: function (salt, inputKeyingMaterial) {
            var hmac = this.getHmacInstance((salt == null) ? new Array(this.hmacOutputLength) : salt);
            return hmac.computeHash(inputKeyingMaterial);
        } .protect(),

        /**
        * Expands the psudeorandom key given to provide the material for any keys needed.
        * @method hkdfExpand
        * @param {byte[]} pseudorandomKey Psuedorandom key of at least hmacOutputLength.
        * @param {byte[]} info Optional context and application specific information.
        * @param {int} length Length of output keying material.
        * @return Output keying material.
        */
        hkdfExpand: function (pseudorandomKey, info, length) {
            var numberOfRounds = Math.ceil(length / this.hmacOutputLength);
            var outputKeyMaterial = new Array(length);
            var roundResult = [];

            var hmac = this.getHmacInstance(pseudorandomKey);

            // Run all except the last round
            for (var i = 1; i < numberOfRounds; i++) {
                roundResult = hmac.computeHash(roundResult.concat((info == null) ? [] : info).concat([i]));
                Array.copyTo(roundResult, 0, outputKeyMaterial, (i - 1) * this.hmacOutputLength, this.hmacOutputLength);
            }

            // Calculate the last round
            roundResult = hmac.computeHash(roundResult.concat((info == null) ? [] : info).concat([numberOfRounds]));
            if (length % this.hmacOutputLength == 0)
                Array.copyTo(roundResult, 0, outputKeyMaterial, (numberOfRounds - 1) * this.hmacOutputLength, this.hmacOutputLength);
            else
                Array.copyTo(roundResult, 0, outputKeyMaterial, (numberOfRounds - 1) * this.hmacOutputLength, length % this.hmacOutputLength);

            return outputKeyMaterial;
        } .protect(),

        /**
        * Gets a new instance of the HMAC used in the HKDF.
        * @method getHmacinstance
        * @param {byte[]} key Key to use
        * @return HMAC used by the KDF
        */
        getHmacInstance: function (key) {
            return new HMACSHA512(key);
        } .protect(),

        /**
        * Gets a key with the correct length for use in this HKDF, meaning it has size equal to our greater to hmacOutputLength.
        * @method getCorrectLengthkey
        * @param {byte[]} key Key to get a key of correct size for.
        * @return Key with length >= hmacOutputLength.
        */
        getCorrectLengthkey: function (key) {
            if (key.length < this.hmacOutputLength)
                return this.hkdfExtract(this.salt, key);
            else
                return key;
        } .protect()

    });

    return new Hkdf();
})();
