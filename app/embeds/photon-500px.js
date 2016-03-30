$(function() {

  const logoWidth = 32;
  const horizontalDistanceFromWindow = 11;
  const verticalDistanceFromWindow = 2;

  // function addZeButton($imgLink) {
  //   var newButton = $imgLink.prepend($('<div>', {class: 'custom-icon-button'})); 
  // }

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

  function cleanUpStyle(styleAttrib) {
      var parts = styleAttrib.split("; ");
      var obj = {};
      for (var i = 0; i < parts.length; i++) {
        var subParts = parts[i].split(': ');
        obj[subParts[0]]=subParts[1];
      }
      return obj;
  }

  function createPhotoUrl(styleAttrib) {
    console.log(styleAttrib);
      var cleanStyle = cleanUpStyle(styleAttrib);
      var photoUrl = cleanStyle['background-image'];
      var linkLinter = /\(([^\)]+)\)/;
      var theLink = ((photoUrl.match(linkLinter)[1]));
      return theLink;
  }

  function parseImg(imgObj) {
      chrome.runtime.sendMessage({ url: imgObj.url, width: imgObj.width, height: imgObj.height });
  }

  function addZeButton($imgLink) {
    $imgLink.prepend($('<div>', { class: 'flip' }));
    var $cardContainer = $imgLink.children('.flip');
    $cardContainer.append($('<div>', { class: 'card' }));
    $cardContainer.children('.card').append($('<div>', { class: 'face front' }));
    $cardContainer.children('.card').append($('<div>', { class: 'face back' }));
  }


  // Home page stuff
  $('body').on('mouseenter', '.link', function() {

    var $imgLink = $(this).closest('.lazy-hidden');
    if ($imgLink.find('.flip').length === 0) {
      addZeButton($imgLink);
      $imgLink.find('.custom-icon-button').css({
        'top': '-10px',
        'right': ($(this).width() - logoWidth - horizontalDistanceFromWindow) + 'px'
      });
    } else {
      $imgLink.children('.flip').children('div').show();
    }

    $(".flip").hover(function(){
      if ($(this).data('clicked')) {
        return;
      } else {
          $(this).find(".card").addClass("flipped");
          return false;  
      }
    }, function() {
      if ($(this).data('clicked')) {
        return;
      } else {
          $(this).find(".card").removeClass("flipped");
          return false;  
      }
    });

    $imgLink.find('.flip').one('click', function() {
        var flipDiv = $(this);
        var zeButtonFront = flipDiv.find('.face .front');
        var zeButtonBack = flipDiv.find('.back');
        var zeElem = flipDiv.closest('.lazy-hidden');
        var styleAttrib = zeElem.attr('style');
        var imagePath = (createPhotoUrl(styleAttrib)).replace(/"/g, "");

        flipDiv.attr('data-clicked', 'true');

        chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
            if (req) {
                zeButtonFront.css({'background-image': 'url("chrome-extension://dmeifbfaplnedddldbeflojbbeeeejlm/images/check-32.png")'});
                zeButtonBack.css({'background-image': 'url("chrome-extension://dmeifbfaplnedddldbeflojbbeeeejlm/images/check-32.png")'});
            }
        });

        getNativeDimensions(imagePath, parseImg);

    });

  });

  $('body').on('mouseleave', '.photo.lazy-hidden', function() {
    $(this).children('.flip').children('div').hide();
  });

  //Discover page stuff

  $('body').on('mouseenter', '.photo_link', function () {
    var $imgLink = $(this).siblings('.photo_thumbnail__pulse_container');
    if ($imgLink.find('.flip').length === 0) {
      addZeButton($imgLink);
      $imgLink.find('.custom-icon-button').css({
        'top': '-10px',
        'right': ($(this).width() - logoWidth - horizontalDistanceFromWindow) + 'px'
      });
    } else {
      $imgLink.children('.flip').children('div').show();
    }

    $(".flip").hover(function(){
      if ($(this).data('clicked')) {
        return;
      } else {
          $(this).find(".card").addClass("flipped");
          return false;  
      }
    }, function() {
      if ($(this).data('clicked')) {
        return;
      } else {
          $(this).find(".card").removeClass("flipped");
          return false;  
      }
    });

    $imgLink.find('.flip').one('click', function() {
        var flipDiv = $(this);
        var zeButtonFront = flipDiv.find('.face .front');
        var zeButtonBack = flipDiv.find('.back');
        var zeElem = $imgLink.siblings('.photo_link').children('img');
        var imagePath = (zeElem.attr('src')).replace(/"/g, "");

        flipDiv.attr('data-clicked', 'true');

        chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
            if (req) {
                zeButtonFront.css({'background-image': 'url("chrome-extension://dmeifbfaplnedddldbeflojbbeeeejlm/images/check-32.png")'});
                zeButtonBack.css({'background-image': 'url("chrome-extension://dmeifbfaplnedddldbeflojbbeeeejlm/images/check-32.png")'});
            }
        });

        getNativeDimensions(imagePath, parseImg);

    });
  });

  // Still need to handle grabbing imgs from individual profile gallery

    // $('body').on('mouseenter', '.photo_link', function() {
  //   var $imgLink = $(this).siblings('.photo_thumbnail__pulse_container');
  //   if ($imgLink.find('.custom-icon-button').length != 0) {
  //       return;
  //   } else {
  //       addZeButton($imgLink);
  //   }

  //   $imgLink.children('.custom-icon-button').one('click', function() {
  //     // No idea why but couldn't traverse DOM the regular way...
  //     var imgUrl = $imgLink.closest('.photo_link').context.firstElementChild.currentSrc;
  //     console.log(imgUrl); 
  //   });
    
  // });


});
