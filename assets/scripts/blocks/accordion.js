$('.accordion--title-link').on('click',function(e){
	e.preventDefault();
	$( $(this).attr('href') ).toggleClass('is-collapsed');
});
