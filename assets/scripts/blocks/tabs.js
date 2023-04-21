$('.tabs-grid').on('click','.tab-close',function(e) {

	e.preventDefault();
	$('.tab--link').removeClass('is-expanded');

});

$('.tabs-grid').on('click', '.tab--link', function(e) {

	e.preventDefault();

	$('.tab--link').removeClass('is-expanded');
	$(this).addClass('is-expanded');

	var gridOffset = $(this).offset();
	var banner = $('.banner').height();

	$('html, body').animate({
		scrollTop: gridOffset.top - banner
	}, 750);

});

$('.tabs-grid').on('click', '.tab-close', function(e) {

	e.preventDefault();
	$(this).closest('.tab--content').prev().removeClass('is-expanded');

});