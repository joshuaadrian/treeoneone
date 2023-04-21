

$(".posts--load--more-a").on('click',function(e) {
  e.preventDefault();
  let paged    = parseFloat( $(this).attr('data-next') );
  let category = $('#post-filter--category').val();
  console.log($('.post--dropdown').val());
  console.log(category);
  updatePostsResults(paged, category);
});

var updatePostsResults = function( paged, category ) {

  paged    = paged ? paged : 1;
  var grid = $('.posts--grid');

  console.log(category);

  $.ajax({
    type     : "post",
    dataType : "json",
    url      : localized_object.ajax_url,
    data : {
      action : "get_posts_form",
      paged    : paged,
      category : category,
      nonce    : localized_object.nonce
    },
    //processData: false,
    timeout    : 300000,
    beforeSend : function() {
      grid.addClass('is-loading');
    }
  }).done( function( response ) {

    grid.removeClass('is-loading');
    //console.log(response);
    // const obj = JSON.parse(response);
    //       console.log(obj);

    if ( response && typeof response.news !== 'undefined' ) {

      var count = $('.cur-num').text();
      count = parseFloat(count) + parseFloat(response.displaying);

      var newPosts = $( response.news );

      if ( !response.news ) {
        grid.html('<h3 class="posts--no-results"><strong>No Results</strong> Please refine search parameters</h3>');
      } else if (response.cur_page == 1) {
        grid.html(newPosts);
      } else {
        grid.append(newPosts);
      }

      $('.posts--navigation--page-links').html(response.page_links);

      $(".posts--load--more-a").attr('data-next', response.cur_page + 1 );

      if ( parseFloat(response.max_count) < response.cur_page * 10 ) {
        $('.cur_displaying').html(parseFloat(response.max_count));
      } else {
        $('.cur_displaying').html(response.cur_page * 10);
      }

      $('.max_count').html(parseFloat(response.max_count));

      if ( response.cur_page < response.max_pages ) {
        $(".posts--load--more-a").show();
      } else {
        $(".posts--load--more-a").hide();
      }

    }

  }).fail(function(xhr, status, error) {
    //Ajax request failed.
    console.log(error);
    var errorMessage = xhr.status + ': ' + xhr.statusText
    console.log('Error - ' + errorMessage);

  }).always(function() {



  });

}

$('.post--item a').on('click',function(e) {

	e.preventDefault();
	var href     = $(this).attr('href');
	var category   = $('#post-filter--category').val();
	var query    = '';

	if ( category ) {

		query    = '?';

		if ( category ) {
			query += 'cat=' +category;
		}

		href = href + query;

	}

	if (history.pushState) {
		var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + query;
		window.history.pushState({path:newurl},'',newurl);
	}

	window.location.href = href;

});

if ( $('#post-filter--category').length > 0 ) {

	$('#post-filter--category').selectric({
    maxHeight: 300,
    disableOnMobile: true
  }).on('change', function(e, element, selectric) {
		e.preventDefault();
    let category   = $('#post-filter--category').val();
    updatePostsResults('', category);
	});

}