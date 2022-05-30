(function (Drupal, $) {
  'use strict';

  // To understand behaviors, see https://www.drupal.org/node/2269515
  Drupal.behaviors.main_slider = {
    attach: function (context, settings) {

      new Swiper('.swiper-main', {
	navigation: {
		nextEl: '.round-next',
		prevEl: '.round-prev',
	},
	speed: 600,
	// scrollbar: {
	// 	el: '.swiper-scrollbar',
	// 	draggable: true,
	// },
	coverflowEffect: {
	    rotate: 30,
	    slideShadows: false,
  	},
	parallax:true,
	simulateTouch: true,
	tuchRatio: 1,
	tuchAngle: 45,
	// grabCursor: true,
	hashNavigation: {
		watchState: false,
	},
	mousewheel: {
		speed: 1600,
		sensitivity: 1,
		eventsTarget: ".swiper-main",
		releaseOnEdges: true,
		thresholdDelta: 1,
		thresholdTime: 2,
	},
	slidesPerView: "1",
	watchOverflow: true,
	slidesPerGroup: 1,
	// freeMode: true,
	// freeModeSticky: false,
	breakpoints: {
		480: {
			slidesPerView: 1,
		},
		768: {
			slidesPerView: 2,
		},
		1024: {
			slidesPerView: 3,
		},
	},
	keyboard: {
		anabled: true,
		onlyInViwport: true,
		pageUpDown: true,
	},

     });
    }
  };

})(Drupal, jQuery);
