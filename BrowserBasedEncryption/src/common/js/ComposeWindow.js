/**
 * The compose window scripts.
 * @class ComposeWindow
 */
var ComposeWindow = (function () {
var ComposeWindow = new Class({

    //#region Fields

    /**
    * The guid of this frame.
    * @property guid
    * @type String
    */
    guid: '@GUID',

    /**
    * The id of the user.
    * @property userId
    * @type String
    */
    userId: null,

    /**
    * The Uri to use for the key server.
    * @property selectedKeyServer
    * @type String
    */
    selectedKeyServer: "https://kiwi.byu.edu/ks/", //Uris.keyServerUris[0],

    /**
    * The progress dialog for encryption.
    * @property encryptProgressDialog
    * @type ProgressDialog
    */
    encryptProgressDialog: null,

    /**
    * The progress dialog for decrypting reply and forward.
    * @property decryptProgressDialog
    * @type ProgressDialog
    */
    decryptProgressDialog: null,

    //#endregion

    //#region Constructor

    /**
    * Constructs the compose window.
    * @method initialize.
    */
    initialize: function () {
        var self = this;

        self.userId = "song2680@gmail.com";

    },

    //#endregion

    //#region Encryption

    /** 
    * Callback to be called when recipients retreived.  Needed so encryption will get the correct results.
    * @property recipientCallback
    * @type Function
    */
    recipientCallback: null,

    /** 
    * Encrypts the message and returns a package.
    * @method encryptMessage
    * @param callback {Function} Function to call when encryption is finished, passed a string with the package.
    */
    encryptMessage: function (callback) {
        var self = this;

        //self.encryptProgressDialog.setMessage('Retrieving encryption key.');
        KeyManagerProxy.getCreatorKey(
            new KeyRequestArgs(this.selectedKeyServer, this.userId, null, new Date(), EmailPackager.PackageKeySize),
            function (success, value, args) {
                if (!success) {
                    //self.encryptProgressDialog.setMessage("Failed to get an encryption key.  Try again or ensure you have permissions to use the selected key server.");
                    //self.encryptProgressDialog.allowClose();
                    return;
                }

                // Get the recipients, and then finish encryption.
                //self.encryptProgressDialog.setMessage("Encrypting message.");
                self.recipientCallback = function (recipients) {
                    try {
                        var packager = new EmailPackager();
                        packager.creatorId = args.creatorId;
                        packager.keyServerUri = args.keyServerUri;
                        packager.timestamp = args.timestamp;
                        packager.creatorKey = value;
                        packager.message = new Message();
                        var msg = document.getElementById("contentArea").value;
                        packager.message.contents = msg;//CKEDITOR.instances['contentArea'].getData();

                        for (var i = 0; i < recipients.length; i++)
                            packager.addViewer(recipients[i]);

                        callback(packager.wrap());
                    }
                    catch (e) {
                        //self.encryptProgressDialog.setMessage("Failed to encrypt the message.  Try again and make sure all the recipients are correct e-mail addresses.");
                        //self.encryptProgressDialog.allowClose();
                    }
                };

                //self.encryptProgressDialog.setMessage("Getting recipients.");
                //self.postMessage(WindowMessageTypes.GetRecipients, null);
            });
    },

    /**
    * Takes a package and decrypts it.
    * @method decryptMessage
    * @param kiwiPackage {String} Decrypts the package string.
    * @param viewerId {String} Id of the viewer reading the message.
    * @param callback {Function} Function to call with decrypted package, passed the body of the email.
    */
    decryptMessage: function (kiwiPackage, viewerId, callback) {
        var self = this;
        try {
            var emailPackager = new EmailPackager(kiwiPackage);
        }
        catch (exception) {
            self.decryptProgressDialog.setMessage("Invalid e-mail message.  Contact the sender and have them resend the message.");
        }

        self.decryptProgressDialog.setMessage("Retreiving decryption key.");
        KeyManagerProxy.getViewerKey(new KeyRequestArgs(emailPackager.keyServerUri, emailPackager.creatorId, viewerId, emailPackager.timestamp, EmailPackager.PackageKeySize),
            function (success, value, args) {
                if (!success) {
                    self.decryptProgressDialog.setMessage("Failed to get an decryption key.  Try to open the message again, or contact the sender and have them resend the message.");
                    return;
                }

                try {
                    self.decryptProgressDialog.setMessage("Decrypting message.");
                    emailPackager.unwrap(kiwiPackage, viewerId, value);
                    callback(emailPackager.message.contents);
                }
                catch (exception) {
                    self.progressDialog.setMessage("Invalid e-mail message.  Contact the sender and have them resend the message.");
                }
            });
    },

    //#endregion

    //#region Messaging

    /**
    * Sends a message to the parent frame.
    * @method postMessage
    * @param messageType {Number} The type of message being sent.
    * @param content {Object} The object to be sent.
    */
    postMessage: function (messageType, content) {
        var self = this;
        window.setTimeout(function () { window.top.postMessage(JSON.stringify(new WindowMessage(self.guid, messageType, content)), '*'); }, 0);
    },

    /**
    * Handles messages passed to the window.
    * @method handlePostMessage
    * @param event {Event} Event object
    */
    handlePostMessage: function (event) {
        var self = this;
        var message = JSON.parse(event.data);

        if (message.guid != this.guid)
            return;

        // Handle the various message types.
        var info = message.contents;
        if (message.messageType == WindowMessageTypes.GetRecipients) {
            if (this.recipientCallback)
                this.recipientCallback(info);
        }
        else if (message.messageType == WindowMessageTypes.GetContents) {
            this.userId = info.userId;

            // Pre-fetch creator key.
            KeyManagerProxy.getCreatorKey(new KeyRequestArgs(this.selectedKeyServer, this.userId, null, new Date(), EmailPackager.PackageKeySize), function () { });

            // If there is a kiwi package decrypt it and then show it.
            if (info.kiwiPackage) {
                self.decryptProgressDialog.setMessage("Unwrapping original message.");
                self.decryptProgressDialog.show();
                this.decryptMessage(Package.fromJsonObject(info.kiwiPackage), this.userId, function (message) {
                    CKEDITOR.instances['contentArea'].setData(info.body.replace(info.templateItem, message));
                    self.decryptProgressDialog.hide();
                    CKEDITOR.instances['contentArea'].focus();
                });
            }
            else {
                jQuery('#LockIcon').css('display', 'inline-block');
                CKEDITOR.instances['contentArea'].setData(info.body);
                CKEDITOR.instances['contentArea'].focus();
            }
        }
        else if (message.messageType == WindowMessageTypes.SizingInfo) {
            CKEDITOR.instances['contentArea'].focus();
        }
    }

    //#endregion
   
});
    return new ComposeWindow();
})();