$(function() {

  const logoWidth = 32;
  const horizontalDistanceFromWindow = 11;
  const verticalDistanceFromWindow = 2;

  // function addZeButton($imgLink) {
  //   var newButton = $imgLink.prepend($('<div>', {class: 'custom-icon-button'})); 
  // }

  function addZeButton($imgLink) {
    $imgLink.prepend($('<div>', { class: 'flip' }));
    var $cardContainer = $imgLink.children('.flip');
    $cardContainer.append($('<div>', { class: 'card' }));
    $cardContainer.children('.card').append($('<div>', { class: 'face front' }));
    $cardContainer.children('.card').append($('<div>', { class: 'face back' }));
  }


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


  $('body').on('mouseenter', '.link', function() {

    var $imgLink = $(this).closest('.photo.lazy-hidden');
    if ($imgLink.find('.flip').length === 0) {
      addZeButton($imgLink);
      $imgLink.find('.custom-icon-button').css({
        'top': '-10px',
        'right': ($(this).width() - logoWidth - horizontalDistanceFromWindow) + 'px'
      });
    } else {
      $imgLink.children('.flip').children('div').show();
    }

  });

  $('body').on('mouseleave', '.photo.lazy-hidden', function() {
    $(this).children('.flip').children('div').hide();
  })

  // $('body').on('mouseenter', '.photo_link', function () {
  //   var $imgLink = $(this).siblings ('.info');
  //   if ($imgLink.find('.custom-icon-button').length != 0) {
  //     return;
  //   }
  //   else {
  //     addZeButton($imgLink);
  //     $imgLink.find('.custom-icon-button').css({
  //       'bottom': ($(this).height() - logoWidth + verticalDistanceFromWindow) + 'px'
  //     });
  //   }
  // });


});
