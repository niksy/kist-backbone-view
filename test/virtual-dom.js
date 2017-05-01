var assert = require('assert');
var $ = require('jquery');
var View = require('../virtual-dom');

describe('Virtual DOM', function () {

	var view, viewFromTemplate;
	var count = 0;

	function template ( cnt ) {
		return '<span class="test">' + cnt + '</span>';
	}

	it('should have instance with `renderDiff` method', function () {
		view = new View();
		assert.equal(typeof view.renderDiff, 'function');
	});

	it('should have instance which should have "span.test" element with "0" as content after render diffing', function () {
		var $el = $(template(count));
		view.renderDiff($el);
		assert.equal(view.$el.find('.test').length, 1);
		assert.equal(view.$el.find('.test').text(), '0');
		assert.equal(view.$el.find('.test1').length, 0);
	});

	it('should have instance which should have "span.test" element with "2" as content after subsequent render diffing', function () {
		var $el;
		count++;
		count++;
		$el = $(template(count));
		view.renderDiff($el);
		assert.equal(view.$el.find('.test').text(), '2');
	});

	it('should have instance which should render it’s view fully from template if `fromTemplate` is set to true', function () {
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
