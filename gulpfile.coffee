gulp       = require "gulp"
coffee     = require "gulp-coffee"
plumber    = require "gulp-plumber"
notify     = require "gulp-notify"
jade       = require "gulp-jade"
uglify     = require "gulp-uglify"
minifyCss  = require "gulp-minify-css"
browser    = require "browser-sync"

# browser-sync server
gulp.task 'server', () ->
  browser({server:{baseDir:"deploy/"}})

# HTML
gulp.task 'compile-jade', () ->
  gulp.src('src/jade/*.jade')
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(jade({pretty:true}))
    .pipe(gulp.dest('deploy/'))
    .pipe(browser.reload({stream:true}))

# JavaScript
gulp.task 'compile-coffee', () ->
  gulp.src('src/coffee/*.coffee')
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(coffee())
    .pipe(gulp.dest('src/js/'))
    .pipe(browser.reload({stream:true}))

gulp.task 'js', () ->
  gulp.src('src/js/*.js')
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(uglify())
    .pipe(gulp.dest('deploy/assets/js/'))
    .pipe(browser.reload({stream:true}))

# CSS
gulp.task 'css', () ->
  gulp.src('src/css/*.css')
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(minifyCss())
    .pipe(gulp.dest('deploy/assets/css/'))
    .pipe(browser.reload({stream:true}))

# run & watch
gulp.task 'default', ['server'], () ->
  gulp.run([
    'compile-coffee',
    'compile-jade',
    'js'
    'css'
  ])
  gulp.watch(["src/coffee/*.coffee"], ["compile-coffee"])
  gulp.watch(["src/jade/*.jade"], ["compile-jade"])
  gulp.watch(["src/js/*.js"], ["js"])
  gulp.watch(["src/css/*.css"], ["css"])
