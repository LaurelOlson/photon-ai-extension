'use strict';

// chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) { 
//     console.log('got msg');
//     // var user_id = req.user_id;  
//     // return user_id;
// });


$(function(){
    
    function addZeButton($imgDiv) {
        $imgDiv.prepend($('<div>', {class: 'custom-icon-button'})
        ); 
    }

    function cleanUpStyle(styleAttrib) {
        var parts = styleAttrib.split("; ");
        var obj = {};
        for (var i = 0; i < parts.length; i++) {
          var subParts = parts[i].split(': ');
          obj[subParts[0]]=subParts[1];
        }
        return obj;
    }

    // Handles Flickr's weird way of embedding the img URL in the css code
    function createPhotoUrl(styleAttrib) {
        var cleanStyle = cleanUpStyle(styleAttrib);
        var photoUrl = cleanStyle['background-image'];
        var linkLinter = /\(([^\)]+)\)/;
        var theLink = ((photoUrl.match(linkLinter)[1]));
        return theLink;
    }

    // Determines if last underscore in url before .jpg is part of path or just an image size modifier
    function underscoreIsPath(imagePath) {
       var underScoreFragment = imagePath.substring(imagePath.lastIndexOf("_") + 1, imagePath.lastIndexOf("."));
        // Flickr uses convention _ +  a letter to resize images via url
        return underScoreFragment.length > 1;
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
        $img.addClass('make-invis');
        $('body').append($img);
        $img.on('load', function(){
            var $zeImg = $(this);
            output.width = $zeImg.width();
            output.height = $zeImg.height();
            // console.log(output);
            $(this).remove();
            callback(output);
        });
    }

    // Body selector case for images wrapped in 'a' tags
    $('body').on('mouseenter', '.overlay', function() {
        var $imgDiv = $(this).closest('.photo-list-photo-interaction');
        if ($imgDiv.find('.custom-icon-button').length != 0) {
            return;
        } else {
            addZeButton($imgDiv);
        }

        $imgDiv.find('.custom-icon-button').one('click', function() {
            var zeElem = $imgDiv.closest('.photo-list-photo-view');
            var styleAttrib = zeElem.attr('style');
            var imagePath = (createPhotoUrl(styleAttrib).replace(/"/g, ""));

            //If image path has more than one _, then this link.replace(/_.$/g, ""))
            if (underscoreIsPath(imagePath)) {
                imagePath = imagePath.replace(/\.jpg/g, "");
            } else {
                imagePath = imagePath.replace(/(_[a-z])(\.jpg+)$/g, "");
            }

            function parseImg(imgObj){
                // console.log(imgObj);
                // $.ajax({
                //   method: 'POST',
                //   data: { user_id: user_id, url: imgObj.url, width: imgObj.width, height: imgObj.height },
                //   url: 'https://localhost:3000/addedphotos',
                //   dataType: 'json'
                // }).done(function(res) {
                //     console.log(res);
                //   // why no work?
                //   // return sendResponse({ res: res });
                //   // sendResponse({ res: res });
                // });
                chrome.runtime.sendMessage({ url: imgObj.url, width: imgObj.width, height: imgObj.height }, function(response) {
                    console.log(response);
                });
            }

            getNativeDimensions(imagePath, parseImg);

        });
    });

    // This handles regular images on the website

    // Restrict image size
    const MAX_WIDTH = 100;
    const MAX_HEIGHT = 100;

    var images = $('img');

    // Adding a container div to make it easier to locate in the DOM
    var outerDiv = $('<div>').addClass('outer');

    var hoverDiv = $('<div>').addClass('hover-div');
    var addPhotoButton = $('<div>', {class: 'custom-icon-button'}).attr({type: 'button', value: 'add photo'});

    addPhotoButton.appendTo(hoverDiv);

    // Only applies to images that are a certain size aka not thumb-nails
    var mainImages = images.filter(function(i, image) { return (image.clientWidth > MAX_WIDTH && image.clientHeight > MAX_HEIGHT); });
    mainImages.wrap(outerDiv);
    $('.outer').append(hoverDiv);
         
    $('.hover-div').one('click', '.custom-icon-button', function(evt) {
        evt.preventDefault();
        var imageLink = $(this).closest('.outer').children('img').attr('src');
        imageLink = imageLink.replace(/"/g, "");

        if (underscoreIsPath(imageLink)) {
            imageLink = imageLink.replace(/\.jpg/g, "");
        } else {
            imageLink = imageLink.replace(/(_[a-z])(\.jpg+)$/g, "");
        }
        console.log(imageLink + '_b.jpg');
    });

});