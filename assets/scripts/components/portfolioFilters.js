$('.portfolio--item-link').on('click',function(e) {

  e.preventDefault();
  var href     = $(this).attr('href');
  var status   = $('#portfolio-filter--status').val();
  var strategy = $('#portfolio-filter--strategy').val();
  var fund     = $('#portfolio-filter--fund').val();
  var region   = $('#portfolio-filter--region').val();
  var query    = '';

  if ( status || strategy || fund || region ) {

    query    = '?';

    if ( status ) {
      query += 'status=' +status;
    }

    if ( strategy ) {
      query += '&strategy=' +strategy;
    }

    if ( fund ) {
      query += '&fund=' +fund;
    }

    if ( region ) {
      query += '&region=' +region;
    }

    href = href + query;

  }

  if (history.pushState) {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + query;
    window.history.pushState({path:newurl},'',newurl);
  }

  window.location.href = href;

});

if ( $('.portfolio--dropdown').length > 0 ) {

  if (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0) ||
    window.document.documentMode
  ) {

    $('.portfolio--dropdown').addClass('is-touch').on('change', function(e) {
      e.preventDefault();
      filterPortfolio();
    });

  } else {

    $('.portfolio--dropdown').selectric({
      maxHeight: 300,
      disableOnMobile: true
    }).on('change', function(e, element, selectric) {
      e.preventDefault();
      filterPortfolio();
    });

  }

}

$('#portfolio--search-input').on('focus',function(e) {

  var tagValue = $(this).val()

  if ( window.document.documentMode ) {

    if ( tagValue ) {
      $('.portfolio--dropdown').val("");
      searchPortfolio(tagValue);
    } else {
      $('.portfolio--item').removeClass('is-hiding');
      $('.portfolio--dropdown').val("");
    }

  } else {

    if ( tagValue ) {
      $('.portfolio--dropdown').val("").selectric('refresh');
      searchPortfolio(tagValue);
    } else {
      $('.portfolio--item').removeClass('is-hiding');
      $('.portfolio--dropdown').val("").selectric('refresh');
    }

  }

});


$('#portfolio--search-input').keyup(function( event ) {
  var tagValue = $(this).val().toLowerCase();
  searchPortfolio(tagValue);
});

$('.portfolio--reset-filter-a').on('click',function(e) {
  e.preventDefault();
  resetFilters();
});

function resetFilters() {

  if ( window.document.documentMode ) {
    $('.portfolio--dropdown').val("");
  } else {
    $('.portfolio--dropdown').val("").selectric('refresh');
  }
  
  $('#portfolio--search-input').val("");
  $('.portfolio--item').removeClass('is-hiding');

}

function filterPortfolio() {

  $('#portfolio--search-input').val("");

  var classesArray = [];
  var portfolios   = $('.portfolio--item');

  $('.portfolio--dropdown').each(function(){

    var selectClass = $(this).val();

    if (selectClass) {
      classesArray.push(selectClass);
    }

  });

  if (classesArray.length > 0) {

    portfolios.each(function() {

      var shouldHide = false;
      var portItem  = $(this);

      $.each(classesArray, function(i,val) {

        if ( !portItem.hasClass(val) ) {
          shouldHide = true;
        }

      });

      if (shouldHide) {
        $(this).addClass('is-hiding');
      } else {
        $(this).removeClass('is-hiding');
      };

    });

  } else {

    $('.portfolio--item').removeClass('is-hiding');

  }

  portfolios.addClass('over');

}

function searchPortfolio( value ) {

  var tagValue   = value.replace(/[^a-z0-9]/gi, '-');
  tagValue       = tagValue.replace('--', '-');
  var portfolios = $('.portfolio--item');

	if (tagValue && tagValue.length > 2) {

		portfolios.each(function() {

			var shouldHide = false;
			var portItem   = $(this);
      var tags       = portItem.data('searchtags');

			if ( !tags.includes(tagValue) ) {
				shouldHide = true;
			}

			if (shouldHide) {
				$(this).addClass('is-hiding');
			} else {
				$(this).removeClass('is-hiding');
			};

		});

	} else {

		portfolios.removeClass('is-hiding');

  }

  portfolios.addClass('over');

}
