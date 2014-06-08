
var user_email = "";
var cipherTitle = new String("--- Begin Encrypted Message ---");
var encryptionMode = true;
/* Encrypt button */
var buttonClass = "";


// Save this script as `options.js`
function save_RecipientAddress() {
    var email = document.getElementById("recipient").value;
    localStorage["to_address"] = email;
}

/*
 */
function getRecipientAddress() {
    var email = document.getElementById("recipient").value;
    if(email=="")
        return null;

    return email;
}

function getCreatorId() {
    if (!localStorage["userInfo"])
        return null;

    var user_info = JSON.parse(localStorage["userInfo"]);
    var email = user_info.email;
    return email;
}



// Saves current content into localStorage.
function save_Msg() {
    var editorArea = nicEditors.findEditor("message");
    localStorage["current_content"] = editorArea.getContent();
}

// Saves pasted cipher into localStorage
function save_cipher(e) {
    // paste encrypted message by "ctrl+v"
    if((e.keyCode == 86 && e.ctrlKey) || (e.keyCode == 224 && e.metaKey)) {
        var editorArea = document.getElementById("cipherMsg");
        localStorage["cipher"] = editorArea.innerHTML;
    }
    
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    restore_login();
    restore_emailAddress();
    restore_content();
    restore_cipher();
    restore_tab();
    restore_lastStatus();
}

function restore_tab() {
    if(localStorage["Tab"] == "encryption") {
        var en = document.getElementById("encryptionTab");
        en.className = "active";
        var de = document.getElementById("decryptionTab")
        de.className = "";
        var h = document.getElementById("helpandtutorialsTab");
        h.className = "";

        var en1 = document.getElementById("sectionA");
        en1.className += " active in";
        var de1 = document.getElementById("sectionB")
        de1.className = "tab-pane fade";
        var h1 = document.getElementById("sectionC")
        h1.className = "tab-pane fade";

        encryptionOption();

        //localStorage["encryption_status"] = "open";
        //localStorage["decryption_status"] = "closed";
    }

    if(localStorage["Tab"] == "decryption") {
        var de = document.getElementById("decryptionTab")
        de.className = "active";
        var en = document.getElementById("encryptionTab");
        en.className = "";
        var h = document.getElementById("helpandtutorialsTab");
        h.className = "";

        var de1 = document.getElementById("sectionB")
        de1.className += " active in";
        var en1 = document.getElementById("sectionA");
        en1.className = "tab-pane fade";
        var h1 = document.getElementById("sectionC")
        h1.className = "tab-pane fade";

        decryptionOption();

    }

    if(localStorage["Tab"] == "help") {
        var h = document.getElementById("helpandtutorialsTab");
        h.className = "active";
        var en = document.getElementById("encryptionTab");
        en.className = "";
        var de = document.getElementById("decryptionTab")
        de.className = "";

        var h1 = document.getElementById("sectionC")
        h1.className += " active in";
        var en1 = document.getElementById("sectionA");
        en1.className = "tab-pane fade";
        var de1 = document.getElementById("sectionB")
        de1.className = "tab-pane fade";
        
        helpandTutorials();
		
    }
}

function restore_lastStatus() {
    if(localStorage["encryption_status"] == "open" && localStorage["Tab"] == "encryption") {
        encryptionMode = true;
        var instuction = document.getElementById("Instruction");
        instuction.innerHTML = "The message has been encrypted for <strong>" +
                            localStorage["to_address"] +"</strong>.<br />To copy this message, select “Copy to Clipboard” below.";

        var cipherArea = document.getElementById("cipher");
        cipherArea.innerHTML = localStorage["encryptedMSG"];
        
        showOutput();
        $("#myOutputText").modal('show');
    }

    if(localStorage["decryption_status"] == "open" && localStorage["Tab"] == "decryption") {
        encryptionMode = false;
        var title = document.getElementById("Decrypted_Text");
        title.innerHTML = "<strong font-weight: bold;>Decryption Succeeded: </strong> This message was sent from " +
                       localStorage["sender"] +".";
        var plainTextArea = document.getElementById("plaintext");
        plainTextArea.innerHTML = localStorage["decryptedMSG"];
    
        showOutput();
        $("#myOutputText").modal('show');
    }
}

