var View = require('./');
var Backbone = require('backbone');
var _ = require('underscore');
var parser = require('vdom-parser');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');

/**
 * @param  {String|Number|Element|jQuery} template
 *
 * @return {jQuery}
 */
function getElementFromTemplate ( template ) {
	template = Backbone.$(template);
	if ( template.length !== 1 ) {
		throw new Error('View must contain only one parent element.');
	}
	return template;
}

module.exports = View.extend({

	constructor: function ( options ) {
		_.extend(this, _.pick(options, 'fromTemplate'));
		View.prototype.constructor.apply(this, arguments);
	},

	/**
	 * Get subview placeholder
	 *
	 * @return {String}
	 */
	getRenderPlaceholder: function () {
		this._usesRenderPlaceholder = true;
		return View.prototype.getRenderPlaceholder.apply(this, arguments);
	},

	/**
	 * Renders patched content with Virtual DOM
	 *
	 * @param  {String|Number|Element|jQuery} content
	 *
	 * @return {Backbone.View}
	 */
	renderDiff: function ( content ) {
		var newTree, newEl, patches;
		if ( !this._vdomTree ) {
			// If we’re getting the whole view DOM from template, we first
			// check if there is only one parent element; if it’s not,
			// inform implementor to correct that, otherwise set `this.$el` to
			// the parent element from template
			if ( this.fromTemplate ) {
				this.setElement(getElementFromTemplate(content)[0]);
			} else {
				this.$el.html(content);
			}
			this._vdomTree = parser(this.$el.clone()[0]);
		} else {
			if ( this.fromTemplate ) {
				newEl = getElementFromTemplate(content)[0];
			} else {
				newEl = this.$el.clone().html(content)[0];
			}
			newTree = parser(newEl);
			patches = diff(this._vdomTree, newTree);
			patch(this.el, patches);
			this._vdomTree = newTree;
		}
		_.each(this.subviews, function ( view, key ) {
			if ( view._usesRenderPlaceholder ) {
				this.assignSubview(key);
			}
		}, this);
		return this;
	}

});
