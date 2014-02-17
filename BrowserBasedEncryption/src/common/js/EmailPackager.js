/**
 * Responsible for either creating a single package or unwrapping a package
 * pertaining to email.
 * @class EmailPackager
 */
var EmailPackager = new Class({

    Extends: PackagerBase,

    //#region Overridden Properties

    /**
    * Gets the size of keys used for encryption.
    * @property keySize
    * @type int
    */
    keySize: 32,

    /**
    * Gets the size of the IV.  0 indicates to not use an IV.
    * @property ivSize
    * @type int
    */
    ivSize: 16,

    /**
    * Gets the size of the Nonce.  0 indicates to not use a nonce.
    * @property nonceSize
    * @type int
    */
    nonceSize: 32,

    /**
    * Gets the encryption algorithm to use for encryption.
    * @property keySize
    * @type int
    */
    encryptionAlgorithm: null,

    //#endregion

    //#region Constructor

    /**
    * Constructor.
    * @method initialize
    */
    initialize: function (kiwiPackage) {
        this.encryptionAlgorithm = new AesSymmetricAlgorithm(SymmetricAlgorithmMode.CBC);

        if(kiwiPackage) {
            this.unwrapAttributes(kiwiPackage);
        }
        else {
            this.parent();
        }
    },

    //#endregion

    //#region Overridden wrap methods

    /**
    * Adds the viewers to the package.  Viewers are put into the list
    * with an obifuscated user name.
    * @method addViewers
    * @param package {Package} kiwiPackage to add the attributes to.
    */
    addViewers: function (kiwiPackage) {
        // Ensure that the viewers contain the creator.
        this.addViewer(this.creatorId);

        // Add each viewer to the package.
        for (var viewerId in this.viewerIds) {
            // Get the viewer key.
            var viewerKey = Hkdf.deriveViewerKey(this.creatorKey, viewerId, this.keySize);

            // Use the four keys as such:
            // viewerKeyBasedKeys[0] = Key on the viewer dictionary in the package.
            // viewerKeyBasedKeys[1] = KEK for the message key.
            // viewerKeyBasedKeys[2] = Encryption key for the message digest.
            var viewerKeyBasedKeys = Hkdf.deriveViewerKeyBasedKeys(viewerKey, this.messageNonce, 3, this.keySize);

            // Add the viewer to the package.
            var viewerInfo = new ViewerInfo();
            viewerInfo.messageKey = this.encrypt(viewerKeyBasedKeys[1], Math.getRandomBytes(this.ivSize), this.messageKey);
            viewerInfo.messageDigest = this.encrypt(viewerKeyBasedKeys[2], Math.getRandomBytes(this.ivSize), this.messageDigest);
            kiwiPackage.viewers[Base64.encodeByteArray(viewerKeyBasedKeys[0])] = viewerInfo;
        }

    },

    //#endregion

    //#region Overridden unwrap methods

    /**
    * Unwraps the message from package.
    *
    * The MessageKey, and MessageDigest should already been unwrapped.
    * @method unwrapViewers
    * @param {Package} kiwiPackage Package to unwrap message from.
    * @param {String} viewerId The ID of the viewer.
    * @param {Array.<byte>} The key used to unwrap the viewers.
    */
     unwrapViewers: function (kiwiPackage, viewerId, viewerKey) {
        // Use the four keys as such:
        // viewerKeyBasedKeys[0] = Key on the viewer dictionary in the package.
        // viewerKeyBasedKeys[1] = KEK for the message key.
        // viewerKeyBasedKeys[2] = Encryption key for the message digest.
        var viewerkeyBasedKeys = Hkdf.deriveViewerKeyBasedKeys(viewerKey, this.messageNonce, 3, this.keySize);
        var viewerIdKey = Base64.encodeByteArray(viewerkeyBasedKeys[0]);

        if (!kiwiPackage.viewers[viewerIdKey])
            throw "The given user does not have view rights on this message.";

        var viewerInfo = kiwiPackage.viewers[viewerIdKey];
        this.messageKey = this.decrypt(viewerkeyBasedKeys[1], viewerInfo.messageKey);
        this.messageDigest = this.decrypt(viewerkeyBasedKeys[2], viewerInfo.messageDigest);
    },

    //#endregion

    //#region Overridden cryptography methods

    /**
    * Gets the algorithm used for digest generation in this package.
    * @method getHashAlgorithm
    * @return {SHA} The has algorithm to use for hashing.
    */
    getHashAlgorithm: function () {
        return new SHA512();
    }

    //#endregion

});

/**
 * Gets the size of keys used for encryption.
 * @property PackageKeySize
 * @type int
 */
EmailPackager.PackageKeySize = 32;