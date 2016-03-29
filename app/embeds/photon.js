$(function() {

    // Restrict image size
    const MAX_WIDTH = 100;
    const MAX_HEIGHT = 100;

    var images = $('img');

    // Adding a container div to make it easier to locate in the DOM
    var outerDiv = $('<div>').addClass('outer');

    var hoverDiv = $('<div>').addClass('hover-div');
    var addPhotoButton = $('<div>', {class: 'card'}).attr({type: 'button', value: 'add photo'});

    addPhotoButton.appendTo(hoverDiv);

    // Only applies to images that are a certain size aka not thumb-nails
    var mainImages = images.filter(function(i, image) { return (image.clientWidth > MAX_WIDTH && image.clientHeight > MAX_HEIGHT); });
    mainImages.wrap(outerDiv);
    $('.outer').append(hoverDiv);
         
    $('.hover-div').one('click', '.card', function(evt) {
        // Best shits
    });

});