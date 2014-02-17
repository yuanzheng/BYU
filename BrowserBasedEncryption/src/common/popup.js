/**
 * Created with IntelliJ IDEA.
 * User: SongYz
 * Date: 10/10/13
 * Time: 9:40 PM
 * To change this template use File | Settings | File Templates.
 */
var user_email = "";
var cipherTitle = new String("--- Begin Encrypted Message ---");
var encryptionMode = true;
/*
localStorage["to_address"] = "";
localStorage["from_address"] = "";
localStorage["current_content"] = "";
localStorage["login"] = "";
*/
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
    if(!login_done)
        return null;

    var email = document.getElementById("login");
    return email.innerText;
}

/*
function save_SenderAddress() {
    var content = document.getElementById("sender").value;

    localStorage["from_address"] = content;

}
*/

// Saves current content into localStorage.
function save_Msg() {
    //var content = document.getElementsByClassName(" nicEdit-main ");
    var editorArea = nicEditors.findEditor("message");
    localStorage["current_content"] = editorArea.getContent();//content[0].innerHTML;

    //update_status(content);
}
/*
function update_status() {
    var content = localStorage["current_content"];

    if (cipherTitle.length <= content.length && encryptionMode) { // decrypt message
        var subContent = content.substr(0, cipherTitle.length);

        if (cipherTitle == subContent) { // modify button "decrypt"
            elementStyleDisplay("addEmail_encrypt", "none");
            elementStyleDisplay("addEmail_decrypt", "");
            
            elementStyleDisplay("to_id", "none");
            elementStyleDisplay("from_id", "");

            elementStyleDisplay("recipient", "none");
            elementStyleDisplay("sender", "");

            // update email address

            encryptionMode = false;
        }
    }
    else if (cipherTitle.length > content.length && !encryptionMode) {
        elementStyleDisplay("addEmail_encrypt", "");
        elementStyleDisplay("addEmail_decrypt", "none");

        elementStyleDisplay("to_id", "");
        elementStyleDisplay("from_id", "none");

        elementStyleDisplay("recipient", "");
        elementStyleDisplay("sender", "none");

        // update email address


        encryptionMode = true;
    }
}
*/

// Restores select box state to saved value from localStorage.
function restore_options() {
    var user_email = localStorage["login"];
    restore_login(user_email);
    toggleEditor();
    restore_content();
    
}

function restore_login(user_email) {
    if (user_email) {  // email existing
        var text = document.createTextNode(user_email);
        var login = document.getElementById("login");
        login.style.width = "";
        document.getElementById("login").appendChild(text);

        //change Popover display status
        var loginPage = document.getElementById("login_Input");
        loginPage.style.display = "none";
        var changePage = document.getElementById("change");
        changePage.style.display = "";

        login_done = true;
    }
    else {// not existing
        var email = document.getElementById("login");
        email.innerText = "log in";
        localStorage["login"] = "";

        //change Popover display status
        var loginPage = document.getElementById("login_Input");
        loginPage.style.display = "";
        var changePage = document.getElementById("change");
        changePage.style.display = "none";
        
        login_done = false;
    }
}

function restore_content() {
    var content = localStorage["current_content"];
    var editorArea = nicEditors.findEditor("message");//document.getElementsByClassName(" nicEdit-main ");

    if (content == undefined || content == "")
        return;
    editorArea.setContent(content);
    //editorArea[0].innerHTML = localStorage["current_content"];
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

    //removeOldCiphertext();
}

function closeButton() {
    if (encryptionMode) {
        var cipherArea = document.getElementById("appendMessage");
        cipherArea.innerText = "";
    }
    else {
        var plainTextArea = document.getElementById("plaintext");
        plainTextArea.innerText = "";


    }

}

