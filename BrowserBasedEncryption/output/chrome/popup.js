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
    var content = document.getElementById("recipient").value;

    localStorage["to_address"] = content;

}

function save_SenderAddress() {
    var content = document.getElementById("sender").value;

    localStorage["from_address"] = content;

}
// Saves current content into localStorage.
function save_Msg() {
    var content = document.getElementById("message").innerText;

    localStorage["current_content"] = content;

    update_status(content);
}

function update_status(content) {
    if (cipherTitle.length <= content.length && encryptionMode) { // decrypt message
        var subContent = content.substr(0, cipherTitle.length);

        if (cipherTitle == subContent) { // modify button "decrypt"
            elementStyleDisplay("Ebutton", "none");
            elementStyleDisplay("Dbutton", "");
            
            elementStyleDisplay("to_id", "none");
            elementStyleDisplay("from_id", "");

            elementStyleDisplay("recipient", "none");
            elementStyleDisplay("sender", "");

            // update email address

            encryptionMode = false;
        }
    }
    else if (cipherTitle.length > content.length && !encryptionMode) {
        elementStyleDisplay("Ebutton", "");
        elementStyleDisplay("Dbutton", "none");

        elementStyleDisplay("to_id", "");
        elementStyleDisplay("from_id", "none");

        elementStyleDisplay("recipient", "");
        elementStyleDisplay("sender", "none");

        // update email address


        encryptionMode = true;
    }
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    var user_email = localStorage["login"];
    restore_login(user_email);
    
    var content = localStorage["current_content"];
    if(content)
        restore_content(content)

    //TODO  restore to/send email address
    //restore_emailAddress();
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
    }
    else {// not existing
        var text = document.getElementById("login");
        text.innerText = "log in";
        localStorage["login"] = "";

        //change Popover display status
        var loginPage = document.getElementById("login_Input");
        loginPage.style.display = "";
        var changePage = document.getElementById("change");
        changePage.style.display = "none";
        
    }
}

function restore_content(content) {
    var textArea = document.getElementById("message");
    textArea.innerText = content;
    update_status(content);
}

function restore_emailAddress() {
    var hisEmail = localStorage["to_address"];
    if (hisEmail) {
        var textArea = document.getElementById("recipient");
        textArea.value = hisEmail;
    }

    hisEmail = localStorage["from_address"];
}


// delete message, and erase to/from email address
function cleanTable() {
    localStorage["current_content"] = "";
    var textArea = document.getElementById("message");
    textArea.innerText = "";

    localStorage["to_address"] = "";
    
    var hisEmail = document.getElementById("recipient");
    hisEmail.value = "";

    removeOldCiphertext();
}

/*
function createNewNode() {
    var newNode = document.createElement("div");
    var text = "Hello World -- Song";

    newNode.appendChild(document.createTextNode(text));
    return newNode;
}

function activeTo() {
    var currentNode = document.getElementById("address");
    currentNode.style.width = "554px";
}

function testing() {
    var currentNode = document.getElementById("message");
    var childNode = currentNode.childNodes[1];
    var newNode = createNewNode();
    currentNode.appendChild(newNode);
  
}
*/

/* Tool Bar */
function changeButton() {
    var currentNode = document.getElementById("button");
    currentNode.className += " TIjw";
    return;
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
var done = true;
// Cursor is in email address input after launch BME
$(document).ready(function (event) {
    $('.vO').focus(); // cursor is at email address area

    $(".btn").popover({

    });

    $("#button").click(function () {
        if(!done)
            $("#myModalMessage").modal('show');
        else
            $("#myOutputText").modal('show');
    });

    $("#Ebutton").tooltip({
        placement: 'top'
    });

    $("#Dbutton").tooltip({
        placement: 'top'
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
function ValidEmailAddress(encryptMsg) {
    // Check email address
    if (localStorage["login"] == "") {
        var warning = document.getElementById("messageBody");
        if(encryptMsg)
            warning.innerText = "We need your Email address to encrypt the message, please specify your Email address."
        else
            warning.innerText = "We need your Email address to decrypt the message, please specify your Email address."

        done = false;
        return false;
    }

    // check again, be sure that there is sender or recipient's email 
    if (encryptMsg) {
        save_RecipientAddress();
        if (localStorage["to_address"] == "") {
            var warning = document.getElementById("messageBody");
            warning.innerText = "Please specify the recipient's Email address.";
            done = false;
            return false;
        }
    } else {
        save_SenderAddress();
        if (localStorage["from_address"] == "") {
            var warning = document.getElementById("messageBody");
            warning.innerText = "Please specify the sender's Email address.";
            done = false;
            return false;
        }
    }

    return true;
}

function elementStyleDisplay(id, value) {
    var element = document.getElementById(id);
    element.style.display = value;
    return element;
}

function encryption() {
    
    var msg = localStorage["current_content"];

    // check emails
    if (!ValidEmailAddress(true))
        return;

    done = true;
    var cipher = base64_it(msg);

    removeOldCiphertext();
    if (cipher) {
        elementStyleDisplay("cipher", "");
        var cipherArea = document.getElementById("appendMessage");
        cipherArea.appendChild(packageMessage(cipher));

        var plainTextArea = elementStyleDisplay("plaintext", "none");

        elementStyleDisplay("Encryped_Text", "");
        elementStyleDisplay("Decrypted_Text", "none");
    }

    // After encryption, recipient's email address should be deleted, avoid mistakes
    var hisEmail = document.getElementById("recipient");
    hisEmail.value = "";
    localStorage["to_address"] = "";

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
    // check emails
    if (!ValidEmailAddress(false))
        return;
    done = true;
    var msg_list = document.getElementById("message").innerText.split('\n');

    if(msg_list.length<3)
        return;
    var cipher = msg_list[2];
    var plainText = decode(cipher);

    elementStyleDisplay("cipher", "none");
    
    elementStyleDisplay("plaintext");

    var plainTextArea = elementStyleDisplay("plaintext", "");
    plainTextArea.appendChild(packageMessage(plainText));
    
    elementStyleDisplay("Encryped_Text", "none");
    elementStyleDisplay("Decrypted_Text", "");
}
// DOMContent loading, check if there is a signed in email address in local storage/session storage
// And also check if there is a editing message in editing area
document.addEventListener('DOMContentLoaded', restore_options);

document.querySelector('#drop3').addEventListener('click', menuButton);
document.querySelector('#signIn').addEventListener('click', signIn);
document.querySelector('#signOut').addEventListener('click', signOut);
document.querySelector('#Ebutton').addEventListener('click', encryption);
document.querySelector('#Dbutton').addEventListener('click', decryption);
document.querySelector('#Trash').addEventListener('click', cleanTable);
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
document.querySelector('#sender').addEventListener('keyup', save_SenderAddress);
document.querySelector('#message').addEventListener('keyup', save_Msg);
