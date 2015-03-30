var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var paths = require('../paths');
var compilerOptions = require('../babelConfig');
var assign = Object.assign || require('object.assign');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var prefixer = require('gulp-autoprefixer');


gulp.task('build-system', function () {
  return gulp.src(paths.source)
    .pipe(plumber())
    .pipe(changed(paths.output, {extension: '.js'}))
    .pipe(sourcemaps.init())
    .pipe(babel(assign({}, compilerOptions, {modules:'system'})))
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/' + paths.root }))
    .pipe(gulp.dest(paths.output));
});

// copies changed html files to the output directory
gulp.task('build-html', function () {
  return gulp.src(paths.html)
    .pipe(changed(paths.output, {extension: '.html'}))
    .pipe(gulp.dest(paths.output));
});

gulp.task('build-jspm', function(){
  return gulp.src(paths.jspm, { base: '.' })
    .pipe(gulp.dest(paths.output));
});

gulp.task('build-stylus', function(){
  return gulp.src(paths.stylus)
    .pipe(stylus({ errors: true }))
    .pipe(prefixer())
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.output));
});
// this task calls the clean task (located
// in ./clean.js), then runs the build-system
// and build-html tasks in parallel
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function(callback) {
  return runSequence('clean',['build-system', 'build-html', 'build-jspm'],callback);
});
