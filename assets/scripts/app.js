// Vendor Libraries

try {
  window.$ = window.jQuery = require('jquery');
} catch (e) {
  console.log(e);
}

jQuery(document).ready(function($) {

  // Components
  require('./components/utilities');
  require('./components/animation');
  require('./components/colorbox');
  require('./components/lazyLoad');
  require('./components/plugins');
  require('./components/scrollTracker');

});