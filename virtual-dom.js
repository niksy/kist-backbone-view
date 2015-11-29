var View = require('./');
var parser = require('vdom-parser');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');

module.exports = View.extend({

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
		return this;
	}

});
