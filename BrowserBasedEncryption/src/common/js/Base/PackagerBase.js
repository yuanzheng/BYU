/**
* The base class for all packages.
* 
* Packagers are responsible for either creating a single package, or unwraping the package.
* Each package wrapper or unwrapped should use its own instance of package.  Packagers should
* have one constructor that creates a Packager for wrapping that takes minimal information,
* and one that takes a package unwraps the basic attributes to make them accessible.  This
* information should be enough to get a viewer-key, which can then be used to unwrap a package.
* 
* By default when this class creates an encrypted data element it does so by
* treating EncryptionInfo as the IV.  If this is not the desired behaviour the sub-class
* should override Encrypt, Decrypt, AddMessage, UnwrapMessage, EncryptAttachment, 
* DecryptAttachment as these are the functions that make use of encryption that
* deal with encryption.
* 
* To remove the digest you need to change AddMessage, UnwrapMessage, EncryptAttachment, 
* DecryptAttachment, as these four methods all will by default make use of the hash
* algorithm provided by GetHashAlgorithm.  Alternatively you could make this return
* a custom hash method that just passes through what is written to it, and then override
* the base method and replace the empty hash that was generated.
* 
* The default operation on encryption use whatever SymetricAlgorithm is provided.  They
* treat EncryptionInfo of EncryptedData as the IV of the operation.  If other behavior is needed
* 
* All sizes of keys are in bytes.
 * @class PackagerBase
 */
