gulp    = require "gulp"
coffee  = require "gulp-coffee"
plumber = require "gulp-plumber"
jade    = require "gulp-jade"

gulp.task 'compile-coffee', () ->
  gulp.src('app/source/coffee/*.coffee')
    .pipe(plumber())
    .pipe(coffee())
    .pipe(gulp.dest('app/source/js/'))

gulp.task 'compile-jade', () ->
  gulp.src('app/source/jade/*.jade')
    .pipe(plumber())
    .pipe(jade({pretty:true}))
    .pipe(gulp.dest('app/'))

gulp.task 'default', () ->
  gulp.watch(["app/source/coffee/*.coffee"], ["compile-coffee"])
  gulp.watch(["app/source/jade/*.jade"], ["compile-jade"])
