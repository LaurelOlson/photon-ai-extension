'use strict';

$(function() {

    // Determines if last underscore in url before .jpg is part of path or just an image size modifier
    function underscoreIsPath(imagePath) {
       var underScoreFragment = imagePath.substring(imagePath.lastIndexOf("_") + 1, imagePath.lastIndexOf("."));
        // Flickr uses convention _ +  a letter to resize images via url
        return underScoreFragment.length > 1;
    }

    function getNativeDimensions(imagePath, callback) {
        var completePath = imagePath + '_b.jpg';
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
        console.log('sending message');
        chrome.runtime.sendMessage({ url: imgObj.url, width: imgObj.width, height: imgObj.height });
    }

    const MIN_WIDTH = 100;
    const MIN_HEIGHT = 100;

    $('body').on('mouseenter', 'img', function() {
        var $zeImg = $(this);
        var outerDiv = $('<div>').addClass('outer');
        if (($zeImg[0].width > MIN_WIDTH && $zeImg[0].height > MIN_HEIGHT) && ($zeImg.closest('.outer').length === 0)) {
            $(this).wrap(outerDiv);
        }
        var $imgDiv = $(this).closest('.outer');
        if ($imgDiv.children('.flip-img').length === 0) {
            $imgDiv.prepend($('<div>', { class: 'flip-img' }));
            var $cardContainer = $imgDiv.children('.flip-img');
            $cardContainer.append($('<div>', { class: 'card-img' }));
            $cardContainer.children('.card-img').append($('<div>', { class: 'face front' }));
            $cardContainer.children('.card-img').append($('<div>', { class: 'face back' }));
        } else {
            $imgDiv.children('div').show();
        }
        $(".flip-img").hover(function(){
          if ($(this).data('clicked')) {
            return;
          } else {
              $(this).children(".card-img").toggleClass("flipped");
              $imgDiv.find('.face').one('click', function(e) {
                  
                  e.preventDefault();
                  var flipDiv = $(this).closest('.flip-img');
                  var zeButtonFront = $(this).closest('.front');
                  var zeButtonBack = $(this).closest('.back');
                  var imagePath = $zeImg.attr('src');

                  flipDiv.attr('data-clicked', 'true');

                  //If image path has more than one _, then this link.replace(/_.$/g, ""))
                  if (underscoreIsPath(imagePath)) {
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
              return false;
          }
        });

    });

    $('body').on('mouseleave', '.outer', function() {
        $(this).children('div').hide();
    });

});