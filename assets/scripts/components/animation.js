import anime from 'animejs/lib/anime.es.js';

  // Detect if element is inview
  var inView = function ( elements ) {

    var $window    = $(window);
    var docViewTop = $window.scrollTop() + $window.height() - ( $window.height() / 10 );

    elements.each( function( index ) {

      if ( !$(this).hasClass('over') ) {

        var elemTop = $(this).offset().top;

        if ( elemTop < docViewTop ) {

          $(this).addClass('over');

          if ( $(this).hasClass('draw-number') ) {

            //console.log('#' + $(this).attr('id'));

            anime({
              targets: '#' + $(this).attr('id'),
              loop: false,
              direction: 'alternate',
              strokeDashoffset: [anime.setDashoffset, 0],
              easing: 'easeInOutSine',
              duration: 2000,
              delay: (el, i) => { return i * 500 }
            });

          }

        }

      }

    });

  };

  inView( $('.inview') );

  $( window ).scroll( function(e) {
    inView( $('.inview') );
  });
