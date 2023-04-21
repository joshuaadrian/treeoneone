import LazyLoad from "vanilla-lazyload";

var winWidth = $(window).width();

if ( $('.team--item').length > 0 ) {

  var lazyLoadTeamItems = new LazyLoad();

  $('.team--item-link').on('click',function(e) {

    e.preventDefault();
    var href     = $(this).attr('href');
    var sector   = $('#team-filter--sector').val();
    var strategy = $('#team-filter--strategy').val();
    var fund     = $('#team-filter--fund').val();
    var title    = $('#team-filter--title').val();
    var office   = $('#team-filter--office').val();
    var query    = '';

    if ( sector || strategy || fund || title ) {

      query    = '?';

      if ( sector ) {
        query += 'sector=' +sector;
      }

      if ( strategy ) {
        query += '&strategy=' +strategy;
      }

      if ( fund ) {
        query += '&fund=' +fund;
      }

      if ( title ) {
        query += '&title=' +title;
      }

      if ( office ) {
        query += '&office=' +office;
      }

      href = href + query;

    }

    if (history.pushState) {
      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + query;
      window.history.pushState({path:newurl},'',newurl);
    }

    window.location.href = href;

  });

}

if ( $('.team--dropdown').length > 0 ) {

  if (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0) ||
    window.document.documentMode
  ) {

    $('.team--dropdown').on('change', function(e) {
      e.preventDefault();
      filterTeam();
    });

  } else {

    $('.team--dropdown').selectric({
      maxHeight: 300,
      disableOnMobile: true
    }).on('change', function(e, element, selectric) {
      e.preventDefault();
      filterTeam();
    });
    
  }

}

$('#team--search-input').on('focus',function(e) {

  var tagValue = $(this).val();

  if ( window.document.documentMode ) {

    if ( tagValue ) {
      $('.team--dropdown').val("");
      searchTeam(tagValue);
    } else {
      $('.team--item').removeClass('is-hiding');
      $('.team--dropdown').val("");
    }

  } else {

    if ( tagValue ) {
      $('.team--dropdown').val("").selectric('refresh');
      searchTeam(tagValue);
    } else {
      $('.team--item').removeClass('is-hiding');
      $('.team--dropdown').val("").selectric('refresh');
    }

  }

});

$('.team--search').on('click',function() {

  let inputValue = $(this).find('input').val();

  if ( inputValue && !$(this).hasClass('is-expanded') ) {
    $(this).addClass('has-value');
    $(this).addClass('is-expanded');
  } else if ( inputValue ) {
    $(this).addClass('has-value');
  } else {
    $(this).removeClass('has-value');
    $(this).toggleClass('is-expanded');
  }

});

$('#team--search-input').keyup(function( event ) {
  var tagValue = $(this).val().toLowerCase();
  searchTeam(tagValue);
});

$('.team--reset-filter-a').on('click',function(e) {
  e.preventDefault();
  resetFilters();
});

function resetFilters() {

  if ( window.document.documentMode ) {
    $('.team--dropdown').val("");
  } else {
    $('.team--dropdown').val("").selectric('refresh');
  }

  $('#team--search-input').val("");
  $('.team--item').removeClass('is-hiding');
  $('.team--item-section').removeClass('is-hiding');

}

function filterTeam() {

  $('#team--search-input').val("");

  var classesArray       = [];
  var teamItems          = $('.team--item');
  var sectionTitleSnrLdr = false;
  var sectionTitleAllLdr = false;

  $('.team--dropdown').each(function(){

    var selectClass = $(this).val();

    if (selectClass) {
      classesArray.push(selectClass);
    }

  });

  if (classesArray.length > 0) {

    teamItems.each(function() {

      var shouldHide = false;
      var teamItem  = $(this);

      $.each(classesArray, function(i,val) {

        if ( !teamItem.hasClass(val) ) {
          shouldHide = true;
        } else {

          if ( teamItem.hasClass('senior-leadership') ) {
            sectionTitleSnrLdr = true;
          } else if ( teamItem.hasClass('all-leadership') ) {
            sectionTitleAllLdr = true;
          }

        }

      });

      if (shouldHide) {
        $(this).addClass('is-hiding');
      } else {
        $(this).removeClass('is-hiding');
      };

    });

    if ( sectionTitleSnrLdr ) {
      $('#team--item-section__senior-leadership').removeClass('is-hiding');
    } else {
      $('#team--item-section__senior-leadership').addClass('is-hiding');
    }

    if ( sectionTitleAllLdr ) {
      $('#team--item-section__all-leadership').removeClass('is-hiding');
    } else {
      $('#team--item-section__all-leadership').addClass('is-hiding');
    }

  } else {

    teamItems.removeClass('is-hiding');
    $('.team--item-section').removeClass('is-hiding');

  }

  teamItems.addClass('over');

}

function searchTeam( value ) {

  var tagValue   = value.replace(/[^a-z0-9]/gi, '-');
  tagValue       = tagValue.replace('--', '-');
  var teamItems = $('.team--item');
  var sectionTitleSnrLdr = false;
  var sectionTitleAllLdr   = false;

  if (tagValue && tagValue.length > 2) {

    teamItems.each(function() {

      var shouldHide = false;
      var teamItem   = $(this);
      var tags       = teamItem.data('searchtags');

      if ( !tags.includes(tagValue) ) {
        shouldHide = true;
      }

      if (shouldHide) {
        $(this).addClass('is-hiding');
      } else {

        $(this).removeClass('is-hiding').addClass('over');

        if ( $(this).hasClass('senior-leadership') ) {
          sectionTitleSnrLdr = true;
        } else if ( $(this).hasClass('all-leadership') ) {
          sectionTitleAllLdr = true;
        }

      };

    });

    if ( sectionTitleSnrLdr ) {
      $('#team--item-section__senior-leadership').removeClass('is-hiding');
    } else {
      $('#team--item-section__senior-leadership').addClass('is-hiding');
    }

    if ( sectionTitleAllLdr ) {
      $('#team--item-section__all-leadership').removeClass('is-hiding');
    } else {
      $('#team--item-section__all-leadership').addClass('is-hiding');
    }

  } else {

    teamItems.removeClass('is-hiding');
    $('.team--item-section').removeClass('is-hiding');

  }

}
