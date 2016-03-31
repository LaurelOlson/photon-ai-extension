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
    console.log(value['numLikedPhotos']);
    $('h1').text(value['numLikedPhotos']) || $('h1').text(0);
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
        chrome.storage.sync.set({ 'user_id': id, 'numLikedPhotos': 0 });

        // Refresh the page so content_script will add button
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.executeScript(tabs[0].id, { code: 'window.location.reload()' });
          chrome.runtime.reload();         
        });

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
    // Refresh the page so content_script will remove button
    
    chrome.storage.sync.clear();
    // chrome.runtime.reload();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(tabs[0].id, { code: 'window.location.reload()' }); 
      chrome.runtime.reload();       
    });

    $.ajax({
      method: 'GET',
      url: 'https://localhost:3000/logout',
      dataType: 'json'
    })

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

        // Increment num of photos saved
        chrome.storage.sync.get(function(value) {
          var numPhotosSaved = value['numLikedPhotos'];
          numPhotosSaved++;  
          chrome.storage.sync.set({'numLikedPhotos': numPhotosSaved});
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
  var email = $('#email').val();
  var password = $('#password').val();
  $.ajax ({
    method: 'POST',
    data: { email: email, password: password },
    url: 'https://localhost:3000/login/ext',
    dataType: 'json'
  }).done(function(id) {
    chrome.storage.sync.set({ 'user_id': id, 'numLikedPhotos': 0 });

    // Refresh the page so content_script will add button
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.executeScript(tabs[0].id, { code: 'window.location.reload()' });
      chrome.runtime.reload();               
    });

    chrome.storage.sync.get(function(value) {
      if (value['user_id']) {
        $('#loginform').hide();
        $('h1').text(value['numLikedPhotos']);
        $('#loggedInContainer').show();
      }
      else {
        return;
      }
    });
  });

});

