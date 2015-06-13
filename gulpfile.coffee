gulp    = require "gulp"
coffee  = require "gulp-coffee"
plumber = require "gulp-plumber"
jade    = require "gulp-jade"
uglify  = require "gulp-uglify"
browser = require "browser-sync"

gulp.task 'server', () ->
  browser({server:{baseDir:"app/"}})

gulp.task 'compile-coffee', () ->
  gulp.src('app/source/coffee/*.coffee')
    .pipe(plumber())
    .pipe(coffee())
    .pipe(gulp.dest('app/source/js/'))
    .pipe(browser.reload({stream:true}))

gulp.task 'compile-jade', () ->
  gulp.src('app/source/jade/*.jade')
    .pipe(plumber())
    .pipe(jade({pretty:true}))
    .pipe(gulp.dest('app/'))
    .pipe(browser.reload({stream:true}))

gulp.task 'js', () ->
  gulp.src('app/source/js/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browser.reload({stream:true}))

gulp.task 'default', ['server'], () ->
  gulp.watch(["app/source/coffee/*.coffee"], ["compile-coffee"])
  gulp.watch(["app/source/jade/*.jade"], ["compile-jade"])
  gulp.watch(["app/source/js/*.js"], ["js"])
