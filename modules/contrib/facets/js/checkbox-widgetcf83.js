/**
 * @file
 * Transforms links into checkboxes.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  Drupal.facets = Drupal.facets || {};
  Drupal.behaviors.facetsCheckboxWidget = {
    attach: function (context) {
      Drupal.facets.makeCheckboxes(context);
    }
  };

  /**
   * Turns all facet links into checkboxes.
   */
  Drupal.facets.makeCheckboxes = function (context) {
    // Find all checkbox facet links and give them a checkbox.
    var $checkboxWidgets = $('.js-facets-checkbox-links', context)
      .once('facets-checkbox-transform');

    if ($checkboxWidgets.length > 0) {
      $checkboxWidgets.each(function (index, widget) {
        var $widget = $(widget);
        var $widgetLinks = $widget.find('.facet-item > a');

        // Add correct CSS selector for the widget. The Facets JS API will
        // register handlers on that element.
        $widget.addClass('js-facets-widget');

        var facetSettings = drupalSettings.facets[$widget.data('drupal-facet-id')];
        // Transform links to checkboxes.
        $widgetLinks.each(Drupal.facets.makeCheckbox);

        // If disable autosubmit configuration is set, add the apply button.
        if (facetSettings.disable_autosubmit) {
          var $applyButton = $('<button class="facets-apply-button">' + facetSettings.submit_button_label + '</button>');
          $applyButton.on('click', function (e) {
            var $widget = $widgetLinks.closest('.js-facets-widget');

            Drupal.facets.disableFacet($widget);

            // Build the url based on the selected checkboxes.
            //var checkedLinks = $widgetLinks.siblings(':checked').siblings('a');
            var queryString = $.parseParams(window.location.href);
            var currentFacetValues = [];
            if (typeof queryString['f'] == 'object') {
              currentFacetValues = queryString['f'];
            }

            $widgetLinks.each(function () {
              var $link = $(this);
              var value = $widget.data('drupal-facet-alias') + ':' + $link.data('drupal-facet-item-value');
              var setted_index = $.inArray(value, currentFacetValues);
              // Add the facet, if it is not already set.
              if ($link.siblings('.facets-checkbox').is(':checked') && setted_index === -1) {
                currentFacetValues.push(value);
                // Remove the facet if set.
              } else if ($link.siblings('.facets-checkbox').is(':checked') === false && setted_index !== -1) {
                currentFacetValues.splice(setted_index, 1);
              }
            });

            if (currentFacetValues.length > 0) {
              queryString['f'] = $.extend({}, currentFacetValues);
            }
            else {
              queryString['f'] = null;
            }
            var path = window.location.href.split('?')[0];
            var queryStringObj = $.extend({}, queryString);

            // Remove pager parameter as the current page could not exist with
            // the new facets.
            if (typeof queryStringObj.page !== 'undefined') {
              queryStringObj.page = null;
            }

            var href = path + '?' + $.param(queryStringObj);

            // Trigger the facet based on the built url.
            $widget.trigger('facets_filter', [ href ]);
          });
          $widgetLinks.parents('.facets-widget-checkbox').append($('<div class="facets-apply-button-wrapper"></div>').append($applyButton));
        }

        // We have to trigger attaching of behaviours, so that Facets JS API can
        // register handlers on checkbox widgets.
        Drupal.attachBehaviors(this.parentNode, Drupal.settings);
      });

    }

    // Set indeterminate value on parents having an active trail.
    $('.facet-item--expanded.facet-item--active-trail > input').prop('indeterminate', true);
  };

  /**
   * Replace a link with a checked checkbox.
   */
  Drupal.facets.makeCheckbox = function () {
    var $link = $(this);
    var active = $link.hasClass('is-active');
    var description = $link.html();
    var href = $link.attr('href');
    var id = $link.data('drupal-facet-item-id');
    var $widget = $(this).closest('.js-facets-widget');
    var facetSettings = drupalSettings.facets[$widget.data('drupal-facet-id')];

    var checkbox = $('<input type="checkbox" class="facets-checkbox">')
      .attr('id', id)
      .data($link.data())
      .data('facetsredir', href);
    var label = $('<label for="' + id + '">' + description + '</label>');

    // Do not trigger facets on change when auto-submit is disabled, so we can trigger them manually clicking on the
    // apply button.
    if (!facetSettings.disable_autosubmit) {
      checkbox.on('change.facets', function (e) {
        e.preventDefault();

        Drupal.facets.disableFacet($widget);
        $widget.trigger('facets_filter', [href]);
      });
    }

    if (active) {
      checkbox.attr('checked', true);
      label.find('.js-facet-deactivate').remove();
    }

    $link.before(checkbox).before(label).hide();

  };

  /**
   * Disable all facet checkboxes in the facet and apply a 'disabled' class.
   *
   * @param {object} $facet
   *   jQuery object of the facet.
   */
  Drupal.facets.disableFacet = function ($facet) {
    $facet.addClass('facets-disabled');
    $('input.facets-checkbox', $facet).click(Drupal.facets.preventDefault);
    $('input.facets-checkbox', $facet).attr('disabled', true);
  };

  /**
   * Event listener for easy prevention of event propagation.
   *
   * @param {object} e
   *   Event.
   */
  Drupal.facets.preventDefault = function (e) {
    e.preventDefault();
  };

})(jQuery, Drupal, drupalSettings);


