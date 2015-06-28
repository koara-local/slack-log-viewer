gulp        = require 'gulp'
browser     = require 'browser-sync'
loadPlugins = require 'gulp-load-plugins'

plugins = loadPlugins()

# server
gulp.task 'server:start', () ->
  plugins.developServer.listen {path: './server.js'}, (error) ->
    browser({proxy: 'http://localhost:8000'}) if !error

gulp.task 'server:restart', () ->
  gulp.src('server.coffee')
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError('<%= error.message %>')}))
    .pipe(plugins.coffee())
    .pipe(gulp.dest('.'))
    .pipe(plugins.developServer())
    .pipe(browser.reload({stream:true}))

# concat depends library
files_concat =
  js  : [
    'bower_components/bootstrap/dist/js/bootstrap.min.js'
    'bower_components/jquery/dist/jquery.min.js'
    'bower_components/jquery-mousewheel/jquery.mousewheel.min.js'
    'bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js'
    'bower_components/moment/min/moment-with-locales.min.js'
    'bower_components/marked/marked.min.js'
    'bower_components/vue/dist/vue.min.js'
    'bower_components/vue-resource/dist/vue-resource.min.js'
  ]
  css : [
    'bower_components/bootstrap/dist/css/bootstrap.min.css'
    'bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
    'bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css'
  ]

gulp.task 'concat_js', () ->
  gulp.src(files_concat.js)
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError('<%= error.message %>')}))
    .pipe(plugins.concat('lib.concat.js'))
    .pipe(gulp.dest('assets/js'))
    .pipe(browser.reload({stream:true}))

gulp.task 'concat_css', () ->
  gulp.src(files_concat.css)
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError('<%= error.message %>')}))
    .pipe(plugins.concat('lib.concat.css'))
    .pipe(gulp.dest('assets/css'))
    .pipe(browser.reload({stream:true}))

# HTML
gulp.task 'compile-jade', () ->
  gulp.src('src/jade/*.jade')
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError('<%= error.message %>')}))
    .pipe(plugins.jade({pretty:true}))
    .pipe(gulp.dest('.'))
    .pipe(browser.reload({stream:true}))

# JavaScript
gulp.task 'compile-coffee', () ->
  gulp.src('src/coffee/*.coffee')
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError('<%= error.message %>')}))
    .pipe(plugins.coffee())
    .pipe(gulp.dest('src/js/'))
    .pipe(browser.reload({stream:true}))

gulp.task 'js', () ->
  gulp.src('src/js/*.js')
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError('<%= error.message %>')}))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('assets/js/'))
    .pipe(browser.reload({stream:true}))

# CSS
gulp.task 'css', () ->
  gulp.src('src/css/*.css')
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError('<%= error.message %>')}))
    .pipe(plugins.minify-css())
    .pipe(gulp.dest('assets/css/'))
    .pipe(browser.reload({stream:true}))

# run & watch
gulp.task 'default', ['server:start'], () ->
  gulp.watch(['server.coffee'], ['server:restart'])
  gulp.watch(files_concat.js, ['concat_js'])
  gulp.watch(files_concat.css, ['concat_css'])
  gulp.watch(["src/coffee/*.coffee"], ["compile-coffee"])
  gulp.watch(["src/jade/*.jade"], ["compile-jade"])
  gulp.watch(["src/js/*.js"], ["js"])
  gulp.watch(["src/css/*.css"], ["css"])
