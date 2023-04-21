var contentBoxImage = function() {

  var contentBox = $('.content-box');

  $.each( contentBox, function ( i, e ) {

    var imageEl      = $(this).find('.content-box--content');
    var winWidth     = $(window).width();
    var mobileImage  = imageEl.data('mobile-image');
    var desktopImage = imageEl.data('desktop-image');
    var curImage     = imageEl.attr('style');
    
    if ( winWidth < 992 ) {

      if (curImage != mobileImage) {
        imageEl.attr('style',mobileImage);
      }

    } else {

      if (curImage != desktopImage) {
        imageEl.attr('style',desktopImage);
      }

    }

  });

};

contentBoxImage();

$(window).resize(function() {
  contentBoxImage();
});
