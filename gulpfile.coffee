gulp    = require "gulp"
coffee  = require "gulp-coffee"
plumber = require "gulp-plumber"
jade    = require "gulp-jade"
uglify  = require "gulp-uglify"
browser = require "browser-sync"

gulp.task 'server', () ->
  browser({server:{baseDir:"deploy/"}})

gulp.task 'compile-coffee', () ->
  gulp.src('src/coffee/*.coffee')
    .pipe(plumber())
    .pipe(coffee())
    .pipe(gulp.dest('src/js/'))
    .pipe(browser.reload({stream:true}))

gulp.task 'compile-jade', () ->
  gulp.src('src/jade/*.jade')
    .pipe(plumber())
    .pipe(jade({pretty:true}))
    .pipe(gulp.dest('deploy/'))
    .pipe(browser.reload({stream:true}))

gulp.task 'js', () ->
  gulp.src('src/js/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('deploy/assets/js'))
    .pipe(browser.reload({stream:true}))

gulp.task 'default', ['server'], () ->
  gulp.run([
    'compile-coffee',
    'compile-jade',
    'js'
  ])
  gulp.watch(["src/coffee/*.coffee"], ["compile-coffee"])
  gulp.watch(["src/jade/*.jade"], ["compile-jade"])
  gulp.watch(["src/js/*.js"], ["js"])