function restore_login() {
    var userInfo = localStorage["userInfo"];

	if (userInfo) {  // userinfo existing
        var changePage = document.getElementById("change");
        changePage.style.display = "";
        login_done = true;
    }
    else {// not existing
        var changePage = document.getElementById("change");
        changePage.style.display = "none";
        
        login_done = false;
    }
}

function restore_content() {
    var content = localStorage["current_content"];
    var editorArea = nicEditors.findEditor("message");
    if (content == undefined || content == "")
        return;
    editorArea.setContent(content);
}

function restore_cipher() {
    var cipher = localStorage["cipher"];
    var editorArea = document.getElementById("cipherMsg");

    if(cipher == undefined || cipher == "")
        return;

    editorArea.innerHTML = cipher;
}

function restore_emailAddress() {
    var recipientEmail = localStorage["to_address"];
    if (recipientEmail) {
        var textArea = document.getElementById("recipient");
        textArea.value = recipientEmail;
    }
}


// delete message, and erase to/from email address
function cleanTable() {
    if (encryptionMode) {
        var editorArea = nicEditors.findEditor("message");
        editorArea.setContent("<br>");
        localStorage["current_content"] = "";

        var hisEmail = document.getElementById("recipient");
        localStorage["to_address"] = "";
        hisEmail.value = "";
    }
    else {
        var cipherArea = document.getElementById("cipherMsg");
        cipherArea.innerText = "";
        localStorage["cipher"] = "";
    }
}

function closeButton() {
    if (encryptionMode) {
        var cipherArea = document.getElementById("cipher");
        cipherArea.innerText = "";
        localStorage["encryption_status"] = "closed";
        localStorage["encryptedMSG"] = "";
    }
    else {
        var plainTextArea = document.getElementById("plaintext");
        plainTextArea.innerText = "";
        localStorage["decryption_status"] = "closed";
        localStorage["decryptedMSG"] = "";
        localStorage["sender"] = "";
    }

    // click 'x' to cancel processing of encryption or decryption
    if(processStatus) {
        cancel = true;
        clearInterval(vInterval);
        processStatus = false;
    }
        
}

var processStatus = false;
var cancel = false;
function cancelProgress() {
    closeButton();
    cancel = true;
    clearInterval(vInterval);
    processStatus = false;
}

function selectEntireMsg() {
    if (encryptionMode) {
        var cipherArea = document.getElementById("cipher");

        cipherArea.focus();
        cipherArea.select();
    }
    else {
        var plainTextArea = document.getElementById("plaintext");
        plainTextArea.innerText = "";
    }
}


function mouseOverButton() {
    var button = document.getElementById("button");
    buttonClass = button.className;
    button.className += " TIjw";
}

function mouseOutButton() {
    var button = document.getElementById("button");
    button.className = buttonClass;
    buttonClass = "";
}

// highlight text Format tool button "A"
function mouseOverFormat() {
    var button = document.getElementById("Format");
    buttonClass = button.className;
    button.className += " JZIJW";
    // add jquery to modify class attribute - opacity
    $('.dv').css({opacity:'1.0'});
}

function mouseOutFormat() {
    var button = document.getElementById("Format");
    button.className = buttonClass;
    buttonClass = "";
    $('.dv').css({ opacity: '.55' });
}

function mouseOverTrash() {
    var button = document.getElementById("Trash");
    buttonClass = button.className;
    button.className += " JZIJW";

    $('.og').css({ opacity: '1.0' });
}

function mouseOutTrash() {
    var button = document.getElementById("Trash");
    button.className = buttonClass;
    buttonClass = "";
    $('.og').css({ opacity: '.55' });
}

var done = false;  // all set, include login email address and sender/recipient email address
var login_done = false;


function signOut() {
    // logout
	clearAuthorized();
    var login = document.getElementById("login");
    login.innerText = "login";
   
    document.getElementById("prefix").innerText = "";
    document.getElementById("email_id").innerText = "";

    login_done = false;

    if (!localStorage["userInfo"]) {
        
        $("#LoginMessage").modal('show');
    }

    cleanAllContent();
}

