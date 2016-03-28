'use strict';

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

document.getElementById('clickme').addEventListener('click', function() {
  chrome.tabs.executeScript({
    file: 'login.js'
  });
});