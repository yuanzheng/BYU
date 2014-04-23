
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


// Restores select box state to saved value from localStorage.
function restore_options() {
    restore_login();
    restore_emailAddress();
    restore_content();
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
    }
}

function closeButton() {
    if (encryptionMode) {
        var cipherArea = document.getElementById("cipher");
        cipherArea.innerText = "";
    }
    else {
        var plainTextArea = document.getElementById("plaintext");
        plainTextArea.innerText = "";
    }

    // click 'x' to cancel processing of encryption or decryption
    if(processStatus) {
        cancel = true;
        clearInterval(vInterval);
        processStatus = false;
    }
        
    //clearProcessDialog();
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
        finish: new Date().setTime(new Date().getTime() + iCms), // now + 60 sec
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
                    /*
                    if(iPerc<35)
                        $(vPb).children().children('#processMessage').html('Retrieving the key...');
                    else {
                        if(encryptionMode) {
                            $(vPb).children().children('#processMessage').html('Starting encryption.');
                        }
                        else {
                            $(vPb).children().children('#processMessage').html('Starting decryption.');
                        }
                    }
                    */
                    $(vPb).children('.pbar').children('.ui-progressbar-value').css('width', iPerc+'%');

                    // in case of Finish
                    if (iPerc >= 100) {
                        
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
        elementStyleDisplay("encryptOutputWindow", "");
        elementStyleDisplay("decryptOutputWindow", "none");
        elementStyleDisplay("copy-button", "");
    }
    else {
        elementStyleDisplay("Encryped_Text", "none");
        elementStyleDisplay("Decrypted_Text", "");
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

    var header =
        "You have received a message that has been <span style='font-weight: bold;'>encrypted</span> using Message Protector (MP). " +
        "<br><br>Directions for decrypting and reading this message can be found at <a href='https://mp.isrl.byu.edu'>https://mp.isrl.byu.edu</a>." +

        "<br><br><br>" + 
        "<pre>---------- Begin Encrypted Message ----------\n";
    var footer =
        "\n---------- End Encrypted Message ----------</pre>";
    
    if (cipher) {
        cipherArea.innerHTML = header + cipher + footer;
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
    var plainText = decryptEncryptedMessage(cipherText, viewerId);

    var warning = document.getElementById("messageBody");
    var title = document.getElementById("ErrorTitle");
    title.innerText = "Failed!";

    if (plainText == "Decryption Failed!") {
        warning.innerHTML = "The email account <b>" + getCreatorId() +
                            "</b> does not have permission to view this message. "+
                            "If you feel this is a mistake, contact the message sender to verify that they encrypted the message for this account.";
        msg_from_login = false;

        $("#myOutputText").modal('hide');
        //cancelProgress();
        $("#errorModalMessage").modal('show');
        return;
    }
    else if (plainText == "Exception") {
        warning.innerHTML = "This is not a complete message. Please check that you have pasted all of the text between <br />" +
                            "<b>“Begin Encrypted Message”</b> and <b>“End Encrypted Message”</b>";

        //"<b>This Encryted Message has been modified!</b> We cannot decrypt it. <br /> "+
          //                  "Please copy and paste the entire message and try again!";
        msg_from_login = false;
        $("#myOutputText").modal('hide');
        //cancelProgress();
        $("#errorModalMessage").modal('show');
        return;
    }
       
    processingDialog();
    plainTextArea.innerHTML = plainText;
    //$("#myOutputText").modal('show');
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
        auto_close: 1000,
        content: 'The encrypted message is in your clipboard now.'
    });
});

function reset_login() {

    var element = document.getElementById("change");
    element.style.display = "";
    
    login_done = true;
    
    $("#LoginMessage").modal('hide');
}

// user doesn't Auth
function clear_login() {

    var element = document.getElementById("change");
    element.style.display = "none";

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

document.addEventListener('DOMContentLoaded', function () {
    toggleEditor();
    
    checkAuthorized();
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


    // Encrypt/Decrypt Button
    document.querySelector('#button').addEventListener('mouseover', mouseOverButton, false);
    document.querySelector('#button').addEventListener('mouseout', mouseOutButton, false);

    // Erase content
    document.querySelector('#Trash').addEventListener('mouseover', mouseOverTrash, false);
    document.querySelector('#Trash').addEventListener('mouseout', mouseOutTrash, false);

    document.querySelector('#recipient').addEventListener('keyup', save_RecipientAddress);
    document.querySelector('#textFormat').addEventListener('keyup', save_Msg);

    if (localStorage["userInfo"]) {
        
        restore_options();
        
        $("#LoginMessage").modal('hide');
    }
    else {
        $("#LoginMessage").modal('show');
    }
    
});