// user signs out, delete all contents
function cleanAllContent() {
    var editorArea = nicEditors.findEditor("message");
    editorArea.setContent("<br>");
    localStorage["current_content"] = "";

    var hisEmail = document.getElementById("recipient");
    localStorage["to_address"] = "";
    hisEmail.value = "";

    var cipherArea = document.getElementById("cipherMsg");
    cipherArea.innerText = "";
    localStorage["cipher"] = "";
}

function loginButton() {
    // if never log in before
    if (!localStorage["userInfo"]) {
		var loginInfo = document.getElementById("login_button");
		loginInfo.removeAttribute("data-toggle");
        $("#LoginMessage").modal('show'); // google OAuth
        return;
    }
}

var msg_from_login = false;
// if either user or recipient's email is not valid, then fail, refuse encryption
function ValidEmailAddress() {
    var warning = document.getElementById("messageBody");
    var title = document.getElementById("ErrorTitle");
    title.innerText = "Error";
    // Check email address
    if (!login_done) {
        if (encryptionMode)
            warning.innerHTML = "<b>Warning!</b> We need your email address to encrypt the message, "+
                                "please login with your Email address."
        else
            warning.innerHTML = "<b>Warning!</b> We need your email address to decrypt the message, "+
                                "please login with your Email address."

        msg_from_login = true;
        return false;
    }
    
    // check again, be sure that there is sender or recipient's email 
    if (encryptionMode) {
        var email = document.getElementById("recipient").value;
        if (email == "") {
            // recipient input your email address please!
            warning.innerHTML = "<b>Warning!</b> Please specify the recipient's email address.";
            msg_from_login = false;
            return false;
        }
        // illegal email address spelling
        if (!email.match(/[a-zA-z0-9_.]+@[a-zA-Z0-9_.]+\.(edu|com|org|net)/g)) {
            warning.innerHTML = "<b>Warning!</b> Recipient's email address is not a valid email address. <br />";
            msg_from_login = false;
            return false;
        }
    }
    return true;
}

function requestLogin() {
    if (!login_done && msg_from_login) {
        $("#LoginMessage").modal('show');
    }
}

function elementStyleDisplay(id, value) {
    var element = document.getElementById(id);
    element.style.display = value;
    return element;
}

function getRecipients() {
    var recipients = new Array();
    var emails = getRecipientAddress();
    if (emails)
        recipients[0] = emails;
    
    var login = getCreatorId();
    if (login)
        recipients[1] = login;

    return recipients;
}

var vInterval;

jQuery.fn.anim_progressbar = function (aOptions) {
    // def values
    var iCms = 1000;
    var iMms = 60 * iCms;
    var iHms = 3600 * iCms;
    var iDms = 24 * 3600 * iCms;

    // def options
    var aDefOpts = {
        start: new Date(), // now
        finish: new Date().setTime(new Date().getTime() + iCms), // now + 2 sec
        interval: 100
    }
    var aOpts = jQuery.extend(aDefOpts, aOptions);
    var vPb = this;

    // each progress bar
    return this.each(
        function() {
            var iDuration = aOpts.finish - aOpts.start;

            // calling original progressbar
            $(vPb).children('.pbar').progressbar();

            // looping process
            vInterval = setInterval(
                function(){
                    var iLeftMs = aOpts.finish - new Date(); // left time in MS
                    var iElapsedMs = new Date() - aOpts.start, // elapsed time in MS
                        iDays = parseInt(iLeftMs / iDms), // elapsed days
                        iHours = parseInt((iLeftMs - (iDays * iDms)) / iHms), // elapsed hours
                        iMin = parseInt((iLeftMs - (iDays * iDms) - (iHours * iHms)) / iMms), // elapsed minutes
                        iSec = parseInt((iLeftMs - (iDays * iDms) - (iMin * iMms) - (iHours * iHms)) / iCms), // elapsed seconds
                        iPerc = (iElapsedMs > 0) ? iElapsedMs / iDuration * 100 : 0; // percentages

                    // display current positions and progress
                    $(vPb).children().children('.percent').html('<b>'+iPerc.toFixed(0)+'%</b>');
                    $(vPb).children('.pbar').children('.ui-progressbar-value').css('width', iPerc+'%');
                    
                    // in case of Finish
                    if (iPerc >= 95) {
                        
                        $(vPb).children().children('.percent').html('<b>100%</b>');
                        //$(vPb).children('.elapsed').html('Finished');

                        if (!cancel) {
                            
                            if(encryptionMode) {
                                //document.getElementById("processMessage").innerHTML = "Encryption is complete!";
                                $(vPb).children().children('#processMessage').html('Encryption is complete!');
                            }
                            else {
                                //document.getElementById("processMessage").innerHTML = "Decryption is complete!";
                                $(vPb).children().children('#processMessage').html('Decryption is complete!');

                            }

                            showOutput();
                        }

                        clearInterval(vInterval);
                    }
                } ,aOpts.interval
            );
        }
    );
}

