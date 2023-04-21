import 'flickity/dist/flickity.min.css';

if ( !$('html').hasClass('is-ie') && $('.responsive-slider--wrapper').length > 0 ) { 

	const Flickity = require('flickity');
	require('flickity-fade');

	$('.responsive-slider--wrapper').each(function() {

		let _this     = $(this).attr('id');
		let _settings = JSON.parse($(this).attr('data-settings'));
		let flkty     = new Flickity( '#'+_this, _settings);

	});
	
}