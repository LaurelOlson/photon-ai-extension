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

    //Body selector case for images wrapped in 'a' tags
    $('body').on('mouseenter', '.overlay', function() {
        var $imgDiv = $(this).closest('.photo-list-photo-interaction');
        if ($imgDiv.find('.photon-button').length != 0) {
            return;
        } else {
            addZeButton($imgDiv);
        }
    });

    // $('body').on('mouseleave', '.overlay', function() {
    //     $(".photon-button").remove();
    // });

    //Img selector case for images actually stored in img tags

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