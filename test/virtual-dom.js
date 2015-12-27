/* jshint mocha:true */

var assert = require('assert');
var browser = require('./helpers/browser');

describe('Virtual DOM', function () {

	var view, viewFromTemplate;
	var View;
	var $;
	var count = 0;

	function template ( count ) {
		return '<span class="test">' + count + '</span>';
	}

	before(function ( done ) {
		browser(require.resolve('../virtual-dom'), function ( w ) {
			$ = w.require('jquery');
			View = w.require('View');
			done();
		});
	});

	it('instance should have `renderDiff` method', function () {
		view = new View();
		assert.equal(typeof view.renderDiff, 'function');
	});

	it('instance should have "span.test" element with "0" as content after render diffing', function () {
		var $el = $(template(count));
		view.renderDiff($el);
		assert.equal(view.$el.find('.test').length, 1);
		assert.equal(view.$el.find('.test').text(), '0');
		assert.equal(view.$el.find('.test1').length, 0);
	});

	it('instance should have "span.test" element with "2" as content after subsequent render diffing', function () {
		count++;
		count++;
		var $el = $(template(count));
		view.renderDiff($el);
		assert.equal(view.$el.find('.test').text(), '2');
	});

	it('instance should render it’s view fully from template if `fromTemplate` is set to true', function () {
		viewFromTemplate = new View({ fromTemplate: true });
		viewFromTemplate.renderDiff(template(count));
		count++;
		viewFromTemplate.renderDiff(template(count));
		assert.equal(viewFromTemplate.$el.is('span.test'), true);
		assert.equal(viewFromTemplate.$el.text(), '3');
	});

	after(function () {
		view.remove();
	});

});
