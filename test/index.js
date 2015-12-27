/* jshint mocha:true */

var assert = require('assert');
var jsdom = require('jsdom');
var fs = require('fs');

function browser ( file, cb ) {
	jsdom.env({
		html: '<html><body></body></html>',
		scripts: [__dirname + '/' + file],
		done: function ( err, window ) {
			global.window = window;
			cb.call(null, window);
		}
	});
}

describe('Base', function () {

	var view;
	var View;
	var $;

	before(function ( done ) {
		browser('build-bundle.js', function ( w ) {
			$ = w.require('jquery');
			View = w.require('View');
			done();
		});
	});

	it('instance should have `getSubview`, `addSubview` and `removeSubviews` methods', function () {
		view = new View();
		assert.equal(typeof view.getSubview, 'function');
		assert.equal(typeof view.addSubview, 'function');
		assert.equal(typeof view.removeSubviews, 'function');
	});

	it('instance should have 3 subviews after adding them', function () {
		view.addSubview(new View());
		view.addSubview(new View());
		view.addSubview(new View(), 'customKey');
		assert.equal(Object.keys(view.subviews).length, 3);
	});

	it('instance should have 1 subview with key "customKey"', function () {
		assert.equal(view.getSubview('customKey') instanceof View, true);
	});

	it('instance should not have any subviews after removing them with `removeSubviews`', function () {
		view.removeSubviews();
		assert.equal(Object.keys(view.subviews).length, 0);
	});

	it('instance should have 2 subviews after adding them again', function () {
		view.addSubview(new View());
		view.addSubview(new View());
		assert.equal(Object.keys(view.subviews).length, 2);
	});

	it('instance subview should render it’s subview placeholder with `getRenderPlaceholder`', function () {
		view.addSubview(new View({ tagName: 'p', className: 'subviewPlaceholder' }), 'subviewPlaceholder');
		assert.equal(view.getSubview('subviewPlaceholder').getRenderPlaceholder(), '<div data-view-cid="' + view.getSubview('subviewPlaceholder').cid + '"></div>');
	});

	it('instance should properly render subview content with `assignSubview`', function () {
		view.render = function () {
			this.$el.html(view.getSubview('subviewPlaceholder').getRenderPlaceholder());
			view.assignSubview('subviewPlaceholder');
			return this;
		};
		assert.equal($(view.render().el).find('p.subviewPlaceholder').length, 1);
	});

	it('instance should not have any subviews after removing them with `remove`', function () {
		view.remove();
		assert.equal(view.subviews, undefined);
	});

});

describe('Virtual DOM', function () {

	var view, viewFromTemplate;
	var View;
	var $;
	var count = 0;

	function template ( count ) {
		return '<span class="test">' + count + '</span>';
	}

	before(function ( done ) {
		browser('build-bundle-virtual-dom.js', function ( w ) {
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
