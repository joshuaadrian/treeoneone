

$('.wp-menu .menu-item a[href^="#"]').on('click', function(e) {
  
  e.preventDefault();

  var bannerHeight = $('.banner').height();
  var el = $($(this).attr('href'));
  var elOffset = el.offset();
  var elOffsetTop = elOffset.top;

  $('html, body').animate({
    scrollTop: elOffsetTop - bannerHeight
  }, 750);

});
