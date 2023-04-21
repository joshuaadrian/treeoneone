
if ($('.interactive-graphic-block').length > 0) {

	$('.interactive-graphic--link').on('click', function(e) {

		e.preventDefault();
		var id = $(this).attr('href');

		$('.interactive-graphic--link').removeClass('is-showing');
		$(this).addClass('is-showing');

		$('.interactive-graphic--copy').removeClass('is-showing');
		$($(this).attr('href')).addClass('is-showing');

	});

}
