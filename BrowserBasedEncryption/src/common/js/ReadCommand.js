/**
 * The compose window scripts.
 * @class ComposeWindow
 */
var sendEncryptMessage = function (msg, creatorId, recipients) {

    
    //var msg = document.getElementById("contentArea").value;
    var kiwiPackage = encryptMessage(msg, creatorId, recipients);
    var packageWrapper = PackageWrapper.createWriteWrapper("", null, kiwiPackage.toJsonObject());
    //var input = document.getElementById("message");
    //input.innerHTML = packageWrapper.wrappedBody;
    return packageWrapper.wrappedBody;
}



    /** 
    * Encrypts the message and returns a package.
    * @method encryptMessage
    * @param callback {Function} Function to call when encryption is finished, passed a string with the package.
    */
var encryptMessage = function (msg, creatorId, recipients) {

    
    try {
        var packager = new EmailPackager();
        packager.creatorId = creatorId;//"Song2680@gmail.com";//args.creatorId;
            
        packager.keyServerUri = "";//args.keyServerUri;
        packager.timestamp = new Date(); //args.timestamp;
        packager.creatorKey = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //value;
        packager.message = new Message();
        packager.message.contents = msg;

       
        for (var i = 0; i < recipients.length; i++)
            packager.addViewer(recipients[i]);
        
        //packager.addViewer("yangseung0105@gmail.com")
        //packager.addViewer("Song2680@gmail.com");
        return packager.wrap();
    }
    catch (e) {
        //self.encryptProgressDialog.setMessage("Failed to encrypt the message.  Try again and make sure all the recipients are correct e-mail addresses.");
        //self.encryptProgressDialog.allowClose();
    }
       
}





var decryptEncryptedMessage = function (ciphText, viewerId) {
    //var location = document.getElementsByName("package");
    //var cipher = location[0].innerText;
    var kiwiPackage = JSON.parse(Base64.decodeString(ciphText));

    // get sender email
    //var userId = viewerId;//"yangseung0105@gmail.com";
    var msg = decryptMessage(Package.fromJsonObject(kiwiPackage), viewerId);
    //var input = document.getElementById("Textarea1");
    return msg.contents;

}

/**
* Takes a package and decrypts it.
* @method decryptMessage
* @param kiwiPackage {String} Decrypts the package string.
* @param viewerId {String} Id of the viewer reading the message.
* @param callback {Function} Function to call with decrypted package, passed the body of the email.
*/
var decryptMessage = function (kiwiPackage, viewerId) {
    //var self = this;
    try {
        var emailPackager = new EmailPackager(kiwiPackage);
    }
    catch (exception) {
        //self.decryptProgressDialog.setMessage("Invalid e-mail message.  Contact the sender and have them resend the message.");
    }

    
    try {
        var value = Hkdf.deriveViewerKey([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], viewerId, 32);
        
        emailPackager.unwrap(kiwiPackage, viewerId, value);
        return emailPackager.message;
    }
    catch (exception) {
        //self.progressDialog.setMessage("Invalid e-mail message.  Contact the sender and have them resend the message.");
    }
       
}

