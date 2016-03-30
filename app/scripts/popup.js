'use strict';

$(function() {

  var loggedInCSS = {
        'display' : 'flex',
        'height': '300px',
        'width': '200px',
  };

  // Check if user is already signed in. Display the appropriate page
  chrome.storage.sync.get(function(value) {
    if (value['user_id']) {
      $('#loginform').hide();
      $('#loggedInContainer').show();
    }
    else {
      $('#loginform').show();
      $('#loggedInContainer').hide();
    }
  });

  // Login
  $('#clickme').click(function (e) {
  
    e.preventDefault();

    // Construct facebook OAuth url
    var redirectUrl = chrome.identity.getRedirectURL();
    var clientId = "211877392505171";
    var authUrl = "https://www.facebook.com/dialog/oauth?" +
      "client_id=" + clientId + "&" +
      "redirect_uri=" + encodeURIComponent(redirectUrl) + "&" + "scope=" + "public_profile";

    console.log(authUrl);

    // Launch OAuth using Chrome Identity API
    chrome.identity.launchWebAuthFlow({url: authUrl, interactive: true}, function(responseUrl) {
      console.log(responseUrl);
      var accessToken = responseUrl.substring(responseUrl.indexOf("=") + 1);
      console.log(accessToken);
      $.ajax ({
        method: 'POST',
        data: { token: accessToken },
        url: 'https://localhost:3000/login/ext',
        dataType: 'json'
      }).done(function(id) {
        chrome.storage.sync.set({ 'user_id': id });
        
        chrome.storage.sync.get('user_id', function(value) {
          if (value['user_id']) {
            $('#loginform').hide();
            $('#loggedInContainer').show();
            chrome.runtime.reload();
          }
          else {
            return;
          }
        });
      });
    });
  });

  // Log out
  $('#logmeout').click(function (e) {
    
    e.preventDefault();
    chrome.storage.sync.clear();
    chrome.runtime.reload();
    $('#loginform').show();
    $('#loggedInContainer').hide();
  });

  // Sends photo url & image specs to current user's db table
  chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) { 
    chrome.storage.sync.get(function(value) {
      $.ajax({
        method: 'POST',
        data: { user_id: value['user_id'], url: req.url, width: req.width, height: req.height },
        url: 'https://localhost:3000/addedphotos',
        dataType: 'json'
      }).done(function(res) {

        // Lets content scripts know that photo was saved so that it can update add-photo-button state
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { 'res': res });
        });
      });
    }); 
  });

});


