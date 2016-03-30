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

  // Facebook Login
  $('#clickme').click(function (e) {
  
    e.preventDefault();

    // Construct facebook OAuth url
    var redirectUrl = chrome.identity.getRedirectURL();
    var clientId = "211877392505171";
    var authUrl = "https://www.facebook.com/v2.5/dialog/oauth?" +
      "client_id=" + clientId + "&" +
      "redirect_uri=" + (redirectUrl);

    // Launch OAuth using Chrome Identity API
    chrome.identity.launchWebAuthFlow({url: authUrl, interactive: true}, function(responseUrl) {
      var accessToken = responseUrl.substring(responseUrl.indexOf("=") + 1);
      $.ajax ({
        method: 'POST',
        data: { token: accessToken },
        url: 'https://localhost:3000/login/ext/facebook',
        dataType: 'json'
      }).done(function(id) {
        chrome.storage.sync.set({ 'user_id': id });
        
        chrome.storage.sync.get('user_id', function(value) {
          if (value['user_id']) {
            $('#loginform').hide();
            $('#loggedInContainer').show();
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
    console.log(req.url);
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

  $('#checkusout').click(function (e) {
    e.preventDefault();
    chrome.tabs.create({url: 'https://localhost:3000'});
  });

});

  // Local Login

$('#login').submit(function (e) {
  e.preventDefault();
  console.log('hello world');
  var email = $('#email').val();
  var password = $('#password').val();
  $.ajax ({
    method: 'POST',
    data: { email: email, password: password },
    url: 'https://localhost:3000/login/ext',
    dataType: 'json'
  }).done(function(id) {
    chrome.storage.sync.set({ 'user_id': id });
    chrome.storage.sync.get('user_id', function(value) {
      if (value['user_id']) {
        $('#loginform').hide();
        $('#loggedInContainer').show();
      }
      else {
        return;
      }
    });
  });

});

