var jsdom = require('jsdom');
var fs = require('fs');
var bundle = require('./bundle');

/**
 * @param  {String}   file
 * @param  {Function} cb
 */
module.exports = function ( file, cb ) {
	bundle(file, function ( content ) {
		jsdom.env({
			html: '<html><body></body></html>',
			src: content,
			done: function ( err, window ) {
				global.window = window;
				cb.call(null, window);
			}
		});
	});
};
