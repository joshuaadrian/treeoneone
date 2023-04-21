import { CountUp } from 'countup.js';

var isScrolledIntoView = function(elem) {
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();
  var elemTop = $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();
  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

var numbersAnimation = function() {

  var numbers = $('.number');

  $.each( numbers, function ( i, e ) {

    var winWidth = $(window).width();
    var disableAnimation = $(this).data('disable-mobile');

    if ( isScrolledIntoView(this) === true && !$(this).hasClass('is-in-view') ) {

      if ( !disableAnimation || ( disableAnimation && winWidth > 991 ) ) {

        var endVal = $(this).text().replace(/,/g, '');
        $(this).addClass('is-in-view');

        var hasDecimals = endVal.indexOf('.') == -1 ? 0 : 1;
        var separator   = $(this).data('separator');
        separator       = separator ? '' : ',';

        var options = {
          startVal      : 0,
          useEasing     : false,
          useGrouping   : true,
          separator     : separator,
          decimal       : '.',
          decimalPlaces : hasDecimals,
          duration      : 4
        };

        if ( endVal && endVal > 0 ) {
          var number = new CountUp( jQuery(this).attr('id'), endVal, options);
          number.start();
        }

      }

    }

  });

};

numbersAnimation();

$(window).scroll(function () {
  numbersAnimation();
});