// Add an URL parser to JQuery that returns an object
// This function is meant to be used with an URL like the window.location
// Use: $.parseParams('http://mysite.com/?var=string') or $.parseParams() to parse the window.location
// Simple variable:  ?var=abc                        returns {var: "abc"}
// Simple object:    ?var.length=2&var.scope=123     returns {var: {length: "2", scope: "123"}}
// Simple array:     ?var[]=0&var[]=9                returns {var: ["0", "9"]}
// Array with index: ?var[0]=0&var[1]=9              returns {var: ["0", "9"]}
// Nested objects:   ?my.var.is.here=5               returns {my: {var: {is: {here: "5"}}}}
// All together:     ?var=a&my.var[]=b&my.cookie=no  returns {var: "a", my: {var: ["b"], cookie: "no"}}
// You just cant have an object in an array, e.g. ?var[1].test=abc DOES NOT WORK
(function ($) {
  //
  var re = /([^&=]+)=?([^&]*)/g;
  var decode = function (str) {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  };
  $.parseParams = function (query) {

    // recursive function to construct the result object
    function createElement(params, key, value) {
      key = key + '';

      // if the key is a property
      if (key.indexOf('.') !== -1) {
        // extract the first part with the name of the object
        var list = key.split('.');

        // the rest of the key
        var new_key = key.split(/\.(.+)?/)[1];

        // create the object if it doesnt exist
        if (!params[list[0]]) params[list[0]] = {};

        // if the key is not empty, create it in the object
        if (new_key !== '') {
          createElement(params[list[0]], new_key, value);
        } else console.warn('parseParams :: empty property in key "' + key + '"');
      } else
        // if the key is an array
      if (key.indexOf('[') !== -1) {
        // extract the array name
        var list = key.split('[');
        key = list[0];

        // extract the index of the array
        var list = list[1].split(']');
        var index = list[0]

        // if index is empty, just push the value at the end of the array
        if (index == '') {
          if (!params) params = {};
          if (!params[key] || !$.isArray(params[key])) params[key] = [];
          params[key].push(value);
        } else
          // add the value at the index (must be an integer)
        {
          if (!params) params = {};
          if (!params[key] || !$.isArray(params[key])) params[key] = [];
          params[key][parseInt(index)] = value;
        }
      } else
        // just normal key
      {
        if (!params) params = {};
        params[key] = value;
      }
    }

    // be sure the query is a string
    query = query + '';

    if (query === '') query = window.location + '';

    var params = {}, e;
    if (query) {
      // remove # from end of query
      if (query.indexOf('#') !== -1) {
        query = query.substr(0, query.indexOf('#'));
      }

      // remove ? at the begining of the query
      if (query.indexOf('?') !== -1) {
        query = query.substr(query.indexOf('?') + 1, query.length);
      } else return {};

      // empty parameters
      if (query == '') return {};

      // execute a createElement on every key and value
      while (e = re.exec(query)) {
        var key = decode(e[1]);
        var value = decode(e[2]);
        createElement(params, key, value);
      }
    }
    return params;
  };
})(jQuery);
