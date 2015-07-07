var gulp = require('gulp'),
    addStream = require('add-stream'),
    webserver = require('gulp-webserver'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    uglifyjs = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    sass = require('gulp-sass') ,
    ngTemplateCache = require('gulp-angular-templatecache');

var paths = {
    // destination (output) folders
    dest: 'public',
    destScripts: 'public/js',
    destStyles: 'public/css',
    destAssets: 'public/assets',
    // source files
    styles: 'source/css',
    assets: ['source/assets/**/*'],
    scripts: ['source/**/*.js'],
    templates: ['source/**/*.html', '!source/index.html'],
    main_page: ['source/index.html']
};

gulp.task('vendor.scripts', function() {
    var files = [
        'node_modules/angular/angular.js',
        'node_modules/angular-route/angular-route.min.js'
    ];
    return gulp.src(files)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.destScripts));
});

// create index.html and includes all referenced templates

gulp.task('main_page', function() {
    return gulp.src(paths.main_page)
        .pipe(gulp.dest(paths.dest));
});

// copy all assets into the destination directory

gulp.task('assets', function() {
    return gulp.src(paths.assets)
        .pipe(gulp.dest(paths.destAssets));
});

// concatenate all our source scripts into a single file
// this is basically OUR ANGULAR APP

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(addStream.obj( prepareTemplates() ))
        .pipe(concat('app.js'))
        //.pipe(uglifyjs())
        .pipe(gulp.dest(paths.destScripts));
});

gulp.task('styles', function() {
    return gulp.src(paths.styles + '/layout.scss')
         .pipe(sass() )
         .pipe(gulp.dest( paths.destStyles )); 
});

gulp.task('build', ['vendor.scripts', 'scripts', 'assets', 'styles', 'main_page']);

// TODO : create production build (with minimized Angular and uglified source code)

gulp.task('server', ['build'], function() {
    gulp.watch(paths.main_page, ['main_page']);
    gulp.watch([paths.styles + "/**/*.scss"], ['styles']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.templates, ['scripts']);

    var options = {
        livereload: true,
        open: false
    };
    return gulp.src(paths.dest)
        .pipe(webserver(options));
});

gulp.task('default', ['build']);

// helper functions

// compile Angular templates from views folder

function prepareTemplates() {
    return gulp.src(paths.templates)
        .pipe(ngTemplateCache( 'templates.js', { module : 'templates', standalone: true }))
        .pipe(gulp.dest(paths.destScripts));
}