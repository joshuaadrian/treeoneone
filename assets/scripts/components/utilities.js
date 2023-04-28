$('.request--button').on('click', function(e) {
  e.preventDefault();
  $('body').addClass('is-showing-form');
});

$('.too--form--close').on('click', function(e) {
  e.preventDefault();
  $('body').removeClass('is-showing-form');
});
