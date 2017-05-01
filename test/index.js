var assert = require('assert');
var $ = require('jquery');
var View = require('../index');

describe('Basic', function () {

	it('should have instance with `getSubview`, `addSubview` and `removeSubviews` methods', function () {
		var view = new View();
		assert.equal(typeof view.getSubview, 'function');
		assert.equal(typeof view.addSubview, 'function');
		assert.equal(typeof view.removeSubviews, 'function');
		view.remove();
	});

	it('should have instance with 3 subviews after adding them', function () {
		var view = new View();
		view.addSubview(new View());
		view.addSubview(new View());
		view.addSubview(new View(), 'customKey');
		assert.equal(Object.keys(view.subviews).length, 3);
		view.remove();
	});

	it('should have instance with 1 subview with key "customKey"', function () {
		var view = new View();
		view.addSubview(new View(), 'customKey');
		assert.equal(view.getSubview('customKey') instanceof View, true);
		view.remove();
	});

	it('should have instance without any subviews after removing them with `removeSubviews`', function () {
		var view = new View();
		view.removeSubviews();
		assert.equal(Object.keys(view.subviews).length, 0);
		view.remove();
	});

	it('should have instance with 2 subviews after adding them again', function () {
		var view = new View();
		view.addSubview(new View());
		view.addSubview(new View());
		assert.equal(Object.keys(view.subviews).length, 2);
		view.remove();
	});

	it('should have instance where subview should render it’s subview placeholder with `getRenderPlaceholder`', function () {
		var view = new View();
		view.addSubview(new View({
			tagName: 'p',
			className: 'subviewPlaceholder'
		}), 'subviewPlaceholder');
		assert.equal(view.getSubview('subviewPlaceholder').getRenderPlaceholder(), '<div data-view-cid="' + view.getSubview('subviewPlaceholder').cid + '"></div>');
		view.remove();
	});

	it('should have instance which should properly render subview content with `assignSubview`', function () {
		var view = new View();
		view.addSubview(new View({
			tagName: 'p',
			className: 'subviewPlaceholder'
		}), 'subviewPlaceholder');
		view.render = function () {
			this.$el.html(view.getSubview('subviewPlaceholder').getRenderPlaceholder());
			view.assignSubview('subviewPlaceholder');
			return this;
		};
		assert.equal($(view.render().el).find('p.subviewPlaceholder').length, 1);
		view.remove();
	});

	it('should have instance without any subviews after removing them with `remove`', function () {
		var view = new View();
		view.remove();
		assert.equal(view.subviews, undefined); // eslint-disable-line no-undefined
	});

});
