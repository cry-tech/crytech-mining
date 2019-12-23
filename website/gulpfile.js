const { src, dest, parallel } = require('gulp');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const terser = require('gulp-terser');

function layoutcss() {
  return src([
    'vendor/bootstrap/css/bootstrap.min.css',
    'css/animate.css',
    'css/style.css',
    'css/global/global.css',
    'css/font-awesome-5.css',
    'css/light-bootstrap-dashboard.css'
  ])
    .pipe(minifyCSS())
    .pipe(concat('layout.min.css'))
    .pipe(dest('dist'))
}

function layoutjs() {
  return src([
    "vendor/popper.min.js",
    "vendor/jquery.min.js",
    "vendor/bootstrap/js/bootstrap.min.js",
    "js/light-bootstrap-dashboard.js",
    "js/components/header-sticky.js"
  ])
    .pipe(concat('layout.min.js'))
    .pipe(terser())
    .pipe(dest('dist'))
}

function homejs() {
  return src([
    "vendor/jquery.migrate.min.js",
    "vendor/jquery.wow.min.js",
    "vendor/jquery.back-to-top.min.js",
    "js/global.min.js",
    "js/components/wow.min.js",
    "vendor/jquery.validate.min.js",
    "vendor/parallax.min.js",
    "js/form-validation.js",
    "js/count-down.js",
    "js/profit-calculator.js"
  ])
    .pipe(concat('home.min.js'))
    .pipe(terser())
    .pipe(dest('dist'));
}

exports.layoutcss = layoutcss;
exports.layoutcjs = layoutjs;
exports.homejs = homejs;
exports.default = parallel(layoutcss, layoutjs, homejs);