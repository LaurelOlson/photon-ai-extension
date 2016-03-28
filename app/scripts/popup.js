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
  }).done(function(user_id) {
    console.log(user_id);
  });
});