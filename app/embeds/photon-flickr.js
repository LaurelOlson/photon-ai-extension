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

    function createPhotoUrl(styleAttrib) {
        var cleanStyle = cleanUpStyle(styleAttrib);
        var photoUrl = cleanStyle['background-image'];
        var linkLinter = /\(([^\)]+)\)/;
        var theLink = (((photoUrl.match(linkLinter)[1]).replace(/"/g, "")).replace(/.jpg/g, "").replace(/_.*/g, ""));
        return theLink + '_b.jpg';
    }

    //Body selector case for images wrapped in 'a' tags
    $('body').on('mouseenter', '.overlay', function() {
        var $imgDiv = $(this).closest('.photo-list-photo-interaction');
        if ($imgDiv.find('.photon-button').length != 0) {
            return;
        } else {
            addZeButton($imgDiv);
        }

        $imgDiv.find('.photon-button').one('click', function() {
            var styleAttrib = $imgDiv.closest('.photo-list-photo-view').attr('style');
            var imagePath = createPhotoUrl(styleAttrib);

            console.log('https:' + imagePath);
        })
    });

    var images = $('img');

    $('img').on('mouseenter', function() {
        var $imgDiv = $(this).closest('.photo_container');
        if (!$imgDiv) {
            console.log('test passed');
            addZeButton($imgDiv);
        }
    });

    $('img').on('mouseleave', function() {
        $("button:contains('photon')").remove();
    });

});