var PackagerBase = new Class({

    //#region Constants

    /**
    * Key to use for the attributes table for the creator id.
    * @property CreatorIdAttributeKey
    * @type String
    */
    CreatorIdAttributeKey: "CreatorId",

    /**
    * Key to use for the attributes table for the creator key's period.
    * @property TimestampAttributeKey
    * @type String
    */
    TimestampAttributeKey: "Timestamp",

    /**
    * Key to use for the attributes table for the key server URL.
    * @property KeyServerUriAttributeKey
    * @type String
    */
    KeyServerUriAttributeKey: "KeyServerUri",

    /**
    * Key to use for the attributes table for the nonce.
    * @property MessageNonceAttributeKey
    * @type String
    */
    MessageNonceAttributeKey: "Nonce",

    //#endregion

    //#region Abstract Properties

    /**
    * Gets the size of keys used for encryption.
    * @property keySize
    * @type int
    */
    keySize: null,

    /**
    * Gets the size of the IV.  0 indicates to not use an IV.
    * @property ivSize
    * @type int
    */
    ivSize: null,

    /**
    * Gets the size of the Nonce.  0 indicates to not use a nonce.
    * @property nonceSize
    * @type int
    */
    nonceSize: null,

    /**
    * Gets the encryption algorithm to use for encryption.
    * @property keySize
    * @type int
    */
    encryptionAlgorithm: null,

    //#endregion

    //#region Properties

    /**
    * Gets or sets the creator id.
    * @property creatorId
    * @type String
    */
    creatorId: null,

    /**
    * Gets or sets the creator key.  Only needed if wrapping the package.
    * Not set when a package is unwrapped.
    * @property creatorKey
    * @type Array.<byte>
    */
    creatorKey: null,

    /**
    * Gets or sets the date time for the message, used in requesting keys.
    * @property timestamp
    * @type Date
    */
    timestamp: null,

    /**
    * Gets or sets the key server uri.
    * @property keyServerUri
    * @type String
    */
    keyServerUri: null,

    /**
    * Gets or sets the message.
    * @property message
    * @type Message
    */
    message: null,

    /**
    * Gets or sets the viewers of the message.  The creator is considered a viewer.
    * @property viewerIds
    * @type Object
    */
    viewerIds: null,

    //#endregion

    //#region Protected Properties

    /**
    * Gets or sets the key used to encrypt the message.
    * @property messageKey
    * @type Array.<byte>
    */
    messageKey: null,

    /**
    * Gets or sets the IV used to encrypt the message.
    * @property messageIV
    * @type Array.<byte>
    */
    messageIV: null,

    /**
    * Gets or sets the digest of the message.
    * @property messageDigest
    * @type Array.<byte>
    */
    messageDigest: null,

    /**
    * Gets or sets the nonce used by the message.
    * @property messageNonce
    * @type Array.<byte>
    */
    messageNonce: null,

    //#endregion

    //#region Constructor

    /**
    * Constructor.
    * @method initialize
    */
    initialize: function () {
        this.viewerIds = {};
        this.messageKey = Math.getRandomBytes(this.keySize);
        this.messageIV = Math.getRandomBytes(this.ivSize);
        this.messageNonce = Math.getRandomBytes(this.nonceSize);
    },

    //#endregion

    //#region Wrap Package

    /**
    * Wraps the package, and returns a package with the contents encrypted
    * and ready to be sent.
    * @method wrap
    * @return {Package} Fully constructed package.
    */
    wrap: function () {
        var kiwiPackage = new Package();
        this.addAttributes(kiwiPackage);
        this.addMessage(kiwiPackage);
        this.addViewers(kiwiPackage);
        return kiwiPackage;
    },

    /**
    * Adds the packages attributes to the attribute dictionary.
    *
    * The attributes added by the base class are: Creator id,
    * key period for the creator key, and the Uri of the key server.
    * @method addAttributes
    * @param {Package} kiwiPackage Package to add the attributes to.
    */
    addAttributes: function (kiwiPackage) {
        kiwiPackage.attributes[this.CreatorIdAttributeKey] = this.creatorId;
        kiwiPackage.attributes[this.TimestampAttributeKey] = this.timestamp;
        kiwiPackage.attributes[this.KeyServerUriAttributeKey] = this.keyServerUri;

        if (this.messageNonce)
            kiwiPackage.attributes[this.MessageNonceAttributeKey] = Base64.encodeByteArray(this.messageNonce);
    },

    /**
    * Adds the packages attributes to the attribute dictionary.
    *
    * The message is first zipped, then encrypted.  The digest is taken
    * on the zipped pre-encrypted message.
    * @method addViewers
    * @param {Package} package Package to add the attributes to.
    */
    addMessage: function (kiwiPackage) {
        var messageBytes = Encoding.UTF8.getBytes(JSON.stringify(this.message.toJsonObject()));
        this.messageDigest = this.getHashAlgorithm().computeHash(messageBytes);
        kiwiPackage.encryptedMessage = new EncryptedData();
        kiwiPackage.encryptedMessage.encryptionInfo = this.messageIV;
        kiwiPackage.encryptedMessage.value = this.encryptionAlgorithm.encrypt(this.messageKey, this.messageIV, messageBytes);
    },

    /**
    * Adds the viewers to the package.
    *
    * Base implementation expects that MessageDigest is not null.
    * @method addViewers
    * @param {Package} package Package to add the attributes to.
    */
    addViewers: function (kiwiPackage) {
        // Ensure that the viewers contain the creator.
        this.addViewer(this.creatorId);

        for (var viewerId in this.viewerIds) {
            // Get the viewer key.
            var viewerKey = Hkdf.deriveViewerKey(this.creatorKey, viewerId, this.keySize);

            // Use the four keys as such:
            // viewerKeyBasedKeys[0] = KEK for the message key.
            // viewerKeyBasedKeys[1] = Encryption key for the message digest.
            var viewerKeyBasedKeys = Hkdf.deriveViewerKeyBasedKeys(viewerKey, this.messageNonce, 2, this.keySize);

            // Add the viewer to the package.
            var viewerInfo = new ViewerInfo();
            viewerInfo.messageKey = this.encrypt(viewerKeyBasedKeys[0], Math.getRandomBytes(this.ivSize), this.messageKey);
            viewerInfo.messageDigest = this.encrypt(viewerKeyBasedKeys[1], Math.getRandomBytes(this.ivSize), this.messageDigest);
            kiwiPackage.viewers[viewerId] = viewerInfo;
        }

    },

    /**
    * Encrypts the attachment and returns the AttachmentInformation for the attachment
    * that can be added to the message.
    *
    * Base implementation expects that MessageDigest is not null.
    * @method encryptAttachment
    * @param {Array.<byte>} input The unencrypted attachment.
    * @param {Array.<byte>} output The output with the encrypted attachment.  This is an out variable.
    * @param {Array.<byte>} originalName The original name of the attachment.
    * @return {AttachmentInfo} AttachmentInfo describing the attachment.
    */
    encryptAttachment: function (input, output, originalName) {
        output.length = 0;
        var encryptedAttachment = this.encryptionAlgorithm.encrypt(this.messageKey, this.messageIV, input);
        Array.copyTo(encryptedAttachment, 0, output, 0, encryptedAttachment.length);

        attachmentInfo = new AttachmentInfo();
        attachmentInfo.digest = this.getHashAlgorithm().computeHash(input);
        attachmentInfo.originalName = originalName;
        return attachmentInfo;
    },

    //#endregion

    //#region Unwrap

    /**
    * Unwraps a package and sets all the information.
    *
    * @method unwrap
    * @param {Package} kiwiPackage Package to unwrap message from.
    * @param {String} viewerId The ID of the viewer.
    * @param {Array.<byte>} The key used to unwrap the viewers.
    */
    unwrap: function (kiwiPackage, viewerId, viewerKey) {
        this.unwrapAttributes(kiwiPackage);
        this.unwrapViewers(kiwiPackage, viewerId, viewerKey);
        this.unwrapMessage(kiwiPackage);
    },

    /**
    * Unwraps the attributes from the package.
    *
    * @method unwrapAttributes
    * @param {Package} package Package to unwrap message from.
    */
    unwrapAttributes: function (kiwiPackage) {
        this.creatorId = kiwiPackage.attributes[this.CreatorIdAttributeKey];
        this.timestamp = Date.parseJson(kiwiPackage.attributes[this.TimestampAttributeKey]);
        this.keyServerUri = kiwiPackage.attributes[this.KeyServerUriAttributeKey];

        if (kiwiPackage.attributes[this.MessageNonceAttributeKey])
            this.messageNonce = Base64.decodeStringToByteArray(kiwiPackage.attributes[this.MessageNonceAttributeKey]);
        else
            this.messageNonce = null;
    },

    /**
    * Unwraps the message from package.
    *
    * The MessageKey, and MessageDigest should already been unwrapped.
    * @method unwrapViewers
    * @param {Package} package Package to unwrap message from.
    * @param {String} viewerId The ID of the viewer.
    * @param {Array.<byte>} The key used to unwrap the viewers.
    */
    unwrapViewers: function (kiwiPackage, viewerId, viewerKey) {
        // Use the four keys as such:
        // viewerKeyBasedKeys[0] = KEK for the message key.
        // viewerKeyBasedKeys[1] = Encryption key for the message digest.
        var viewerkeyBasedKeys = Hkdf.deriveViewerKeyBasedKeys(viewerKey, this.messageNonce, 2, this.keySize);

        var viewerInfo = null;
        for (var viewer in kiwiPackage.viewers) {
            if (viewer.toLowerCase() == viewerId.toLowerCase()) {
                viewerInfo = viewer;
                break;
            }
        }

        if (viewerInfo == null)
            throw "The given user does not have view rights on this message.";

        this.messageKey = this.decrypt(viewerkeyBasedKeys[0], viewerInfo.messageKey);
        this.messageDigest = this.decrypt(viewerkeyBasedKeys[1], viewerInfo.messageDigest);
    },

    /**
    * Unwraps the message from package.
    *
    * The MessageKey, and MessageDigest should already been unwrapped.
    * @method unwrapMessage
    * @param {Package} kiwiPackage Package to unwrap message from.
    */
    unwrapMessage: function (kiwiPackage) {
        this.messageIV = kiwiPackage.encryptedMessage.encryptionInfo;

        var encryptedMessageBytes = this.encryptionAlgorithm.decrypt(this.messageKey, this.messageIV, kiwiPackage.encryptedMessage.value);
        this.message = Message.fromJsonObject(JSON.parse(Encoding.UTF8.getString(encryptedMessageBytes)));

        var digest = this.getHashAlgorithm().computeHash(encryptedMessageBytes);
        for (var i = 0; i < digest; i++) {
            if (digest[i] != this.messageDigest[i])
                throw "Digest mis-match.  The message has been changed.";
        }
    },

    /**
    * Decrypts the attachment and checks the digets.
    *
    * Base implementation expects that MessageDigest is not null.
    * @method decryptAttachment
    * @param {Array.<byte>} input The unencrypted attachment.
    * @param {Array.<byte>} output The output with the encrypted attachment.  This is an out variable.
    * @param {AttachmentInfo} info AttachmentInfo with information about the attachment.
    */
    decryptAttachment: function (intput, output, info) {
        output.length = 0;
        var decryptedAttachment = this.encryptionAlgorithm.decrypt(this.messageKey, this.messageIV, input);
        Array.copyTo(encryptedAttachment, 0, output, 0, encryptedAttachment.length);

        var digest = this.getHashAlgorithm().computeHash(output);
        for (var i = 0; i < digest; i++) {
            if (digest[i] != info.digest[i])
                throw "Digest mis-match.  The attachment has been changed.";
        }

    },

    //#endregion

    //#region Cryptography Methods

    /**
    * Encrypts the given data with the given key and iv.
    * @method decrypt
    * @param {Array.<byte>} key The key to use for encryption.
    * @param {Array.<byte>} iv The IV to use for encryption.
    * @param {Array.<byte>} data The data to be encrypted.
    * @return {EncryptedData} Array.<byte> with the contents of data decrypted.
    */
    encrypt: function (key, iv, data) {
        var encryptedData = new EncryptedData();
        encryptedData.encryptionInfo = iv;
        encryptedData.value = this.encryptionAlgorithm.encrypt(key, iv, data);
        return encryptedData;
    },

    /**
    * Decrypts the given data with the given key, and returns the bytes.
    * @method decrypt
    * @param {Array.<byte>} key The key to use for decryption.
    * @param {EncryptedData} data The encrypted data to decrypt.
    * @return {Array.<byte>} Array.<byte> with the contents of data decrypted.
    */
    decrypt: function (key, data) {
        return this.encryptionAlgorithm.decrypt(key, data.encryptionInfo, data.value);
    },

    /**
    * Gets the algorithm used for digest generation in this package.
    * @method getHashAlgorithm
    * @return {SHA} The has algorithm to use for hashing.
    */
    getHashAlgorithm: function () { },

    //#endregion

    //#region Viewer Manipulation

    /**
    * Adds the given viewer to the viewerId object.
    * @method addViewer
    * @param {String} viewerId The Id of the viewer.
    */
    addViewer: function (viewerId) {
        this.viewerIds[viewerId.toLowerCase()] = null;
    },

    /**
    * Deletes the given viewer to the viewerId object.
    * @method deleteViewer
    * @param {String} viewerId The Id of the viewer.
    */
    deleteViewer: function (viewerId) {
        delete this.viewerIds[viewerId.toLowerCase()];
    }

    //#endregion

});