$(function() {

  function addZeButton($imgLink) {
    $imgLink.prepend($('<button>', {class: 'photon-button'}).text('photon').css({
        'position': 'absolute',
        'top': '3px',
        'left': '3px',
        'z-index': '52'
        })
    ); 
  }

  $('body').on('mouseenter', '.photo_link', function() {
    var $imgLink = $(this).siblings('.photo_thumbnail__pulse_container');
    if ($imgLink.find('.photon-button').length != 0) {
        return;
    } else {
        addZeButton($imgLink);
    }
    $imgLink.children('.photon-button').one('click', function() {

      // No idea why but couldn't traverse DOM the regular way...
      var imgUrl = $imgLink.closest('.photo_link').context.firstElementChild.currentSrc;
      console.log(imgUrl);

    });
    
  });
});

