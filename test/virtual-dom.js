var assert = require('assert');
var $ = require('jquery');
var View = require('../virtual-dom');

describe('Virtual DOM', function () {

	var count = 0;

	function template ( cnt ) {
		return '<span class="test">' + cnt + '</span>';
	}

	it('should have instance with `renderDiff` method', function () {
		var view = new View();
		assert.equal(typeof view.renderDiff, 'function');
		view.remove();
	});

	it('should have instance which should have "span.test" element with "0" as content after render diffing', function () {
		var view = new View();
		var $el = $(template(count));
		view.renderDiff($el);
		assert.equal(view.$el.find('.test').length, 1);
		assert.equal(view.$el.find('.test').text(), '0');
		assert.equal(view.$el.find('.test1').length, 0);
		view.remove();
	});

	it('should have instance which should have "span.test" element with "2" as content after subsequent render diffing', function () {
		var view = new View();
		var $el;
		count++;
		count++;
		$el = $(template(count));
		view.renderDiff($el);
		assert.equal(view.$el.find('.test').text(), '2');
		view.remove();
	});

	it('should have instance which should render it’s view fully from template if `fromTemplate` is set to true', function () {
		var view = new View({ fromTemplate: true });
		view.renderDiff(template(count));
		count++;
		view.renderDiff(template(count));
		assert.equal(view.$el.is('span.test'), true);
		assert.equal(view.$el.text(), '3');
		view.remove();
	});

});
