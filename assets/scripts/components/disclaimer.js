
if ( $('#disclaimer').length > 0 ) {

  var cookie_exists = document.cookie.match(/^(.*;)?\s*STYXKEYdisclaimerAccepted\s*=\s*[^;]+(.*)?$/);

  if ( cookie_exists ) {
    $('body').removeClass('disclaimer-popup-showing');
  } else {
    $('body').addClass('disclaimer-popup-showing');
  }

  $('.disclaimer--terms-button').on( 'click', function (e) {

    e.preventDefault();

    var date = new Date();
    date.setTime(date.getTime() + (1000 * 60 * 60 * 24 * 7));
    document.cookie = "STYXKEYdisclaimerAccepted=1; expires= " + date;
    $('body').removeClass('disclaimer-popup-showing');

  });

}
