'use strict';

$('#login').submit(function (e) {
  e.preventDefault();
  // authentication token/id
  var email = $('#email').val();
  var password = $('#password').val();
  $.ajax ({
    method: 'POST',
    data: { email: email, password: password },
    url: 'https://localhost:3000/login/ext',
    dataType: 'json'
  }).done(function(id) {
    chrome.storage.sync.set({ 'user_id': id });
  });
});

// chrome.storage.get(function(value) {
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, { 'user_id': value['user_id'] }, function(response) {
//       console.log(response);
//     });
//   });
// });

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) { 
  chrome.storage.sync.get(function(value) {
    $.ajax({
      method: 'POST',
      data: { user_id: value['user_id'], url: req.url, width: req.width, height: req.height },
      url: 'https://localhost:3000/addedphotos',
      dataType: 'json'
    }).done(function(res) {
      // why no work?
      return sendResponse({ res: res });
      // sendResponse({ res: res });
    });
  }); 
});
