/**
 * Created with IntelliJ IDEA.
 * User: SongYz
 * Date: 10/10/13
 * Time: 9:40 PM
 * To change this template use File | Settings | File Templates.
 */

// Save this script as `options.js`
$(function() {
	$( "#datepicker" ).datepicker();
});

$(document).ready(function()
{
	$(".account").click(function()
{
var X=$(this).attr('id');

if(X==1)
{
	$(".submenu").hide();
	$(this).attr('id', '0');	
}
else
{
	$(".submenu").show();
	$(this).attr('id', '1');
}
	
});

//Mouseup textarea false
$(".submenu").mouseup(function()
{
	return false
});
$(".account").mouseup(function()
{
	return false
});


//Textarea without editing.
$(document).mouseup(function()
{
	$(".submenu").hide();
	$(".account").attr('id', '');
});
	
});
	
// Saves current content into localStorage.
function save_options() {
    var content = document.getElementById("input").value;

    localStorage["current_content"] = content;

    // Update status to let user know options were saved.
    //var status = document.getElementById("status");
    /*
     status.innerHTML = "Content Saved.";
     setTimeout(function () {
     status.innerHTML = "";
     }, 750);
     */
}
//content will be saved automaticly
function save_cipher_options() {
    var content = document.getElementById("demo").value;

    localStorage["current_encryption"] = content;

}


// Restores select box state to saved value from localStorage.
function restore_options() {

    var content = localStorage["current_content"];
    if (content) {
        var textArea = document.getElementById("input");
        textArea.innerHTML = content;
    }

    var cipher = localStorage["current_encryption"];
    if (cipher) {
        var cipherArea = document.getElementById("demo");
        cipherArea.innerHTML = cipher;
    }

}

function clear_up() {
    localStorage["current_content"] = "";
    var textArea = document.getElementById("input");
    textArea.innerHTML = "";
    textArea.value = "";
}

function clear_down() {
    localStorage["current_encryption"] = "";
    var textArea = document.getElementById("demo");
    textArea.innerHTML = "";
    textArea.value = "";
}

function base64_it() {
    var textArea = document.getElementById("demo");
    textArea.innerHTML = "";
    textArea.value = "";

    var content = localStorage["current_content"];
    if (!content) {
        return;
    }

    localStorage["current_encryption"] = encode(content);
    textArea.innerHTML = localStorage["current_encryption"];
    textArea.value = localStorage["current_encryption"];
}
var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function encode(input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    //var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    input = _utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);

    }

    return output;
}

function Decrypt_it() {
    var textArea = document.getElementById("input");
    localStorage["current_content"] = "";
    textArea.innerHTML = "";
    textArea.value = "";

    var cipher = localStorage["current_encryption"];
    if (!cipher) {
        return;
    }

    localStorage["current_content"] = decode(cipher);
    textArea.innerHTML = localStorage["current_content"];
    textArea.value = localStorage["current_content"];
}


function decode(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = _utf8_decode(output);

    return output;

}

// private method for UTF-8 encoding
function _utf8_encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
}

function _utf8_decode(utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}


// TODO optimize it to support all browsers

var helpArray = ["Enter your message in this textbox",
                  "Click this button to encrypt your message above based on Bas64",
                  "Click this button to decrypt your ciphertext below",
                  "Clear the message above",
                  "Clear the ciphertext below",
                  "Enter the Ciphertext in here",
                  ""];

function helpText(messageNum) {
    document.getElementById("help").innerHTML = helpArray[messageNum];
}


function startTimer() {
    // function updateTime() should be called every 1000 milliseconds
    window.setInterval("updateTime()", 10000);
}
var seconds = 0;
function updateTime() {
    ++seconds;
    document.getElementById("soFar").innerHTML = ""+seconds;
}

$(document).ready(function(){
    $(window).load(function(){
        restore_options();
    });

    $("#input").keyup(function() {
        save_options();
    });

    $("#demo").keyup(function() {
        save_cipher_options();
    });

    $("#base64").click(function() {
        base64_it();
    });

    $("#decrypt").click(function() {
        Decrypt_it();
    });

    $("#clearUp").click(function() {
        clear_up();
    });

    $("#clearDown").click(function() {
        clear_down();
    });
});
