  var google = new OAuth2('google', {
  
	client_id: '912419394300-dqhk9iasgqplvqavggrn47ar3t86djor.apps.googleusercontent.com',
    client_secret: 'Cu0NFXBn68KvxrWMPe23ZzT_',
    api_scope: 'https://www.googleapis.com/auth/userinfo.email'
  });
/*
  var facebook = new OAuth2('facebook', {
    client_id: '177955888930840',
    client_secret: 'b42a5741bd3d6de6ac591c7b0e279c9f',
    api_scope: 'read_stream,user_likes'
  });

  var github = new OAuth2('github', {
    client_id: '09450dfdc3ae76768b08',
    client_secret: '8ecfc23e0dba1ce1a295fbabc01fa71db4b80261',
  });
*/
  function authorize(providerName) {
    var provider = window[providerName];
    provider.authorize(checkAuthorized);
  }

  function clearAuthorized() {
    console.log('clear');
    ['google'].forEach(function(providerName) {
      var provider = window[providerName];
      provider.clearAccessToken();
    });
    checkAuthorized();
  }

  function checkAuthorized() {
    console.log('checkAuthorized');
    ['google'].forEach(function(providerName) {
      var provider = window[providerName];
      //var button = document.querySelector('#' + providerName);
      if (provider.hasAccessToken()) {
        //button.classList.add('authorized');
		var loginInfo = document.getElementById("login_button");
		loginInfo.setAttribute("data-toggle", "dropdown");

		getUserInfo();
		reset_login();

      } else {
        //button.classList.remove('authorized');
        clear_login();
      }
    });

  }
  
function xhrWithAuth(method, url, interactive, callback) {
    var access_token;

    var retry = true;

    getToken();

    function getToken() {
        
        var provider = window['google'];
        access_token = provider.getAccessToken();
        requestStart();
     
    }

    function requestStart() {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        xhr.onload = requestComplete;
        xhr.send();
    }

    function requestComplete() {
        if (this.status == 401 && retry) {
            retry = false;
            chrome.identity.removeCachedAuthToken({ token: access_token },
                                                  getToken);
        } else {
            callback(null, this.status, this.response);
        }
    }
}

function getUserInfo() {
    if (!localStorage["userInfo"]) {
        xhrWithAuth('GET',
                'https://www.googleapis.com/plus/v1/people/me',
                true,
                onUserInfoFetched);
    }
    else {
        setUserInfo();
    }
     
}



// Code updating the user interface, when the user information has been
// fetched or displaying the error.
function onUserInfoFetched(error, status, response) {
    if (!error && status == 200) {
        
        var user_info = JSON.parse(response);
        populateUserInfo(user_info);
    } else {
        authorize('google'); // if cannot get user info, then resignin again
    }
}

function populateUserInfo(resp) {

    var user_email = resp.emails[0].value;

    var userInfo = {
        'name': resp.displayName,
        'email': user_email,
        'image': resp.image.url
    }

    localStorage["userInfo"] = JSON.stringify(userInfo);

    setUserInfo();
}

function setUserInfo() {
    var user_info = JSON.parse(localStorage["userInfo"]);

    var login = document.getElementById("login");
    //login.style.width = "183px";
    login.innerText = user_info.email;
    /*
    var prefix = document.getElementById("prefix");
    var email_parts = (user_info.email).split('@');
    prefix.innerText = email_parts[1];
    */
    var image_node = document.getElementById('profile_image');
    var image = document.createElement('img');
    if(user_info.image != "")
        image.src = user_info.image;
    else
        image.src = "icons/photo.jpg";
    image.alt = user_info.name;

    var child_image = image_node.getChildren();
    if (child_image.length != 0)
        image_node.removeChild(child_image[0]);
    document.getElementById('profile_image').appendChild(image);
    
    //in drop menu
    var my_email = document.getElementById("email_id");
    my_email.innerText = user_info.email;

    var name = document.getElementById("NameId");
    name.innerText = user_info.name;
}
  
 

  