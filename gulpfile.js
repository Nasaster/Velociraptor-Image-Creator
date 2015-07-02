var gulp = require('gulp'),
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
    // source files
    styles: 'source/css',
    scripts: ['source/**/*.js'],
    templates: ['source/**/*.html', '!source/index.html'],
    main_page: ['source/index.html']
};

gulp.task('vendor.scripts', function() {
    var files = [
        'node_modules/angular/angular.min.js',
        'node_modules/angular-route/angular-route.min.js'
    ];
    return gulp.src(files)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.destScripts));
});

gulp.task('main_page', function() {
    return gulp.src(paths.main_page)
        .pipe(gulp.dest(paths.dest));
});

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(concat('app.js'))
        //.pipe(uglifyjs())
        .pipe(gulp.dest(paths.destScripts));
});

gulp.task('styles', function() {
    return gulp.src(paths.styles + '/layout.scss')
         .pipe(sass() )
         .pipe(gulp.dest( paths.destStyles )); 
});

gulp.task('templates', function() {
    return gulp.src(paths.templates)
        .pipe(ngTemplateCache())
        .pipe(gulp.dest(paths.dest));
});

gulp.task('build', ['vendor.scripts', 'scripts', 'styles', 'templates', 'main_page']);

gulp.task('server', ['build'], function() {
    gulp.watch(paths.main_page, ['main_page']);
    gulp.watch([paths.styles + "/**/*.scss"], ['styles']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.templates, ['templates']);

    var options = {
        livereload: true,
        open: false
    };
    return gulp.src(paths.dest)
        .pipe(webserver(options));
});

gulp.task('default', ['build']);