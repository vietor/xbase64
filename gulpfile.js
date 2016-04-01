"use strict";

var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');
var mocha = require('gulp-mocha');

gulp.task('format-js', function() {
    gulp.src('./xbase64.js')
        .pipe(prettify({
            config: '.jsbeautifyrc',
            mode: 'VERIFY_AND_WRITE'
        }))
        .pipe(gulp.dest('./'));

    gulp.src('./test/**/*.js')
        .pipe(prettify({
            config: '.jsbeautifyrc',
            mode: 'VERIFY_AND_WRITE'
        }))
        .pipe(gulp.dest('./test'));
});

gulp.task('test', function() {
    gulp.src('./test/*.js')
        .pipe(mocha({
            timeout: 10000,
            bail: true
        }))
        .once('end', function() {
            process.exit();
        });
});

gulp.task('default', ['format-js', 'test']);
