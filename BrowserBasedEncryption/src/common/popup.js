 
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
    var hisEmail = localStorage["to_address"];
    if (hisEmail) {
        var textArea = document.getElementById("recipient");
        textArea.value = hisEmail;
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
	clearAuthorized();
    var login = document.getElementById("login");
    login.innerText = "login";
    login.style.width = "0px";
    
    document.getElementById("prefix").innerText = "";
    document.getElementById("email_id").innerText = "";

    login_done = false;
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
    // Check email address
    if (!login_done) {
        if (encryptionMode)
            warning.innerHTML = "<b>Warning!</b> We need your Email address to encrypt the message, please login with your Email address."
        else
            warning.innerHTML = "<b>Warning!</b> We need your Email address to decrypt the message, please login with your Email address."

        msg_from_login = true;
        return false;
    }
    
    // check again, be sure that there is sender or recipient's email 
    if (encryptionMode) {
        var email = document.getElementById("recipient").value;
        if (email == "") {
            // recipient input your email address please!
            warning.innerHTML = "<b>Warning!</b> Please specify the recipient's Email address.";
            msg_from_login = false;
            return false;
        }
        // illegal email address spelling
        if (!email.match(/[a-zA-z0-9_.]+@[a-zA-Z0-9_.]+\.(edu|com|org|net)/g)) {
            warning.innerHTML = "<b>Warning!</b> Recipient's email address is in a wrong format. <br />" +
                "Using a wrong email address, recipient cannot decrypt your message.";
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

function encryption() {
    elementStyleDisplay("Encryped_Text", "");
    elementStyleDisplay("Decrypted_Text", "none");
    elementStyleDisplay("encryptOutputWindow", "");
    elementStyleDisplay("decryptOutputWindow", "none");
    var cipherArea = document.getElementById("cipher");

    done = ValidEmailAddress();
    if (!done) {
        $("#myModalMessage").modal('show');
        return;
    }

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
        $("#myOutputText").modal('show');
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
    warning.innerHTML = "The message input did not contain an encrypted message. Please copy and paste the entire message into Message Protector.";     
    //Message is missing!</b> Please copy and paste the entire message from \"--- Begin Encrypted Message ---\" to  \"--- End Encrypted Message ---\".";
    msg_from_login = false;
    return null;
}

function decryption() {
    elementStyleDisplay("encryptOutputWindow", "none");
    elementStyleDisplay("decryptOutputWindow", "");
    elementStyleDisplay("Encryped_Text", "none");
    elementStyleDisplay("Decrypted_Text", "");

    var plainTextArea = document.getElementById("plaintext");
    done = ValidEmailAddress();
    if (!done) {
        $("#myModalMessage").modal('show');
        return;
    }

    var cipherText = GetCipherText();
    if (cipherText == null) {
        done = false;
        $("#myModalMessage").modal('show');
        return;
    }
    
    var msg = document.getElementById("cipherMsg").innerText;
    var viewerId = getCreatorId();
    var plainText = decryptEncryptedMessage(cipherText, viewerId);
   
    if (plainText == "Decryption Failed!") {
        var warning = document.getElementById("messageBody");
        warning.innerHTML = "<b>Sorry</b>, decryption is failed! You may sign in with a wrong email account.<br /> Please try another account or contact with sender to ask which recipient email address using for encryption.";
        msg_from_login = false;
        $("#myModalMessage").modal('show');
        return;
    }
       
    plainTextArea.innerHTML = plainText;
    $("#myOutputText").modal('show');
}

function encryptionOption() {
    var msg = elementStyleDisplay("textFormat", "");
    var cipher = elementStyleDisplay("cipherFormat", "none");
    encryptionMode = true;

    elementStyleDisplay("Ebutton", "");
    elementStyleDisplay("Dbutton", "none");
}

function decryptionOption() {
    var msg = elementStyleDisplay("textFormat", "none");
    var cipher = elementStyleDisplay("cipherFormat", "");
    encryptionMode = false;

    elementStyleDisplay("Ebutton", "none");
    elementStyleDisplay("Dbutton", "");
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

        textArea[0].style.margin= "4px 0px 3px 3px";//"8px 6px";
        textArea[0].style.overflowY = "auto";
        textArea[0].style.width = "706px";//"703px";
        textArea[0].style.minHeight = "inherit";

        editorLaunch.addEvent('blur', function () {
            save_Msg();
        });
    }
}

// Cursor is in email address input after launch BME
$(document).ready(function () {

    $('.vO').focus(); // cursor is at email address area

    /*
    $('a#copy').clipboard({
        path: 'js/jquery.clipboard.swf',
        copy: function() {
            alert('Text copied. Try to paste it now!');
            return; //$('div#cipher').text();
        }
    });
    */
    
    $("#button").hover(function (e) {
        e.preventDefault();
        if ($("#Ebutton").is(':visible')) {
            $("#button").attr('data-original-title', "Encrypt (Ctrl-Enter)")
                        .tooltip({
                            placement: 'top'
                        });
        }

        if ($("#Dbutton").is(':visible')) {
            $("#button").attr('data-original-title', "Decrypt (Ctrl-Enter)")
                        .tooltip({
                            placement: 'top'
                        });
        }
    });

    // Tab switch
    $("#myTab a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });


    $("#FormatTip").tooltip({
        placement: 'top'
    });
    $("#Trash").tooltip({
        placement: 'top'
    });

    $("#To").tooltip({
        placement: 'right'
    });

    $("#From").tooltip({
        placement: 'right'
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

document.addEventListener('DOMContentLoaded', function () {
    toggleEditor();
    document.querySelector('#google_login').addEventListener('click', function() { authorize('google'); });
   
    document.querySelector('#login_button').addEventListener('click', loginButton);
    document.querySelector('#signOut').addEventListener('click', signOut);
    document.querySelector('#errorButton1').addEventListener('click', requestLogin);
    document.querySelector('#errorButton2').addEventListener('click', requestLogin);
    document.querySelector('#Ebutton').addEventListener('click', encryption);
    document.querySelector('#Dbutton').addEventListener('click', decryption);
    document.querySelector('#Close').addEventListener('click', closeButton);
    document.querySelector('#CloseIt').addEventListener('click', closeButton);

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

    checkAuthorized();
  
    if (localStorage["userInfo"]) {
        
        restore_options();
        
        $("#LoginMessage").modal('hide');
    }
    else {
        $("#LoginMessage").modal('show');
    }
});
