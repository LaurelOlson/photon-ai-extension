'use strict';

// $(window).on('load', function() {
  $(function() { 
    // restrict image size
    const MAX_WIDTH = 100;
    const MAX_HEIGHT = 100;

    var outerDiv = $('<div>').addClass('outer');
    var hoverDiv = $('<div>').addClass('hover-div');
    var addPhotoButton = $('<input>')
        .addClass('addPhotoButton')
        .attr({type: 'button', value: 'add photo'})
        .appendTo(hoverDiv);
    
    // for general img tags
    // img tag needs to be wrapped in outer div before appending for some reason..
    var images = $('img');
    var mainImages = images.filter(function(index, image) { 
        return (image.clientWidth > MAX_WIDTH && image.clientHeight > MAX_HEIGHT) 
    });
    mainImages.wrap(outerDiv);
    $('.outer').append(hoverDiv);

    // var imageLinks = $('.photo-list-photo-view');
    var imageLinks = $('.interaction-view');
    // imageLinks.append(hoverDiv);
    imageLinks.mouseenter(function() {
        $(this).append(hoverDiv);
    });

    imageLinks.mouseleave(function() {
        $(this).find(hoverDiv).remove();
    });

    // for flickr (appends hoverDiv to <span>)
    var flickr_photos = $('.thin-facade');
    flickr_photos.append(hoverDiv);
  // });
}());