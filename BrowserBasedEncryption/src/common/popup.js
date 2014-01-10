/**
 * Created with IntelliJ IDEA.
 * User: SongYz
 * Date: 10/10/13
 * Time: 9:40 PM
 * To change this template use File | Settings | File Templates.
 */



// Save this script as `options.js`

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

    while (i < utftext.length) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if ((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

/*
$(document).ready(function () {
    $('.btn').on('click', function () {
        $('#myModal').modal('show');
    });

    $('.dropdown-toggle').click(function () {
        $('.dropdown-toggle').dropdown();

    });

});
*/
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
    var currentNode = document.getElementById("Div5");
    var childNode = currentNode.childNodes[1];
    var newNode = createNewNode();
    currentNode.appendChild(newNode);
    //currentNode.replaceChild(newNode, childNode);


}

function changeButton() {
    var currentNode = document.getElementById("button");
    currentNode.className += " TIjw";
    return;
}

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

$(document).ready(function (event) {
    $('.vO').focus();

});

//var button = document.getElementById("button");
//button.onmousedown = changeButton();

//document.onload = testing;
document.addEventListener('DOMContentLoaded', restore_options);

document.querySelector('#button').addEventListener('click', testing);

//ocument.querySelector('#to').addEventListener('click', activeTo);

document.querySelector('#button').addEventListener('mouseover', mouseOverButton, false);
document.querySelector('#button').addEventListener('mouseout', mouseOutButton, false);

document.querySelector('#Format').addEventListener('mouseover', mouseOverFormat, false);
document.querySelector('#Format').addEventListener('mouseout', mouseOutFormat, false);


//document.querySelector('#base64').addEventListener('click', base64_it);
//document.querySelector('#decrypt').addEventListener('click', Decrypt_it);
//document.querySelector('#clearUp').addEventListener('click', clear_up);
//document.querySelector('#clearDown').addEventListener('click', clear_down);
//document.querySelector('#input').addEventListener('keyup', save_options);
//document.querySelector('#demo').addEventListener('keyup', save_cipher_options);

/*
 <div id="navbar-example" class="navbar navbar-static">
        <div class="navbar-inner">
        <div class="container" style="width: auto;">
            <div class="aCk">
                <div class="Hp">New Message</div>
            </div>
            <!--a class="brand" href="#">Project Name</!--a -->
            
            <ul class="nav pull-left">
            <li id="fat-menu" class="dropdown">
                <a href="#" id="drop3" role="button" class="dropdown-toggle" title="Is it your Email Address data-toggle="dropdown">
                    <div class="song">
                    yuanzheng_song@gmail.com
                    </div>
                    <b class="caret"></b>
                </a>
                <ul class="dropdown-menu" role="menu" aria-labelledby="drop3">
                <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Action</a></li>
                <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Another action</a></li>
                <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Something else here</a></li>
                <li role="presentation" class="divider"></li>
                <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Separated link</a></li>
                </ul>
            </li>
            </ul>
        </div>
        </div>
    </div> <!-- /navbar-example -->
    */