function initializeProcessDialog() {
    
    elementStyleDisplay("processing", "");

    elementStyleDisplay("Encryped_Text", "none");
    elementStyleDisplay("Decrypted_Text", "none");
    elementStyleDisplay("Instruction", "none");
    elementStyleDisplay("encryptOutputWindow", "none");
    elementStyleDisplay("decryptOutputWindow", "none");

    elementStyleDisplay("cancelIt", "");
    elementStyleDisplay("copy-button", "none");
    elementStyleDisplay("CloseIt", "none");

    document.getElementById("processMessage").innerHTML = "";
    var dialog = document.getElementById("myOutputText");
    dialog.style.height = "";
}

function processingDialog() {

    cancel = false; // reset cancel status
    processStatus = true;  // in processing status

    if(encryptionMode) {
        elementStyleDisplay("encrypt_Processsing", "");
        elementStyleDisplay("decrypt_Processsing", "none");
    }
    else {
        elementStyleDisplay("encrypt_Processsing", "none");
        elementStyleDisplay("decrypt_Processsing", "");
    }
    
    initializeProcessDialog();
    
    $("#myOutputText").modal('show');
    $('#progress1').anim_progressbar();

}

function showOutput() {
    if(encryptionMode) {
        elementStyleDisplay("Encryped_Text", "");
        elementStyleDisplay("Decrypted_Text", "none");
        elementStyleDisplay("Instruction", "");
        elementStyleDisplay("encryptOutputWindow", "");
        elementStyleDisplay("decryptOutputWindow", "none");
        elementStyleDisplay("copy-button", "");
    }
    else {
        elementStyleDisplay("Encryped_Text", "none");
        elementStyleDisplay("Decrypted_Text", "");
        elementStyleDisplay("Instruction", "none");
        elementStyleDisplay("encryptOutputWindow", "none");
        elementStyleDisplay("decryptOutputWindow", "");
    }

    elementStyleDisplay("encrypt_Processsing", "none");
    elementStyleDisplay("decrypt_Processsing", "none");
    elementStyleDisplay("processing", "none");
    elementStyleDisplay("cancelIt", "none");
    
    elementStyleDisplay("CloseIt", "");
    var dialog = document.getElementById("myOutputText");
    dialog.style.height = "487px";
}

function encryption() {
    
    done = ValidEmailAddress();

    if (!done) {
        $("#errorModalMessage").modal('show');
        return;
    }
    
    processingDialog();

    var cipherArea = document.getElementById("cipher");

    var editorArea = nicEditors.findEditor("message");
    var msg = editorArea.getContent();
    var creatorId = getRecipientAddress();
    
    var recipients = getRecipients();
   
    var cipher = sendEncryptedMessage(msg, creatorId, recipients);

    var instuction = document.getElementById("Instruction");
    instuction.innerHTML = "The message has been encrypted for <strong>" +
                            localStorage["to_address"] +"</strong>.<br />To copy this message, select “Copy to Clipboard” below.";
    var header =
        "You have received a message that has been <span style='font-weight: bold;'>encrypted</span> using Message Protector (MP). " +
        "<br><br>Directions for decrypting and reading this message can be found at <a href='https://mp.isrl.byu.edu'>https://mp.isrl.byu.edu</a>." +

        "<br><br><br>" + 
        "<pre>---------- Begin Encrypted Message ----------\n";
    var footer =
        "\n---------- End Encrypted Message ----------</pre>";
    
    if (cipher) {
        //var cipherArea = document.getElementById("cipher");
        cipherArea.innerHTML = header + cipher + footer;
        localStorage["encryption_status"] = "open";
        localStorage["encryptedMSG"] = header + cipher + footer;
    }
}

