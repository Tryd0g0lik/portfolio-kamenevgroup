(function (Drupal, $) {
  'use strict';

  // To understand behaviors, see https://www.drupal.org/node/2269515
  Drupal.behaviors.inner_slider = {
    attach: function (context, settings) {
// INNER SLIDER
      new Swiper('.portfolio-slider', {
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	autoplay: {
	   delay: 5000,
	 },
	speed: 1100,
	effect: 'fade',
	fadeEffect: {
	   crossFade: true
	},
	// coverflowEffect: {
	//     rotate: 30,
	//     slideShadows: false,
    // },
	simulateTouch: true,
	tuchRatio: 1,
	tuchAngle: 45,
	slidesPerView: "1",
	watchOverflow: true,
	slidesPerGroup: 1,
    });
    }
  };

/* Product Gallery Slider */
  Drupal.behaviors.gallery_slider = {
    attach: function (context, settings) {
      new Swiper('.product-gallery', {
	navigation: {
		nextEl: '.gallery-slide-next',
		prevEl: '.gallery-slide-prev',
	},
	autoplay: {
	   delay: 3000,
	},
	speed: 800,
	effect: 'fade',
	fadeEffect: {
	   crossFade: true
	},
	simulateTouch: false,
	tuchRatio: 1,
	tuchAngle: 45,
	slidesPerView: "1",
	watchOverflow: true,
	slidesPerGroup: 1,
	loop: true,
	freeModeSticky: false,
    });
   }
  };
/* Slider in Product Page - Accompany Product */
  Drupal.behaviors.accompany_slider = {
    attach: function (context, settings) {
      new Swiper('.accompany-product', {
	navigation: false,
	autoplay: {
	  delay: 6000,
	  disableOnInteraction: false,
	},
	speed: 1800,
	coverflowEffect: {
	    rotate: 30,
	    slideShadows: false,
        },
	simulateTouch: true,
	tuchRatio: 1,
	tuchAngle: 45,
	slidesPerView: "2",
	watchOverflow: true,
	slidesPerGroup: 1,
	loop: true,
     });
    } 
  };
})(Drupal, jQuery);
