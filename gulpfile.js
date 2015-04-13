/*global -$ */
'use strict';
// generated on 2015-04-08 using generator-gulp-webapp 0.3.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');
var reload = browserSync.reload;

// Clean the dist and temp directories
gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

// Run JSHint
gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// For running unit tests
gulp.task('test', function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['test', '.tmp'],
      routes: {
        '/src': 'src',
        '/external': 'external'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/scripts/**/*.js',
    'test/spec/**/*.js'
  ]).on('change', reload);

});

// Build release versions of the plugin
gulp.task('build', ['clean', 'jshint'], function () {
  var pkg = require('./package.json');
  var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @license <%= pkg.license %>',
    ' */',
    '\n'].join('\n');

  gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename('diffEngine.min.js'))
    .pipe(header(banner, {pkg : pkg}))
    .pipe(gulp.dest('./dist'));

  return gulp.src('src/*.js')
    .pipe(rename('diffEngine.js'))
    .pipe(header(banner, {pkg : pkg}))
    .pipe(gulp.dest('./dist'));
});

// Default task
gulp.task('default', ['clean'], function () {

  // build the plugin
  gulp.start('build');

});