function packageMessage(cipher) {
    var newNode = document.createElement("span");
    newNode.id = "t1";
    newNode.appendChild(document.createTextNode(cipher));

    return newNode;
}

function removeOldCiphertext() {
    var cipherNode = document.getElementById("appendMessage");
    var childNode = document.getElementById("t1");

    if(childNode!=null)
        cipherNode.removeChild(childNode);
}

function GetCipherText() {
    var cipher = document.getElementById("cipherMsg").innerText;
    var base64Regex = /(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})/g;
    var message = "";
    while (message = base64Regex.exec(cipher)) {
        if (message[0].length > 20) {
            return message[0];
        }
    }

    var warning = document.getElementById("messageBody");
    var title = document.getElementById("ErrorTitle");
    title.innerText = "Error";
    warning.innerHTML = "<b>No encrypted message specified!</b> <br /> "+
                        "Please copy and paste the entire message into Message Protector.";     

    msg_from_login = false;
    return null;
}

function decryption_error(msg_package) {
    var warning = document.getElementById("messageBody");
    var title = document.getElementById("ErrorTitle");
    title.innerText = "Failed!";

    if (msg_package == "Decryption Failed!") {
        warning.innerHTML = "The email account <b>" + getCreatorId() +
                            "</b> does not have permission to view this message. "+
                            "If you feel this is a mistake, contact the message sender to verify that they encrypted the message for this account.";
        msg_from_login = false;

        $("#myOutputText").modal('hide');
        //cancelProgress();
        $("#errorModalMessage").modal('show');
        return true;
    }
    else if (msg_package == "Exception") {
        warning.innerHTML = "This is not a complete message. Please check that you have pasted all of the text between <br />" +
                            "<b>“Begin Encrypted Message”</b> and <b>“End Encrypted Message”</b>";

        msg_from_login = false;
        $("#myOutputText").modal('hide');
        //cancelProgress();
        $("#errorModalMessage").modal('show');
        return true;
    }
    
    return false;
}

function decryption() {
    
    var plainTextArea = document.getElementById("plaintext");
    done = ValidEmailAddress();
    if (!done) {
        $("#errorModalMessage").modal('show');
        return;
    }

    var cipherText = GetCipherText();
    if (cipherText == null) {
        done = false;
        $("#myOutputText").modal('hide');
        //cancelProgress();
        $("#errorModalMessage").modal('show');
        return;
    }

    var msg = document.getElementById("cipherMsg").innerText;
    var viewerId = getCreatorId();
    var msg_package = decryptEncryptedMessage(cipherText, viewerId);

    // if decryption is error
    if(decryption_error(msg_package))
        return;
    
    processingDialog();
    var title = document.getElementById("Decrypted_Text");
    title.innerHTML = "<strong font-weight: bold;>Decryption Succeeded: </strong> This message was sent from " +
                       msg_package.sender +".";

    localStorage["sender"] = msg_package.sender;
    //var plainTextArea = document.getElementById("plaintext");
    plainTextArea.innerHTML = msg_package.message;
    localStorage["decryptedMSG"] = msg_package.message;
    localStorage["decryption_status"] = "open";
}

function encryptionOption() {
    var msg = elementStyleDisplay("textFormat", "");
    var cipher = elementStyleDisplay("cipherFormat", "none");
    encryptionMode = true;

    elementStyleDisplay("Ebutton", "");
    elementStyleDisplay("Dbutton", "none");

    updateTabindex_for_ecryption();
    //button.data-original-title = "Encrypt (Ctrl-Enter)";
    var textArea = document.getElementById("message")
    textArea.focus();

    var content = document.getElementById("contentArea");
    content.style.height = null;
    localStorage["Tab"] = "encryption";
}

function updateTabindex_for_ecryption() {
    var login = document.getElementById("login");
    login.tabIndex = "1";

    var emailField = document.getElementById("recipient");
    emailField.tabIndex = "2";

    var editor = document.getElementById("cipherMsg");
    editor.tabIndex = "";

    var button = document.getElementById("button");
    button.tabIndex = "4";
    $("#button").attr('data-original-title', "Encrypt")
                        .tooltip({
                            placement: 'top'
                        });

    var trashTabindex = document.getElementById("Trash");
    trashTabindex.tabIndex = "5";
}

