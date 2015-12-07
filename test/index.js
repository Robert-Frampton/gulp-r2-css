var chai = require('chai');
var fs = require('fs');
var gulp = require('gulp');
var gulpR2 = require('../index.js');
var path = require('path');
require('mocha');

var assert = chai.assert;
var expect = chai.expect;

describe('gulp-R2-css', function() {
	describe('gulpR2()', function() {
		it('should ignore null files', function(done) {
			gulp.src(path.join(__dirname, 'assets', 'null.css'))
				.pipe(gulpR2())
				.pipe(gulp.dest(path.join(__dirname, 'assets', 'tmp')))
				.on('end', done);
		});

		it('should pass empty files', function(done) {
			var stream = gulp.src(path.join(__dirname, 'assets', 'empty.css'))
				.pipe(gulpR2())
				.pipe(gulp.dest(path.join(__dirname, 'assets', 'tmp')))
				.on('end', function() {
					expect(function() {
						fs.statSync(path.join(__dirname, 'assets', 'tmp', 'empty.css'));
					}).to.not.throw();

					done();
				});
		});

		it('should emit error on streamed file', function(done) {
			gulp.src(path.join(__dirname, 'assets', 'test.css'), {
					buffer: false
				})
				.pipe(gulpR2())
				.on('error', function (err) {
					assert.equal(err.message, 'Streaming not supported');

					done();
				});
		});

		it('should emit error when css is invalid and pass file', function(done) {
			gulp.src(path.join(__dirname, 'assets', 'broken.css'))
				.pipe(gulpR2())
				.on('error', function (err) {
					assert.equal(err.message, 'property missing \':\' near line 6:4');

					done();
				});
		});

		it('should convert css', function(done) {
			var stream = gulp.src(path.join(__dirname, 'assets', 'test.css'))
				.pipe(gulpR2())
				.pipe(gulp.dest(path.join(__dirname, 'assets', 'tmp')))
				.on('end', function() {
					expect(function() {
						var fileContents = fs.readFileSync(path.join(__dirname, 'assets', 'tmp', 'test.css'), 'utf8');

						assert.equal(fileContents, '#content{float:right;right:5px;margin-left:2px;padding:1px 4px 3px 2px;}.info{text-align:left;}');
					}).to.not.throw();

					done();
				});
		});
	});
});