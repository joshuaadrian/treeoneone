window.$ = window.jQuery = require('jquery');
window.jQueryBridget = require('jquery-bridget');
window.colorbox = require('jquery-colorbox');

function youTubeGetID( url ) {

  var ID = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_-]/i);
    ID = ID[0];
  } else {
    ID = url;
  }
  return ID;

}

function vimeoGetID( url ) {

  var ID = '';

  url = url.split( '/' );

  if ( url[3] !== undefined ) {
    ID = url[3];
  }

  return ID;

}

jQuery( document ).ready(function($) {

  $(".wrap a[href*='youtu.be'],.wrap a[href*='youtube']").each( function() {
    var videoID = youTubeGetID( $(this).attr( 'href' ) );
    $(this).addClass('video-link').attr( 'href', "https://www.youtube.com/embed/" + videoID  + "?rel=0&amp;autoplay=1&amp;wmode=transparent&amp;modestbranding=1&amp;showinfo=0");
  });

  $(".wrap a[href*='vimeo']").each( function() {
    var videoID = vimeoGetID( $(this).attr( 'href' ) );
    $(this).addClass('video-link').attr( 'href', "https://player.vimeo.com/video/" + videoID  + "?autoplay=1&amp;title=0&amp;byline=0&amp;portrait=0");
  });

  // Video Player (include video URL in a tag href)
  $('.video-link').colorbox({
    iframe      : true,
    transition  : "none",
    width       : "100%",
    height      : "100%",
    innerWidth  : "100%",
    innerHeight : "100%",
    onComplete  : function( element ) {

      $('#colorbox').addClass('video-cbox');
      var caption = $(element.el).attr('title');

      if ( caption ) {
        $('#cboxTitle').html( caption );
      } else {
        $('#cboxTitle').addClass('video-caption-hidden');
      }

    },
    onClosed : function( element ) {
      $('#cboxTitle').html('');
      $('#colorbox').removeClass('video-cbox');
      $('#cboxTitle').removeClass('video-caption-hidden');
    }
  });

});