/* Encrypt button */
var buttonClass = "";
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

    //var highlight = document.getElementsByClassName("dv");
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
// Cursor is in email address input after launch BME
$(document).ready(function () {

    $('.vO').focus(); // cursor is at email address area

    $(".btn").popover({

    });

    $("#button").click(function (e) {
        e.preventDefault();
        if (done)
            $("#myOutputText").modal('show');
        else
            // Error Messages
            $("#myModalMessage").modal('show');
    });

    
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

function signIn() {
    user_email = document.getElementById("Email").value;
    
    //var text = document.createTextNode(user_email);
    var login = document.getElementById("login");
    login.style.width = "183px";
    login.innerText = user_email;
    //login.appendChild(text);
    var my_email = document.getElementById("email_id");
    my_email.innerText = user_email;
    localStorage["login"] = user_email;

    // finally check if Stay signed in is checked
    if (document.getElementById("PersistentCookie").checked)
        localStorage["login"] = user_email;

    //change Drop menu display status
    elementStyleDisplay("login_Input", "none");
    elementStyleDisplay("change", "");

    login_done = true;
}


function signOut() {
    var login = document.getElementById("login");
    login.innerText = "log in";
    login.style.width = "0px";
    localStorage["login"] = "";

    elementStyleDisplay("login_Input", "");
    elementStyleDisplay("change", "none");
    
    //var my_email = document.getElementById("email_id");
    //my_email.innerText = "";
    document.getElementById("prefix").innerText = "";
    document.getElementById("email_id").innerText = "";

    login_done = false;
}

function menuButton() {
    var loginInfo = document.getElementById("login").innerText;

    if (loginInfo == "log in")
        return;
    //var text = document.createTextNode(loginInfo);
    document.getElementById("email_id").innerText = loginInfo;
    var email_elements = loginInfo.split("@");

    var addPrefix = document.getElementById("prefix");
    addPrefix.innerText = email_elements[1];
    
}

// if either user or recipient's email is not valid, then fail, refuse encryption
function ValidEmailAddress() {
    // Check email address
    if (!login_done) {
        var warning = document.getElementById("messageBody");
        if (encryptionMode)
            warning.innerText = "We need your Email address to encrypt the message, please specify your Email address."
        else
            warning.innerText = "We need your Email address to decrypt the message, please specify your Email address."
        
        return false;
    }
    
    // check again, be sure that there is sender or recipient's email 
    if (encryptionMode) {
        var email = document.getElementById("recipient").value;
        if (email == "") {
            // recipient input your email address please!
            var warning = document.getElementById("messageBody");
            warning.innerText = "Please specify the recipient's Email address.";

            return false;
        }
    }
    /*
    else {
        var warning = document.getElementById("messageBody");
        warning.innerText = "Please specify the sender's Email address.";

        return false;
    }
    */
    return true;
}
/*
function submitContent() {
    update_status();
    ValidEmailAddress();
    
}
*/
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
    done = ValidEmailAddress();
    if (!done)
        return;

    var editorArea = nicEditors.findEditor("message");
    var msg = editorArea.getContent();
    var creatorId = getRecipientAddress();
    
    done = true;
    var recipients = getRecipients();
   
    var cipher = sendEncryptedMessage(msg, creatorId, recipients);

    //removeOldCiphertext();
    if (cipher) {
        elementStyleDisplay("cipher", "");
        var cipherArea = document.getElementById("appendMessage");
        cipherArea.innerText = cipher;//appendChild(packageMessage(cipher));

        var plainTextArea = elementStyleDisplay("plaintext", "none");

        elementStyleDisplay("Encryped_Text", "");
        elementStyleDisplay("Decrypted_Text", "none");
    }
    /*
    // After encryption, recipient's email address should be deleted, avoid mistakes
    var hisEmail = document.getElementById("recipient");
    hisEmail.value = "";
    localStorage["to_address"] = "";
    */
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

function decryption() {
    done = ValidEmailAddress();
    if (!done)
        return;

    var msg = document.getElementById("appendMessage").innerText;
  
    var viewerId = getCreatorId();
    var plainText = decryptEncryptedMessage(msg, viewerId);
    elementStyleDisplay("cipher", "none");
    
    //elementStyleDisplay("plaintext");

    var plainTextArea = elementStyleDisplay("plaintext", "");
    plainTextArea.innerHTML = plainText;
    
    elementStyleDisplay("Encryped_Text", "none");
    elementStyleDisplay("Decrypted_Text", "");
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
    /*
    else {
        editorLaunch.removeInstance('message');
        editorLaunch = null;
        o.style.overflow = "auto";
        padding.className = "Ar";
    }
    */
}

// DOMContent loading, check if there is a signed in email address in local storage/session storage
// And also check if there is a editing message in editing area
document.addEventListener('DOMContentLoaded', restore_options);

document.querySelector('#drop3').addEventListener('click', menuButton);
document.querySelector('#signIn').addEventListener('click', signIn);
document.querySelector('#signOut').addEventListener('click', signOut);
//document.querySelector('#button').addEventListener('click', submitContent);
document.querySelector('#Ebutton').addEventListener('click', encryption);
document.querySelector('#Dbutton').addEventListener('click', decryption);
document.querySelector('#Close').addEventListener('click', closeButton);
document.querySelector('#Trash').addEventListener('click', cleanTable);
//document.querySelector('#addEmail').addEventListener('click', addEmail);

//document.querySelector('#Format').addEventListener('click', toggleArea1);
document.querySelector('#encryptionTab').addEventListener('click', encryptionOption);
document.querySelector('#decryptionTab').addEventListener('click', decryptionOption);

//document.querySelector('#addEmail_encrypt').addEventListener('click', encryption);
//document.querySelector('#addEmail_decrypt').addEventListener('click', decryption);


// Encrypt/Decrypt Button
document.querySelector('#button').addEventListener('mouseover', mouseOverButton, false);
document.querySelector('#button').addEventListener('mouseout', mouseOutButton, false);

// Text format button
document.querySelector('#Format').addEventListener('mouseover', mouseOverFormat, false);
document.querySelector('#Format').addEventListener('mouseout', mouseOutFormat, false);
// Erase content
document.querySelector('#Trash').addEventListener('mouseover', mouseOverTrash, false);
document.querySelector('#Trash').addEventListener('mouseout', mouseOutTrash, false);

document.querySelector('#recipient').addEventListener('keyup', save_RecipientAddress);//save_options);
//document.querySelector('#sender').addEventListener('keyup', save_SenderAddress);
document.querySelector('#textFormat').addEventListener('keyup', save_Msg);
