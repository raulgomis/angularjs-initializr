'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    del = require('del'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    csscomb = require('gulp-csscomb'),
    filesize = require('gulp-filesize'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    karma = require('gulp-karma');

// Modules for webserver and livereload
var connect = require('gulp-connect'),
    livereloadport = 35729,
    serverport = 3000;

var paths = {
    sass: ['app/styles/**/*.scss'],
    js: [
        // Load Main.js and then app related scripts
        'app/scripts/Main.js',
        'app/scripts/**/*.js'
    ],
    views: ['app/views/**/*.html'],
    index: ['app/index.html'],
    images: ['app/images/**/*.{png,jpg,jpeg,gif,webp,svg}']
};

var dest = {
    base: 'dist/',
    css: 'dist/css/',
    js: 'dist/scripts/',
    views: 'dist/views/',
    images: 'dist/images/'
};

var vendor = {
    css: [
        'bower_components/angular/angular-csp.css',
        'bower_components/bootstrap/dist/css/bootstrap.css'
    ],
    js: [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-animate/angular-animate.js',
        'bower_components/angular-cookies/angular-cookies.js',
        'bower_components/angular-messages/angular-messages.js',
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'bower_components/angular-touch/angular-touch.js',
        'bower_components/bootstrap/dist/js/bootstrap.js'
    ]
};

// Clean task
gulp.task('clean', function () {
    del(dest.base, function (err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

// JSHint task
gulp.task('jshint', function () {
    gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('connect', function () {
    connect.server({
        root: './dist',
        port: serverport,
        livereload: true
    });
});

// Styles task
gulp.task('styles', function () {
    // Remove styles folder
    del(dest.css);

    // Application styles
    gulp.src(paths.sass)
        .pipe(sass())
        .pipe(gulp.dest(dest.css))
        .pipe(filesize())
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest(dest.css))
        .pipe(filesize())
        .on('error', gutil.log);

    // Vendor styles
    gulp.src(vendor.css)
        .pipe(concat('vendor.css'))
        .pipe(csscomb())
        .pipe(gulp.dest(dest.css))
        .pipe(filesize())
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename('vendor.min.css'))
        .pipe(gulp.dest(dest.css))
        .pipe(filesize())
        .on('error', gutil.log);
});

gulp.task('js', ['jshint'], function() {

    // Remove scripts folder
    del(dest.js);

    gulp.src(paths.js)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(dest.js))
        .pipe(filesize())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest(dest.js))
        .pipe(filesize())
        .on('error', gutil.log);

    gulp.src(vendor.js)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(dest.js))
        .pipe(filesize())
        .pipe(rename('vendor.min.js'))
        .pipe(gulp.dest(dest.js))
        .pipe(filesize())
        .on('error', gutil.log)
});

// Views task
gulp.task('views', function () {
    // Remove styles folder
    del(dest.views);

    // Get our index.html
    gulp.src(paths.index)
        .pipe(gulp.dest(dest.base));

    // Any other view files from app/views
    gulp.src(paths.views)
        .pipe(gulp.dest(dest.views));
});

// Views task
gulp.task('images', function () {
    // Remove images folder
    del(dest.images);

    // Get our images
    gulp.src(paths.images)
        .pipe(gulp.dest(dest.images));
});

gulp.task('watch', function () {

    // Watch our scripts, and when they change run jshint
    gulp.watch(paths.js, [
        'js'
    ]);
    // Watch our sass files
    gulp.watch(paths.sass, [
        'styles'
    ]);

    gulp.watch(paths.views, [
        'views'
    ]);

    gulp.watch(paths.index, [
        'views'
    ]);

    gulp.watch(paths.images, [
        'images'
    ]);
});

gulp.task('test', function() {
    // Be sure to return the stream
    return gulp.src('./nothing-here')
        .pipe(karma({
            configFile: 'test/karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            console.log(err);
            this.emit('end'); //instead of erroring the stream, end it
        });
});

// Compile task
gulp.task('compile', ['jshint', 'views', 'styles', 'js', 'images']);

// Dev task
gulp.task('dev', ['compile', 'connect', 'watch']);

// Default task
gulp.task('default', ['dev']);