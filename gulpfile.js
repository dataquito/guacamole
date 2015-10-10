// Include gulp
var gulp            = require('gulp');
// Include Our Plugins
var jshint          = require('gulp-jshint');
var sass            = require('gulp-ruby-sass');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var rename          = require('gulp-rename');
var notify          = require('gulp-notify');
var minifycss       = require('gulp-minify-css');
var babel           = require('gulp-babel');
var useref          = require('gulp-useref');
var browserSync     = require('browser-sync');
var browserify      = require('browserify');
var source          = require('vinyl-source-stream');
var react           = require('gulp-react');
var reactify        = require('reactify');
var gulpFilter      = require('gulp-filter');
var autoprefixer    = require('gulp-autoprefixer');

var paths = {
    html: ['app/*.html'],
    scripts: [
        'app/scripts/*.js',
        'lib/**/*.js'
    ],
    styles: [
        'app/styles/**/*.scss'
    ]
}

// var path = {
//     HTML: ['app/*.html'],
//     JS:   [ 'app/scripts/**/*.js',
//         'app/scripts/*.js',
//         'index.js',
//         'lib/*.js',
//         'lib/**/*.js',
//     ],
//     CSS:  [ 'app/styles/**/*.css',
//         'app/styles/*.css',
//         'app/styles/**/*.scss',
//         'app/styles/*.scss',
//     ]
// };

// gulp.task('browser-sync', function() {
//     browserSync({
//         server: {
//             baseDir: "./dist/"
//         }
//     });
// });

// gulp.task('bs-reload', function () {
//     browserSync.reload();
// });

// gulp.task('lint', function() {
//     return gulp.src('js/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('default'));
// });

// gulp.task('styles', function() {
//     return sass('app/styles',{
//         style: 'expanded',
//         precision: 10,
//         loadPath: ['app/bower_components/bootstrap-sass-official/assets/stylesheets/_bootstrap.scss']
//     })
//     .pipe(autoprefixer('last 1 version'))
//     .pipe(concat('application.css'))
//     .pipe(rename({suffix: '.min'}))
//     // .pipe(minifycss())
//     .pipe(gulp.dest('dist/styles'))
//     .pipe(notify({ message: 'sass & minify transformation done' }));
// });

// gulp.task('html', function(){
//     return gulp.src(path.HTML)
//     // .pipe(useref.assets())
//     // .pipe(useref.assets().restore())
//     // .pipe(useref())
//     .pipe(gulp.dest('dist'));
// });

// gulp.task('bower', function(){
//     gulp.src('app/bower_components/**/*.js',{
//         base: 'app/bower_components'
//     })
//     .pipe(gulp.dest('dist/bower_components'));
// });

// var bundler = browserify({
//     entries: ['app/scripts/main.js'],
//     paths: ['lib'],
//     debug: true,
//     insertGlobals: true,
//     cache: {},
//     packageCache: {},
//     fullPaths: true
// });

// function bundle(){
//     return bundler.bundle()
//     .pipe(source('application.js'))
//     .pipe(gulp.dest('dist/scripts'))
//     .on('end', function(){
//         browserSync.reload();
//     });
// }

// gulp.task('scripts', bundle);

// gulp.task('build', ['browser-sync','styles','scripts','html','bower']);

// gulp.task('default', ['build'] , function(){
//     gulp.watch(path.CSS,  ['styles']);
//     gulp.watch(path.JS,   ['scripts']);
//     gulp.watch(path.HTML, ['html','bs-reload']);
// });
