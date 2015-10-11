// Include gulp
var gulp = require('gulp');
// Include Our Plugins
var $ = require('gulp-load-plugins')({
    lazy: true
});
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');

var paths = {
    html: ['app/*.html'],
    scripts: [
        'app/scripts/*.js',
        'lib/**/*.{jsx,js}'
    ],
    styles: [
        'app/styles/**/*.scss'
    ]
};

gulp.task('html', function() {
    return gulp.src(paths.html)
    .pipe(gulp.dest('./dist/'));
});

gulp.task('styles', function() {
    return gulp.src(paths.styles)
    .pipe($.plumber())
    .pipe($.less({
        paths: './bower_components/bootstrap/less/' 
    }))
    .pipe(gulp.dest('dist/styles/'));
});

gulp.task('lint', function() {
    console.log('Linting the js code');
    return gulp.src(paths.scripts)
    .pipe($.print())
    .pipe($.jscs())
    .pipe($.jscs.reporter())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish' , {verbose: true}))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('scripts', function() {
    return browserify({
        entries: 'app/scripts/main.js',
        extensions: ['.jsx'],
        debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/scripts/'))
    .on('end', function(){
        browserSync.reload();
    });
});


gulp.task('wire-dependencies', ['html'], function() {
    var config = {
        bowerJson: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../..'
    };
    var wiredep = require('wiredep').stream;
    return gulp.src(paths.html)
    .pipe(wiredep(config))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './dist/',
            routes: {
                "/bower_components": "bower_components"
            }
        }
    });
});

gulp.task('build', ['browser-sync', 'styles', 'scripts', 'wire-dependencies']);

gulp.task('default', ['build'], function() {
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.html, ['wire-dependencies', 'bs-reload']);
});
