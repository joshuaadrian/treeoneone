$('.masthead--advance-arrow').on('click',function(e) {

  e.preventDefault();

  var masthead = $(this).closest('.masthead');
  var nextGroup = masthead.next('.wp-block-group');

  if (nextGroup) {

    var bannerHeight = $('.banner').height();
    var elOffset = nextGroup.offset();
    var elOffsetTop = elOffset.top;

    $('html, body').animate({
      scrollTop: elOffsetTop - 70
    }, 750);

  }

});
