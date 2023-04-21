$('.locations-grid--anchors a').on('click', function(e) {

	e.preventDefault();

	let anchorContent = $(this).attr('href');
	let gridOffset    = $(anchorContent).offset();
	let banner        = $('.banner').height();

	$('html, body').animate({
		scrollTop: gridOffset.top - banner
	}, 750);

});