'use strict';

const Backbone = require('backbone');
const _ = require('underscore');
const eventNamespace = '.backbone';

module.exports = Backbone.View.extend({

	$html: Backbone.$('html'),
	$body: Backbone.$('body'),
	$doc: Backbone.$(document),
	$win: Backbone.$(window),

	childrenEl: {},

	constructor: function ( options ) {
		this.subviews = {};
		Backbone.View.prototype.$body = (Backbone.View.prototype.$body && Backbone.View.prototype.$body.length) ? Backbone.View.prototype.$body : Backbone.$('body');
		_.extend(this, _.pick(options, ['childrenEl']));
		Backbone.View.prototype.constructor.apply(this, arguments);
	},

	_ensureElement: function () {
		this.ens = `${eventNamespace}.${this.cid}`;
		Backbone.View.prototype._ensureElement.apply(this, arguments);
	},

	setElement: function () {
		Backbone.View.prototype.setElement.apply(this, arguments);
		this.cacheChildrenEl();
		return this;
	},

	/**
	 * @param  {Object} childrenEl
	 */
	cacheChildrenEl: function ( childrenEl ) {

		childrenEl = childrenEl || this.childrenEl;

		Object.keys(childrenEl)
			.forEach(( key ) => {
				const selector = this.$(childrenEl[key]);
				this[`$${key}`] = selector;
			});

	},

	/**
	 * Returns subview by supplied key
	 *
	 * @param  {String|Number} key
	 *
	 * @return {Backbone.View}
	 */
	getSubview: function ( key ) {
		return this.subviews[key];
	},

	/**
	 * Adds a subview to the current view, which will
	 * ensure its removal when this view is removed,
	 * or when view.removeSubviews is called
	 *
	 * @param {Backbone.View} view
	 * @param {String|Number} key
	 *
	 * @return {Backbone.View}
	 */
	addSubview: function ( view, key ) {
		if ( !(view instanceof Backbone.View) ) {
			throw new TypeError('Subview must be a Backbone.View');
		}
		if ( _.isUndefined(key) ) {
			key = view.cid;
		}
		this.subviews[key] = view;
		return view;
	},

	/**
	 * Removes any subviews associated with this view
	 * by `addSubview`, which will in-turn remove any
	 * children of those views, and so on
	 *
	 * @return {Backbone.View}
	 */
	removeSubviews: function () {
		_.invoke(this.subviews, 'remove');
		for ( let key in this.subviews ) {
			if ( _.has(this.subviews, key) ) {
				delete this.subviews[key];
			}
		}
		return this;
	},

	/**
	 * Get subview placeholder
	 *
	 * @return {String}
	 */
	getRenderPlaceholder: function () {
		return `<div data-view-cid="${this.cid}"></div>`;
	},

	/**
	 * Replace subview placeholder with its real content
	 *
	 * @param  {String|Number} key
	 */
	assignSubview: function ( key ) {
		const view = this.getSubview(key);
		this.$(`[data-view-cid="${view.cid}"]`).replaceWith(view.render().el);
	},

	/**
	 * Extends the view's remove, by calling `removeSubviews`
	 * if any subviews exist
	 *
	 * @return {Backbone.View}
	 */
	remove: function () {
		this.removeSubviews();
		delete this.subviews;
		return Backbone.View.prototype.remove.apply(this, arguments);
	}

});
