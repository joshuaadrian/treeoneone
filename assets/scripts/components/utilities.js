

var winWidth = $(window).width();

function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
}

if ( isTouchDevice() ) {
  $('html').addClass('is-touch');
}

$('.nav-search > a').on('click', function(e) {
  e.preventDefault();
  $('.banner').toggleClass('is-searching');
  $('.nav-search').toggleClass('is-showing');
  $('.menu-item').not('.nav-search').toggleClass('is-hiding');
});

$('.back-to-top').on('click', function(e) {

  e.preventDefault();
  $('html, body').animate({
    scrollTop: 0
  }, 750);

});

// Add class to body on hamburger click
$('.navbar-toggler').on('click', function(e) {
  e.preventDefault();
  $('body').toggleClass('menu-is-open');

  if (!$('body').hasClass('menu-is-open')) {
    $('.banner').removeClass('is-searching');
    $('.nav-search').removeClass('is-showing');
    $('.menu-item').not('.nav-search').removeClass('is-hiding');
  }
});

if ( $('.menu-item.dropdown').length > 0 ) {

  $('.menu-item.dropdown').on('click', function(e) {

    if ( winWidth < 1200 ) {

      if ( $(this).hasClass('is-expanded') ) {
        $(this).removeClass('is-expanded');
      } else {
        $(this).addClass('is-expanded');
      }

    }

  });

}

$('.ginput_container input:not(:file), .ginput_container textarea').on('focusout', function(e) {

  var thisVal = $(this).val();

  if (thisVal) {
    $(this).parent().addClass('has-value');
  } else {
    $(this).parent().removeClass('has-value');
  }

});

if ( $('.blank').length > 0 ) {

  $('.blank').each( function(index, value) {
    $(this).find('a').attr('target','_blank').attr('rel','external noreferrer noopener');
  });

}
