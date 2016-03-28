'use strict';

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  // take the req info and send a post request to the web app
  sendResponse({ status: 'OMG IT WORKED' });
});

// chrome.runtime.onInstalled.addListener(function (details) {
//   console.log('previousVersion', details.previousVersion);
// });

// chrome.browserAction.setBadgeText({text: '\'Allo'});

// console.log('\'Allo \'Allo! Event Page for Browser Action');

// $('#clickme').on('click', function () {
//   alert("Hello world");
// });

// document.getElementById('clickme').addEventListener('click', function() {
//   chrome.tabs.executeScript({
//     file: 'login.js'
//   });
// });