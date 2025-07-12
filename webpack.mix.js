require('dotenv').config();

const mix = require('laravel-mix');
let webpack              = require('webpack');
let path                 = require('path');
let productionSourceMaps = false;

const themename = 'treeoneone';
const domain    = 'treeoneone.test';
const homedir   = require('os').homedir();

mix.setPublicPath('dist');
mix.setResourceRoot('/dist/');

mix.setResourceRoot('../');
mix.setPublicPath(path.resolve('./'));

mix.webpackConfig({
  watchOptions: {
    ignored: [
      path.posix.resolve(__dirname, './node_modules'),
      path.posix.resolve(__dirname, './css'),
      path.posix.resolve(__dirname, './js'),
      path.posix.resolve(__dirname, './images'),
      path.posix.resolve(__dirname, './fonts'),
    ],
  },
  stats: {
      children: true,
  },
});

mix
.setPublicPath('dist')
.js('assets/scripts/app.js', 'dist/scripts')
.sass('assets/styles/app.scss', 'dist/styles')
.version()
.browserSync({
  proxy: {
    target: 'https://' + domain
  },
  host: domain,
  open: 'external',
  https: {
    key: homedir + '/.config/valet/Certificates/' + domain + '.key',
    cert: homedir + '/.config/valet/Certificates/' + domain + '.crt',
  },
  files : [
    '**/*.php',
    'dist/**/*.css',
    'dist/**/*.js'
  ],
  notify: false
})
.copyDirectory('assets/images/', 'dist/images')
.copyDirectory('assets/fonts/', 'dist/fonts')
.copy('index.html', 'dist/index.html')
// .copy('assets/scripts/flickity.js', 'dist/scripts/flickity.js')
.sourceMaps()
.options({
  processCssUrls : false,
  purifyCss      : false,
  uglify         : {},
  postCss: [
    require('autoprefixer'),
  ]
});
