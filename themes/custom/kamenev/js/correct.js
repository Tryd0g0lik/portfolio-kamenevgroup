
$(window).resize (function() {
	let width_gallary =  $('.portfolio__protfoilio div:first-child').width()
	$('.portfolio__protfoilio > div').css('height', width_gallary);
	})

