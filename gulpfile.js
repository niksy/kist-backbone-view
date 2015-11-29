var gulp = require('gulp');
var mocha = require('gulp-mocha');
var fs = require('fs');
var browserify = require('browserify');

function bundle ( input, output, done ) {
	var file = fs.createWriteStream(output);
	var b = browserify();
	b.add(input);
	b.require(input, { expose: 'View' });
	b.require('jquery');
	b.bundle().pipe(file);
	file.on('finish', done);
}

function testCleanup () {
	fs.unlink('./test/build-bundle.js');
	fs.unlink('./test/build-bundle-virtual-dom.js');
}

gulp.task('test-base-bundle', function ( done ) {
	bundle('./index.js', './test/build-bundle.js', done);
});

gulp.task('test-virtual-dom-bundle', function ( done ) {
	bundle('./virtual-dom.js', './test/build-bundle-virtual-dom.js', done);
});

gulp.task('test-mocha', ['test-base-bundle', 'test-virtual-dom-bundle'], function () {
	return gulp
		.src('test/*.js')
		.pipe(mocha())
		.on('error', testCleanup);
});

gulp.task('test-cleanup', ['test-mocha'], function ( done ) {
	testCleanup();
	done();
});

gulp.task('test', ['test-cleanup']);