function decryptionOption() {
    var msg = elementStyleDisplay("textFormat", "none");
    var cipher = elementStyleDisplay("cipherFormat", "");
    encryptionMode = false;

    elementStyleDisplay("Ebutton", "none");
    elementStyleDisplay("Dbutton", "");

    updateTabindex_for_decryption();

    // active cipher text area, focus
    var cipherEditing = document.getElementById("cipherMsg");
    cipherEditing.focus();

    var content = document.getElementById("contentArea");
    content.style.height = null;
    localStorage["Tab"] = "decryption"
}

function updateTabindex_for_decryption()
{
    var login = document.getElementById("login");
    login.tabIndex = "4";

    var emailField = document.getElementById("recipient");
    emailField.tabIndex = "";

    var editor = document.getElementById("cipherMsg");
    editor.tabIndex = "1";

    var button = document.getElementById("button");
    button.tabIndex = "2";
    $("#button").attr('data-original-title', "Decryption (Enter)")
                        .tooltip({
                            placement: 'top'
                        });

    var trashTabindex = document.getElementById("Trash");
    trashTabindex.tabIndex = "3";

}

function helpandTutorials() {
    var msg = elementStyleDisplay("textFormat", "none");
    var cipher = elementStyleDisplay("cipherFormat", "none");
    var help = elementStyleDisplay("help", "");
    encryptionMode = false;

    elementStyleDisplay("Ebutton", "none");
    elementStyleDisplay("Dbutton", "none");

    updateTabindex_for_help();

    var content = document.getElementById("contentArea");
    content.style.height = "449px";
    localStorage["Tab"] = "help";
}

function updateTabindex_for_help() {
    var login = document.getElementById("login");
    login.tabIndex = "4";

    var emailField = document.getElementById("recipient");
    emailField.tabIndex = "";

    var editor = document.getElementById("cipherMsg");
    editor.tabIndex = "1";

    var button = document.getElementById("button");
    button.tabIndex = "2";
    $("#button").attr('data-original-title', "")
                        .tooltip({
                            placement: 'top'
                        });

    var trashTabindex = document.getElementById("Trash");
    trashTabindex.tabIndex = "2";

}

var editorLaunch = null;
function toggleEditor() {
    var o = document.getElementById("overflow");
    var padding = document.getElementById("textFormat");
    var textArea = document.getElementsByClassName(" nicEdit-main ");
   
    if (!editorLaunch) {
        editorLaunch = new nicEditor({ fullPanel: true }).panelInstance('message', { hasPanel: true });
        o.style.overflow = "hidden";
        padding.className = "Ar Arr";
        padding.children[0].style.width = "712px";
        padding.children[1].style.width = "710px";
        padding.children[1].style.borderRightStyle = "none";
        padding.children[1].style.borderBottomStyle = "none";
        padding.children[1].style.borderLeftStyle = "none";

        textArea[0].style.margin= "0px";//"4px 0px 3px 3px";//"8px 6px";
        textArea[0].style.overflowY = "auto";
        textArea[0].style.width = "initial";//"706px";//"703px";
        textArea[0].style.minHeight = "inherit";
        textArea[0].style.padding = "8px 14px 6px 10px";
        textArea[0].tabIndex = "3";

        editorLaunch.addEvent('blur', function () {
            save_Msg();
        });
        
    }
}

// Cursor is in email address input after launch BME
$(document).ready(function () {

    $('.vO').focus(); // cursor is at email address area

    // Tab switch
    $("#myTab a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });


    $("#FormatTip").tooltip({
        placement: 'top'
    });

    $("#button").tooltip({
        placement: 'top'
    });


    $("#Trash").tooltip({
        placement: 'top'
    });

    $(document).keypress(function(e) {
        if(e.which == 13 && !encryptionMode)
            decryption();
    });

    $('#copy-button').clickover({
        placement: 'top', 
        auto_close: 3000,
        content: 'The encrypted message is now in your clipboard and ready to be copied into your application.'
    });

    
});

function reset_login() {

    elementStyleDisplay("change", "");
    login_done = true;
    
    $("#LoginMessage").modal('hide');
}

// user doesn't Auth
function clear_login() {

    elementStyleDisplay("change", "none");

    delete localStorage["userInfo"];

    login_done = false;
}

function select_all() {
    el = document.getElementById('cipher');
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.selection != "undefined" && typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.select();
    }
}

