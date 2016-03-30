'use strict';

$(function(){
    
    // Add button animation
    function addZeButton($imgDiv) {
        $imgDiv.prepend($('<div>', { class: 'flip' }));
        var $cardContainer = $imgDiv.children('.flip');
        $cardContainer.append($('<div>', { class: 'card' }));
        $cardContainer.children('.card').append($('<div>', { class: 'face front' }));
        $cardContainer.children('.card').append($('<div>', { class: 'face back' }));
    }

    // Parses the style tag in Flickr's embedded html
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
    function underscoresInPath(imagePath) {
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
            $(this).remove();
            callback(output);
        });
    }

    function parseImg(imgObj) {
        chrome.runtime.sendMessage({ url: imgObj.url, width: imgObj.width, height: imgObj.height });
    }

    // Body selector case for images wrapped in 'a' tags
    $('body').on('mouseenter', '.overlay', function() {
        var $imgDiv = $(this).closest('.photo-list-photo-interaction');
        if ($imgDiv.find('.flip').length !== 0) {
            return;
        } else {
            addZeButton($imgDiv);
        }
        $(".flip").hover(function(){
          if ($(this).data('clicked')) {
            return;
          } else {
              $imgDiv.find(".card").toggleClass("flipped");
              return false;  
          }
        });

        $imgDiv.find('.flip').one('click', function() {
            var flipDiv = $(this);
            var zeButtonFront = flipDiv.find('.face .front');
            var zeButtonBack = flipDiv.find('.back');
            var zeElem = $imgDiv.closest('.photo-list-photo-view');
            var styleAttrib = zeElem.attr('style');
            var imagePath = (createPhotoUrl(styleAttrib).replace(/"/g, ""));

            flipDiv.attr('data-clicked', 'true');

            //If image path has more than one _, then take out the last _ and replace
            if (underscoresInPath(imagePath)) {
                imagePath = imagePath.replace(/\.jpg/g, "");
            } else {
                imagePath = imagePath.replace(/(_[a-z])(\.jpg+)$/g, "");
            }

            chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
                if (req) {
                    zeButtonFront.css({'background-image': 'url("chrome-extension://dmeifbfaplnedddldbeflojbbeeeejlm/images/check-32.png")'});
                    zeButtonBack.css({'background-image': 'url("chrome-extension://dmeifbfaplnedddldbeflojbbeeeejlm/images/check-32.png")'});
                }
            });

            getNativeDimensions(imagePath, parseImg);

        });
    });

});