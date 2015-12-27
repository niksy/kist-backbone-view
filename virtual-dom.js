var View = require('./');
var _ = require('underscore');
var parser = require('vdom-parser');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');

module.exports = View.extend({

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
		var newTree, patches;
		if ( !this._vdomTree ) {
			this.$el.html(content);
			this._vdomTree = parser(this.$el.clone()[0]);
		} else {
			newTree = parser(this.$el.clone().html(content)[0]);
			patches = diff(this._vdomTree, newTree);
			patch(this.el, patches);
			this._vdomTree = newTree;
		}
		_.each(this.subviews, function ( view, key ) {
			if ( view._usesRenderPlaceholder ) {
				this.reassignSubview(key);
			}
		}, this);
		return this;
	}

});