function changeAccount() {
    clearAuthorized();
    login_done = false; 
    authorize('google'); 
}

function initialize_ui() {

    if(localStorage["skiptomp"] != "true") {
        elementStyleDisplay("mp", "none");
        elementStyleDisplay("beginTutorials", "");
        elementStyleDisplay("Ebutton", "none");
        elementStyleDisplay("Dbutton", "none");

        //localStorage["firtTime"] = false;
        localStorage["Tab"] = "encryption";
    }
    else {
        elementStyleDisplay("mp", "");
        elementStyleDisplay("beginTutorials", "none");
        elementStyleDisplay("Ebutton", "");
        elementStyleDisplay("Dbutton", "none");

        checkAuthorized();
        toggleEditor();
        if (localStorage["userInfo"]) {
            
            restore_options();
            
            $("#LoginMessage").modal('hide');
        }
        else {
            $("#LoginMessage").modal('show');
        }
    }
}

function skipTutorial() {
	localStorage["skiptomp"] = "true";
    initialize_ui();
}

function tutorials() {
    elementStyleDisplay("help", "none");
    elementStyleDisplay("Tutorials", "");
    elementStyleDisplay("securitydetails", "none");
}

function securitydetails() {
    elementStyleDisplay("help", "none");
    elementStyleDisplay("Tutorials", "none");
    elementStyleDisplay("securitydetails", "");
}

function tutorialPrevious() {
    elementStyleDisplay("help", "");
    elementStyleDisplay("Tutorials", "none");
    elementStyleDisplay("securitydetails", "none");
}

function securityPrevious() {
    elementStyleDisplay("help", "");
    elementStyleDisplay("Tutorials", "none");
    elementStyleDisplay("securitydetails", "none");
}

var counter = 0;
function continueTutorial() {
    elementStyleDisplay("weltitle", "none");
    elementStyleDisplay("firstTutorial", "");
    switch(counter) {
        case 0: elementStyleDisplay("firstTutorial", "");
                elementStyleDisplay("decryptTitle", "");
                elementStyleDisplay("dec_first", "");
                break;
        case 1: elementStyleDisplay("dec_second", "");
                elementStyleDisplay("dec_first", "none");
                break;
        case 2: elementStyleDisplay("dec_third", "");
                elementStyleDisplay("dec_second", "none");
                break;
        case 3: elementStyleDisplay("dec_forth", "");
                elementStyleDisplay("dec_third", "none");
                break;
        case 4: elementStyleDisplay("dec_fifth", "");
                elementStyleDisplay("dec_forth", "none");
                break;
        case 5: elementStyleDisplay("dec_fifth_helf", "");
                elementStyleDisplay("dec_fifth", "none");
                break;
        case 6: elementStyleDisplay("encryptTitle", "");
                elementStyleDisplay("enc_sixth", "");
                elementStyleDisplay("dec_fifth_helf", "none");
                elementStyleDisplay("decryptTitle", "none");
                break;
        case 7: elementStyleDisplay("enc_seventh", "");
                elementStyleDisplay("enc_sixth", "none");
                break;
        case 8: elementStyleDisplay("enc_eighth", "");
                elementStyleDisplay("enc_seventh", "none");
                break;
        case 9: elementStyleDisplay("enc_ninth", "");
                elementStyleDisplay("enc_eighth", "none");
                break;
        case 10: elementStyleDisplay("enc_tenth", "");
                elementStyleDisplay("enc_ninth", "none");
                break;
        case 11: elementStyleDisplay("enc_eleventh", "");
                elementStyleDisplay("enc_tenth", "none");
                break;
        case 12: elementStyleDisplay("enc_twelvth", "");
                elementStyleDisplay("enc_eleventh", "none");
                elementStyleDisplay("encryptTitle", "none");
                break;
        default:
                break;
    }
 
    if(counter<13)
        counter++;

}

