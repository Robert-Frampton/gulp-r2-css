var gutil = require('gulp-util');
var R2 = require('R2');
var StringDecoder = require('string_decoder').StringDecoder;
var through = require('through2');

var decoder = new StringDecoder('utf8');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-R2-css';

function gulpR2() {
	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isBuffer()) {
			file.contents = swapBuffer(file.contents);

			cb(null, file);
		}

		if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME,  'Streaming not supported'));

			return cb();
		}
	});
}

function swapBuffer(buffer) {
	var swapped = R2.swap(decoder.write(buffer));

	return new Buffer(swapped);
}

module.exports = gulpR2;