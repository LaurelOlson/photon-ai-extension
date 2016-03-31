'use strict';

$(function() {

    function checkICanHazHttps(imagePath) {
      if (imagePath.match(/https/g) || imagePath.match(/http/g)) {
        return imagePath;
      }
      else {
        imagePath = 'https' + imagePath;
        return imagePath;
      }
    }

    function getNativeDimensions(imagePath, callback) {
        var completePath = checkICanHazHttps(imagePath);
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
            $(this).children('.card-img').addClass("flipped");
            handleClick($imgDiv, $zeImg);
            return false;  
        }
      }, function() {
        if ($(this).data('clicked')) {
          return;
        } else {
            $(this).children('.card-img').removeClass("flipped");
            handleClick($imgDiv, $zeImg);
            return false;  
        } 
      });
    });

    $('body').on('mouseleave', '.outer', function() {
        $(this).children('div').hide();
    });

  function handleClick($imgDiv, $zeImg) {

    $imgDiv.find('.face').one('click', function(e) {
      e.preventDefault();
      var flipDiv = $(this).closest('.flip-img');
      var zeButtonFront = $(this).closest('.front');
      var zeButtonBack = $(this).closest('.back');
      var imagePath = $zeImg.attr('src');

      flipDiv.attr('data-clicked', 'true');

      chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
          if (req) {
              zeButtonFront.css({'background-image': 'url("chrome-extension://hijnoccjmdgleaafippfiocophahkhkl/images/check-38.png")'});
              zeButtonBack.css({'background-image': 'url("chrome-extension://hijnoccjmdgleaafippfiocophahkhkl/images/check-38.png")'});
          }
      });

      getNativeDimensions(imagePath, parseImg);
    });
  }
});