function previousTutorial() {
  
    if(counter >=0) {
        switch(counter) {
            case 1: elementStyleDisplay("weltitle", "");
                    elementStyleDisplay("firstTutorial", "none");
                    elementStyleDisplay("dec_first", "none");
                    break;
            case 2: elementStyleDisplay("dec_second", "none");
                    elementStyleDisplay("dec_first", "");
                    break;
            case 3: elementStyleDisplay("dec_third", "none");
                    elementStyleDisplay("dec_second", "");
                    break;
            case 4: elementStyleDisplay("dec_forth", "none");
                    elementStyleDisplay("dec_third", "");
                    break;
            case 5: elementStyleDisplay("dec_fifth", "none");
                    elementStyleDisplay("dec_forth", "");
                    break;
            case 6: elementStyleDisplay("dec_fifth_helf", "none");
                    elementStyleDisplay("dec_fifth", "");
                    break;
            case 7: elementStyleDisplay("dec_fifth_helf", "");
                    elementStyleDisplay("decryptTitle", "");
                    elementStyleDisplay("encryptTitle", "none");
                    elementStyleDisplay("enc_sixth", "none");
                    break;
            case 8: elementStyleDisplay("enc_seventh", "none");
                    elementStyleDisplay("enc_sixth", "");
                    break;
            case 9: elementStyleDisplay("enc_eighth", "none");
                    elementStyleDisplay("enc_seventh", "");
                    break;
            case 10: elementStyleDisplay("enc_ninth", "none");
                    elementStyleDisplay("enc_eighth", "");
                    break;
            case 11: elementStyleDisplay("enc_tenth", "none");
                    elementStyleDisplay("enc_ninth", "");
                    break;
            case 12: elementStyleDisplay("enc_eleventh", "none");
                    elementStyleDisplay("enc_tenth", "");
                    break;
            case 13: elementStyleDisplay("enc_twelvth", "none");
                    elementStyleDisplay("enc_eleventh", "");
                    elementStyleDisplay("encryptTitle", "");
                    break;
            default:
                    break;
        }
        counter--;
    }
    if(counter<0)
        counter++;
}

document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('#google_login').addEventListener('click', function() { authorize('google'); });
    document.querySelector('#login_button').addEventListener('click', loginButton);
    document.querySelector('#signOut').addEventListener('click', signOut);
    document.querySelector('#changeAccount').addEventListener('click', changeAccount);

    document.querySelector('#errorXButton').addEventListener('click', requestLogin);
    document.querySelector('#errorCloseButton').addEventListener('click', requestLogin);
    document.querySelector('#Ebutton').addEventListener('click', encryption);
    document.querySelector('#Dbutton').addEventListener('click', decryption);
    document.querySelector('#Close').addEventListener('click', closeButton);
    document.querySelector('#CloseIt').addEventListener('click', closeButton);
    document.querySelector('#cancelIt').addEventListener('click', cancelProgress);

    document.querySelector('#cipher').addEventListener('click', select_all);
    document.querySelector('#Trash').addEventListener('click', cleanTable);

    document.querySelector('#encryptionTab').addEventListener('click', encryptionOption);
    document.querySelector('#decryptionTab').addEventListener('click', decryptionOption);
    document.querySelector('#helpandtutorialsTab').addEventListener('click', helpandTutorials);

    document.querySelector('#tutorial').addEventListener('click', tutorials);
    document.querySelector('#security').addEventListener('click', securitydetails);

    document.querySelector('#tutorialPrevious').addEventListener('click', tutorialPrevious);
    document.querySelector('#securityPrevious').addEventListener('click', securityPrevious);


    // Encrypt/Decrypt Button
    document.querySelector('#button').addEventListener('mouseover', mouseOverButton, false);
    document.querySelector('#button').addEventListener('mouseout', mouseOutButton, false);

    // Erase content
    document.querySelector('#Trash').addEventListener('mouseover', mouseOverTrash, false);
    document.querySelector('#Trash').addEventListener('mouseout', mouseOutTrash, false);

    document.querySelector('#recipient').addEventListener('keyup', save_RecipientAddress);
    document.querySelector('#textFormat').addEventListener('keyup', save_Msg);
    document.querySelector('#cipherMsg').addEventListener('keyup', save_cipher);

    document.querySelector('#continue').addEventListener('click', continueTutorial);
    document.querySelector('#previous').addEventListener('click', previousTutorial);
    document.querySelector('#skip').addEventListener('click', skipTutorial);

    initialize_ui(); 

});



