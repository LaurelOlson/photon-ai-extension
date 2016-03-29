'use strict';

// $('#login').submit(function (e) {
//   e.preventDefault();
//   // authentication token/id
//   var email = $('#email').val();
//   var password = $('#password').val();
//   $.ajax ({
//     method: 'POST',
//     data: { email: email, password: password },
//     url: 'https://localhost:3000/login/ext',
//     dataType: 'json'
//   }).done(function(id) {
//     chrome.storage.sync.set({ 'user_id': id });
//   });
// });

// chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) { 
//   chrome.storage.sync.get(function(value) {
//     $.ajax({
//       method: 'POST',
//       data: { user_id: value['user_id'], url: req.url, width: req.width, height: req.height },
//       url: 'https://localhost:3000/addedphotos',
//       dataType: 'json'
//     }).done(function(res) {
//       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, { 'res': res });
//       });
//     });
//   }); 
// });

$('#login').submit(function (e) {
  e.preventDefault();

  var redirectUrl = chrome.identity.getRedirectURL()
  console.log(redirectUrl);
  var clientId = "211877392505171";
  var authUrl = "https://www.facebook.com/dialog/oauth?" +
    "client_id=" + clientId + "&" +
    "redirect_uri=" + encodeURIComponent(redirectUrl);

  chrome.identity.launchWebAuthFlow({url: authUrl, interactive: true}, function(responseUrl) {

    console.log(responseUrl);
    var accessToken = responseUrl.substring(responseUrl.indexOf("=") + 1);
    console.log(accessToken);
  });

});
