
if ($('.link-list--link').length > 0) {

	$('.link-list--link').on('click', function(e) {

		e.preventDefault();
		var id = $(this).attr('href');

		console.log($(this).attr('href'));

		$('.link-list--link').removeClass('is-showing');
		$(this).addClass('is-showing');

		$('.link-list--copy').removeClass('is-showing');
		$($(this).attr('href')).addClass('is-showing');

	});

}
