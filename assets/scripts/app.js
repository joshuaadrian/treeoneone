console.log('App.js starting...');

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded in app.js');

  // Components
  console.log('Loading utilities...');
  require('./components/utilities');
  //require('./components/animation');
  //require('./components/colorbox');
  //require('./components/lazyLoad');
  //require('./components/plugins');
  console.log('Loading scrollTracker...');
  require('./components/scrollTracker');

  console.log('Loading form-handler...');
  require('./form-handler');
  console.log('Loading requests...');
  require('./requests');

  console.log('Loading asset-loader...');
  require('./utils/asset-loader');

  console.log('App.js initialization complete');
});