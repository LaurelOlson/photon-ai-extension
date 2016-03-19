'use strict';

// restrict image size
const MAX_WIDTH = 100;
const MAX_HEIGHT = 100;

var outerDiv = $('<div>').addClass('outer');
var hoverDiv = $('<div>').addClass('hover-div');
var addPhotoButton = $('<input>').addClass('addPhotoButton').attr({type: 'button', value: 'add photo'}).appendTo(hoverDiv)

$(window).on('load', function() {
  // for general img tags
  // img tag needs to be wrapped in outer div before appending for some reason..
  var images = $('img');
  var mainImages = images.filter(function(i, image) { return (image.clientWidth > MAX_WIDTH && image.clientHeight > MAX_HEIGHT) });
  mainImages.wrap(outerDiv);
  $('.outer').append(hoverDiv);

  // for flickr (appends hoverDiv to <span>)
  var flickr_photos = $('.thin-facade');
  flickr_photos.append(hoverDiv);

  // for 500px (appends hoverDiv to <a>)
  var img_links = $('.photo');
  img_links.append(hoverDiv);

});
