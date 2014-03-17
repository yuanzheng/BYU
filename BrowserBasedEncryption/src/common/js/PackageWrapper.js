/**
 * Handles the wraping of the body and subject of kiwi packages.
 * 
 * @class EmailPackageWrapper
 * @extends PackageWrapper
 */
var PackageWrapper = (function () {

    //#region Private constants

    /**
    * The message included with emails for boot strapping purposes.
    * @property bootstrapMessage
    * @type String
    */
    var bootstrapMessage = [
        /*
    "<!-- table align='left' border='0' cellpadding='1' cellspacing='1' name='DescriptionTable'>", 
    "<tbody><tr><td colspan=3><span style='font-family:verdana,geneva,sans-serif; font-size: x-large; font-weight: 600; font-style: normal; font-variant: normal; display: block; color: #333333;'>",
    "You have received a protected message.",
    "</span></p></td></tr><tr><td align='center'>&nbsp;</td><td align='center' style='width: 0px;'>&nbsp;</td>", 
    "<td align='left'><a href='https://kiwi.byu.edu/extension.html' style=''><span style='border-radius: 13px;-moz-border-radius: 10px;-webkit-border-radius: 10px;border: 1px solid #474747;padding: 15px;display: inline-block; background-color: #FFFFCC; font-family: Arial, Helvetica, sans-serif; font-size: 12pt; text-decoration: none; font-strength: bold; text-shadow: #fff 0px 1px 0, #000 0 -1px 0; font-color: #333;'>",
    "<font color='333333'><u>Click here</u> to get Pwm (Private Webmail) and read this message.</font>",
    "</a></span></td></tr><tr><td>&nbsp;</td><td colspan='2'>&nbsp;</td></tr><tr><td>&nbsp;</td><td colspan='2'><span style='font-family:verdana,geneva,sans-serif; font-size: 12pt;'>What does this mean?</span></td></tr><tr><td></td><td class='style2' colspan='2'>This message has been encrypted so that only you ",
    "can read it. ",
    "</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td colspan='2'><span style='font-family:verdana,geneva,sans-serif; font-size: 12pt;'>What should I do?</span></td></tr><tr><td>&nbsp;</td><td colspan='2'>If you want to read the contents of the message, you will need to get Pwm.&nbsp;", 
    "Click the button above or visit the ",
    "<a href='https://kiwi.byu.edu/extension.html'>Pwm website</a> to find out how to get",
    "and use Pwm.&nbsp; Once you have Pwm, come back to ",
    "this message in Gmail to read the protected message contents.</td></tr>",
    //"<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td colspan='2'><span style='font-family:verdana,geneva,sans-serif; font-size: 12pt;'>When should I trust this?</span></td></tr><tr><td>&nbsp;</td><td colspan='2'>You should trust this message only if it came from someone you know and trust or if you were expecting a ",
    //"message with sensitive contents.",
    //"Check out the <a href='https://kiwi.byu.edu/extension.html'>Pwm website</a> for a full explanation of what Pwm is, why it is safe, ",
    //"and how it protects you.</td></tr>",
    "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table><div name='preamble'></div><div name='packageWrapper'><div name='packageCaption' style='display: block;'>Encrypted Message Contents:",
    "</div><br />",
    "<div name='package' style='text-overflow:ellipsis;overflow:hidden;font-size:13px;font-family:monospace;word-wrap:break-word;padding:5px;border:solid 1px #808080'-->",
    "<div style='display: block;'>--- Begin Encrypted Message ---</div>",
    "@PACKAGE",
    "<div style='display: block;'>--- End Encrypted Message ---</div>",
    "<!--/div></div-->"
    */
    
    "@PACKAGE"
   
    ].join('\n');

    /**
    * An optional preamble template for user supplied preamble to the bootstrap message.
    * @property preamble
    * @type String
    */
    var preamble = [
    "<div style='display: block;'>",
    "@PREAMBLE",
    "</div>",
    "<br />",
    ].join('\n');

    /**
    * The header for a Pwm subject.
    * @property subjectHeader
    * @type String
    */
    var subjectHeader = "[BME] ";

    /**
    * The regex used to match subjects.
    * @property subjectRegex
    * @type XRegExp
    */
    var subjectRegex = new XRegExp(String.format("(<?MessageType>((?<Reply>re:)|(?<Forward>fwd:))?\\s*)?{0}(?<Subject>.*)", XRegExp.escape(subjectHeader)), "i");

    //#endregion

    var packageWrapper = new Class({

        //#region Fields

        /**
        * The subject of the message.
        * @property subject
        * @type String
        */
        subject: null,

        /**
        * The wrapped subject of the message.
        * @property wrappedSubject
        * @type String
        */
        wrappedSubject: null,

        /**
        * The package that is actually being sent in the message.
        * @property package
        * @type Package
        */
        kiwiPackage: null,

        /**
        * The body of the message that is wrapping the subject.
        * @property wrappedBody
        * @type String
        */
        wrappedBody: null,

        //#endregion

        //#region Body Methods

        /**
        * Wraps the package with an optional preamble message.
        * @method wrapPackage
        * @param {string} preambleMessage An optional pre-amble set by the user for this message.
        */
        wrapPackage: function (preambleMessage) {
            this.wrappedBody = "";
            if (preambleMessage != null && preambleMessage.trim() != "")
                this.wrappedBody += preamble.replace('@PREAMBLE', preambleMessage);
            this.wrappedBody += bootstrapMessage.replace('@PACKAGE', Base64.encodeString(JSON.stringify(this.kiwiPackage), false, false));
        },

        /**
        * Unwraps the package from a message.
        * @method unwrapPackage
        */
        unwrapPackage: function () {
            var root = document.createElement('div');
            root.innerHTML = this.wrappedBody;
            this.kiwiPackage = JSON.parse(Base64.decodeString(jQuery('div[name="package"]', root).eq(0).text()));
        }

        //#endregion

    });


    //#region Simple static package operations 

    /**
    * Checks whether a given subject is a wrapped subject.
    * @method isWrappedSubject
    * @param {String} subject The subject of the message.
    * @return {boolean} Whether the subject is wrapped or not.
    */
    packageWrapper.isWrappedSubject = function (subject) {
        return subjectRegex.test(subject);
    };

    /**
    * Checks whether the given body has a wrapped pacakge.
    * @method hasWrappedPackage
    * @param {String} body The body of the message.
    * @return {boolean} Whether there is a wrapped package or not.
    */
    packageWrapper.hasWrappedPackage = function (body) {
        var root = document.createElement('div');
        root.innerHTML = body;
        return jQuery('div[name="package"]', root).length > 0;
    };

    /**
    * Unwraps the given subject.
    * @method unwrapSubject
    * @param {String} wrappedSubject The wrapped subject.
    * @return {String} The unwrapped package.
    */
    packageWrapper.unwrapSubject = function (wrappedSubject) {
        var results = subjectRegex.exec(wrappedSubject);
        return (results.MessageType == null ? "" : results.MessageType) + results.Subject;
    };

    /**
    * Unwraps the given body.
    * @method unwrapPackage
    * @param {String} wrappedBody The body with a wrapped subject.
    * @return {String} The unwrapped package.
    */
    packageWrapper.unwrapPackage = function (wrappedBody) {
        var wrapper = new packageWrapper();
        wrapper.wrappedBody = wrappedBody;
        try {
            wrapper.unwrapPackage();
            return wrapper.kiwiPackage;
        }
        catch (e) {
            return null;
        }
    };

    /**
    * Gets a template of a body with a package, where the package and its surrounding
    * text is replaced by the given template name.
    * @method getTemplate
    * @param {String} body The body with a wrapped package.
    * @param {String} template The template to insert in place of the package.
    * @return {String} The body with the kiwi message replaced by the template.
    */
    packageWrapper.getTemplate = function (body, template) {
        var messageBody = document.createElement('div');
        messageBody.innerHTML = body;
        jQuery('div[name="packageWrapper"]', messageBody).replaceWith(template);
        jQuery('table[name="DescriptionTable"]', messageBody).remove();

        return messageBody.innerHTML;
    };

    //#endregion

    //#region Static initilaize functions

    /**
    * Creates a package wrapper for a wrapper intended to write messages.
    * @method createWriteWrapper
    * @param {String} subject The subject of the message.
    * @param {String} preambleMessage An optional pre-amble to be included with the bootstrap message.
    * @param {String} package The package to be wrapped.
    * @return {PackageWrapper} The created wrapper.
    */
    packageWrapper.createWriteWrapper = function (subject, preambleMessage, kiwiPackage) {
        var wrapper = new packageWrapper();

        // Set the wrapped subject.
        wrapper.subject = subject;
        var results = subjectRegex.exec(subject);
        if (results != null)
            wrapper.wrappedSubject = subject;
        else
            wrapper.wrappedSubject = String.format("{0}{1}", subjectHeader, subject);

        // Set the package and then wrap the body.
        wrapper.kiwiPackage = kiwiPackage;
        wrapper.wrapPackage(preambleMessage);

        return wrapper;
    };

    /**
    * Creates a package wrapper for a wrapper intended to unwrap messages.
    * @method createWriteWrapper
    * @param {String} wrappedSubject The wrapped subject of the message.
    * @param {String} wrappedBody A wrapped body containing a package.
    * @return {PackageWrapper} The created wrapper, or null if the message could not be decoded.
    */
    packageWrapper.createReadWrapper = function (wrappedSubject, wrappedBody) {
        // Check for some basic assumptions.
        if (wrappedSubject == null || wrappedSubject.trim() == "" || wrappedBody == null || wrappedBody.trim() == "" || !packageWrapper.isWrappedSubject(wrappedSubject))
            return null;

        // Handle the subject.
        var wrapper = new packageWrapper();
        wrapper.wrappedSubject = wrappedSubject;
        wrapper.subject = packageWrapper.unwrapSubject(wrappedSubject);

        wrapper.wrappedBody = wrappedBody;
        try {
            wrapper.unwrapPackage();
        }
        catch (e) {
            return null;
        }

        return wrapper;
    };

    //#endregion

    return packageWrapper;
})();
