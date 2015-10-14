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
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var csso = require('gulp-csso');

var paths = {
    html: ['app/*.html'],
    scripts: [
        'app/scripts/*.js',
        'lib/**/*.{jsx,js}'
    ],
    styles: [
        'app/styles/**/*.scss'
    ],
    json: [
        'app/json/*.*'
    ]
};

gulp.task('html', function() {
    return gulp.src(paths.html)
    .pipe(gulp.dest('./dist/'));
});

gulp.task('json', function() {
    return gulp.src(paths.json)
    .pipe(gulp.dest('./dist/json/'));
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

gulp.task('optimize-css', function() {
    return gulp.src('dist/styles/app.css')
    .pipe(csso())
    .pipe(rename('guacamole.min.css'))
    .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('optimize-bundle', function() {
    return gulp.src('dist/scripts/bundle.js')
    .pipe(uglify())
    .pipe(rename('guacamole.min.js'))
    .pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('optimize', ['optimize-bundle', 'optimize-css']);

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

gulp.task('build', ['browser-sync', 'styles', 'scripts', 'wire-dependencies', 'json']);

gulp.task('default', ['build'], function() {
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.json, ['json']);
    gulp.watch(paths.html, ['wire-dependencies', 'bs-reload']);
});
