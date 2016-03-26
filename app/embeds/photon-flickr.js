'use strict';

$(function(){
    
    function addZeButton($imgDiv) {
        $imgDiv.prepend($('<button>', {class: 'photon-button'}).text('photon').css({
            'position': 'absolute',
            'top': '3px',
            'right': '3px',
            'z-index': '52'
            })
        ); 
    }

    function cleanUpStyle(styleAttrib) {
        var parts = styleAttrib.split("; ")
        var obj = {}
        for (var i = 0; i < parts.length; i++) {
          var subParts = parts[i].split(': ');
          obj[subParts[0]]=subParts[1];
        }
        return obj;
    }

    function getStyleOfImg($imgDiv) {
        var styleAttrib = $imgDiv.attr('style');
        var cleanStyle = cleanUpStyle(styleAttrib);
    }

    // Handles Flickr's weird way of embedding the img URL in the css code
    function createPhotoUrl(styleAttrib) {
        var cleanStyle = cleanUpStyle(styleAttrib);
        var photoUrl = cleanStyle['background-image'];
        var linkLinter = /\(([^\)]+)\)/;
        var theLink = ((photoUrl.match(linkLinter)[1]))
        return theLink
    }

    // Determines if last underscore in url before .jpg is part of path or just an image size modifier
    function checkIfUnderscoreIsPath(imagePath) {
       var underScoreFragment = imagePath.substring(imagePath.lastIndexOf("_") + 1, imagePath.lastIndexOf("."));

        // Flickr uses convention _ +  a letter to resize images via url
        if (underScoreFragment.length > 1) {
            return true;
        } else {
            return false;
        }
    }

    function getNativeDimensions(imagePath, callback) {
        var completePath = 'https:' + imagePath + '_b.jpg';
        var output = {
            url: completePath,
            width: 0,
            height: 0
        };
        var $img = $('<img>').attr({
            src: completePath,
            id: 'photonParseSizeTarget'
        });
        $img.css({
            'visibility': 'hidden',
            'position': 'fixed',
            'z-index': '-100'
        });
        $('body').append($img);
        $img.on('load', function(){
            var $zeImg = $(this);
            output.width = $zeImg.width();
            output.height = $zeImg.height();
            $(this).remove();
            callback(output);
        });
    }



    // Body selector case for images wrapped in 'a' tags
    $('body').on('mouseenter', '.overlay', function() {
        var $imgDiv = $(this).closest('.photo-list-photo-interaction');
        if ($imgDiv.find('.photon-button').length != 0) {
            return;
        } else {
            addZeButton($imgDiv);
        }

        $imgDiv.find('.photon-button').one('click', function() {
            var zeElem = $imgDiv.closest('.photo-list-photo-view');
            var styleAttrib = zeElem.attr('style');
            var imagePath = (createPhotoUrl(styleAttrib).replace(/"/g, ""));

            //If image path has more than one _, then this link.replace(/_.$/g, ""))
            if (checkIfUnderscoreIsPath(imagePath)) {
                imagePath = imagePath.replace(/\.jpg/g, "");
            } else {
                imagePath = imagePath.replace(/(_[a-z])(\.jpg+)$/g, "");
            }

            function parseImg(imgObj){
                console.log(imgObj);
            }

            getNativeDimensions(imagePath, parseImg);

            // $.ajax ({
            //     url: 'https://localhost:3000/user/1/addedphotos',
            //     method: 'POST',
            //     data: {url: imagePath}
            //     })
            //     .done(function(msg) {
            //         console.log('We did it!');
            //     });
        })
    });

    // This handles regular images on the website

    // Restrict image size
    const MAX_WIDTH = 100;
    const MAX_HEIGHT = 100;

    var images = $('img');

    // Adding a container div to make it easier to locate in the DOM
    var outerDiv = $('<div>').addClass('outer');

    var hoverDiv = $('<div>').addClass('hover-div');
    var addPhotoButton = $('<input>', {class: 'photon-button'}).attr({type: 'button', value: 'add photo'}).appendTo(hoverDiv);

    // Only applies to images that are a certain size aka not thumb-nails
    var mainImages = images.filter(function(i, image) { return (image.clientWidth > MAX_WIDTH && image.clientHeight > MAX_HEIGHT) });
    mainImages.wrap(outerDiv);
    $('.outer').append(hoverDiv);
         
    $('.hover-div').one('click', '.photon-button', function(evt) {
        evt.preventDefault();
        var imageLink = $(this).closest('.outer').children('img').attr('src');
        imageLink = imageLink.replace(/"/g, "");

        if (checkIfUnderscoreIsPath(imageLink)) {
            imageLink = imageLink.replace(/\.jpg/g, "");
        } else {
            imageLink = imageLink.replace(/(_[a-z])(\.jpg+)$/g, "");
        }
        console.log(imageLink + '_b.jpg');
    });

});