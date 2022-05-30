/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal) {
  'use strict';

  // To understand behaviors, see https://www.drupal.org/node/2269515
  Drupal.behaviors.kamenev = {
    attach: function (context, settings) {
      // Execute code once the DOM is ready. $(handler) not required
      // within Drupal.behaviors.
	$('.menu-toggle', context).on('click', function(){
	    $(this).toggleClass('active').next().slideToggle(900);
	    $('body').toggleClass('is-menu');
	    $('.menu-container').toggleClass('active');
	});
	$('.open-description', context).on('click', function(){
    	    $(this).toggleClass('active').next().slideToggle(700);
	});

        $(window).on('resize', function () {
        // Execute code when the window is resized.
        });

        $(window).on('scroll', function () {
        // Execute code when the window scrolls.
        });

	$(function() {
	    $('.cities-item h5').on('click', function(){
	      $('.cities-item address').not( $(this).next() ).slideUp(400);
	      if($('.wrap-cities').hasClass('only_one')){
	        $('.cities-item h5').not($(this)).removeClass('title-active');
	        $('.cities-item address').not($(this).next()).slideUp(400);
	      }
	      $(this).toggleClass('title-active');
	      $(this).next().slideToggle(400);
	    });
	});
    }
  };

})( jQuery, Drupal);
