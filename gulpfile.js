var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    lib = require('./app/assets'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    opn = require('opn'),
    notify = require('gulp-notify'),
    jshint = require('gulp-jshint'),
    deploy = require('gulp-gh-pages');


// html
gulp.task('html', function(){
  gulp.src('./dist/*.html')
  .pipe(connect.reload())
});


// Html markup
gulp.task('htmlmarkup', function() {
  return gulp.src(['app/views/*.html'])
    .pipe(plumber.stop())
    .pipe(gulp.dest('./dist/'))
    .pipe(connect.reload())
});


// sass
gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: [
      'last 2 versions',
      'ie 9',
      'ie 8',
      'android 2.3',
      'android 4',
      'opera 12'
    ]
  }))
  .pipe(sourcemaps.write('./sourcemaps'))
  .pipe(plumber.stop())
  .pipe(gulp.dest('./dist/css'))
  .pipe(connect.reload())
});
// style bundler
gulp.task('styles-bundle', function() {
  return gulp.src( lib.styles.files )
    .pipe( concat('lib.css') )
    .pipe(autoprefixer({
      browsers: [
        'last 2 versions',
        'ie 9',
        'android 2.3',
        'android 4',
        'opera 12'
      ]
    }))
    .pipe(gulp.dest('./dist/css'))
});


// imagemin
gulp.task('imagemin', function(){
  return gulp.src('app/img/**/*')
  .pipe(imagemin())
  .pipe(gulp.dest('./dist/img'))
});


// js concat
gulp.task('scripts', function(){
  return gulp.src('app/js/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(jshint())
  .pipe(jshint.reporter())
  .pipe(concat('main.js'))
  .pipe(sourcemaps.write('./sourcemaps'))
  .pipe(gulp.dest('./dist/js'))
  .pipe(connect.reload())
});
// scripts bundler
gulp.task('scripts-bundle', function() {
  return gulp.src( lib.scripts.files )
    .pipe( concat('lib.js') )
    .pipe(gulp.dest('./dist/js'))
});


// Fonts
gulp.task('fonts', function() {
  return gulp.src(lib.fonts.files)
    .pipe(gulp.dest('./dist/fonts'))
});


// connect
gulp.task('connect', function(){
  connect.server({
    root: 'dist/',
    port: 8888,
    livereload: true
  });
});


// open browser
opn('http://localhost:8888/', {app: 'google chrome'});


// deploy
gulp.task('deploy', function () {
  return gulp.src("./dist/**/*")
    .pipe(deploy())
});

//  watch
gulp.task('watch', function(){
  gulp.watch('dist/*.html', ['html']);
  gulp.watch('app/views/**/*.html', ['htmlmarkup']);
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/js/**/*.js', ['scripts']);
  gulp.watch('app/img/**/*', ['imagemin']);
});


// default
gulp.task('default', [
  'html',
  'htmlmarkup',
  'sass',
  'styles-bundle',
  'scripts',
  'scripts-bundle',
  'imagemin',
  'fonts',
  'watch',
  'connect'
]);
