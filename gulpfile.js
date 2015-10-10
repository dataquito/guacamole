// Include gulp
var gulp            = require('gulp');

// Include Our Plugins
var $               = require('gulp-load-plugins')({ lazy: true });

var paths = {
    html: ['app/*.html'],
    scripts: [
        'app/scripts/*.js',
        'lib/**/*.js'
    ],
    styles: [
        'app/styles/**/*.scss'
    ]
};


gulp.task('lint', function() {
    console.log('Linting the js code');
    return gulp.src(paths.scripts)
    .pipe($.print())
    .pipe($.jscs())
    .pipe($.jscs.reporter())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish' , { verbose: true }))
    .pipe($.jshint.reporter('fail'));
});
