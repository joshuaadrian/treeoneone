// Vendor Libraries

try {

  window.$ = window.jQuery = require('jquery');
  window.Selectric         = require('jquery-selectric');

  var isIE11 = !!window.MSInputMethodContext && !!document.documentMode ? 'is-ie' : 'is-not-ie';
  $('html').removeClass('no-js').addClass('is-loaded').addClass(isIE11);

} catch (e) {
  console.log(e);
}

jQuery(document).ready(function($) {

  // Components
  require('./components/utilities');
  require('./components/animation');
  require('./components/colorbox');
  require('./components/disclaimer');
  require('./components/lazyLoad');
  require('./components/plugins');
  require('./components/portfolioFilters');
  require('./components/postFilters');
  require('./components/scrollTracker');
  require('./components/teamFilters');
  require('./components/selectric');

  // Blocks
  require('./blocks/accordion');
  require('./blocks/content-box');
  require('./blocks/interactive-graphic');
  require('./blocks/link-list');
  require('./blocks/location-grid');
  require('./blocks/masthead');
  require('./blocks/responsive-slider');
  // require('./blocks/stats');
  require('./blocks/tabs');
  require('./blocks/wp-menu');

});