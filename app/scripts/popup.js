'use strict';


$('#clickme').on('click', function () {
  $.ajax ({
    type: 'GET',
    url: 'SomeroutethatLaurelwillmake',
    dataType: 'json',
    
  })
});