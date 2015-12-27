var fs = require('fs');
var browserify = require('browserify');

/**
 * @param  {String}   input
 * @param  {Function} cb
 */
module.exports = function ( input, cb ) {
	var b = browserify();
	b.add(input);
	b.require(input, { expose: 'View' });
	b.require('jquery');
	b.on('bundle', function ( stream ) {
		var content = '';
		stream.on('data', function ( a ) {
			content += a.toString();
		});
		stream.on('end', function () {
			cb.call(null, content);
		});
	});
	b.bundle();
};
