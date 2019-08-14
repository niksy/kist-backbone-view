![Deprecated project](https://img.shields.io/badge/status-deprecated-red.svg)

**This project is deprecated.**

---

# kist-backbone-view

[![Build Status][ci-img]][ci] [![BrowserStack Status][browserstack-img]][browserstack]

Extends [`Backbone.View`][backbone-view] with useful features.

Features:

* Subview managment: adding, getting and removing
* [Optional Virtual DOM support for rendering][virtual-dom-explanation]

## Install

```sh
npm install kist-backbone-view --save
```

## Usage

Basic usage.

```js
const View = require('kist-backbone-view');

const view = View.extend({
	initialize: function () {
		this.addSubview(new View());
		this.addSubview(new View(), 'customKey');
	},
	getCustomKeyView: function () {
		return this.getSubview('customKey');
	}
});
```

Render placeholder and view assign usage.

```js
const View = require('kist-backbone-view');

const view = View.extend({
	initialize: function () {
		this.addSubview(new View(), 'customKey');
	},
	render: function () {
		this.$el.html(this.template({
			customKeyComponent: this.getSubview('customKey').getRenderPlaceholder()
		}));
		this.assignSubview('customKey');
	}
});
```

Virtual DOM variant usage.

```js
const View = require('kist-backbone-view/virtual-dom');

const view = View.extend({
	template: function ( data ) {
		return `<span>${data.count}</span>`;
	},
	render: function () {
		this.renderDiff(this.template({
			count: 42
		}));
		return this;
	}
});
```

## API

### addSubview(view, key)

Adds subview to current view.

#### view

Type: `Backbone.View`

Subview to add to current view.

#### key

Type: `String|Number`

Subview key so it can be easily identified in subview collection. If undefined, 
view’s `cid` property will be used.

### getSubview(key)

Gets subview referenced by key.

#### key

Type: `String|Number`

Key which is used to reference subview.

### removeSubviews

Removes all subviews from current view.

### getRenderPlaceholder

Returns view’s placeholder element which will be used in resolving for
`assignSubview`.

### assignSubview(key)

Replaces view’s render placeholder with real content (returned when running
`render` method).

If you’re using `renderDiff` for content rendering, explicit
call for this method is unecessary—it will be called for every subview which
rendered it’s placeholder with `getRenderPlaceholder`.

#### key

Type: `String|Number`

Key which is used to reference subview.

### renderDiff(content)

Renders [`virtual-dom`][virtual-dom] patches to current view’s element.

Available only for [Virtual DOM implementation][virtual-dom-variant].

#### content

Type: `String|Number|Element|jQuery`

Content which should be diffed with current element and will be used to patch it.

### fromTemplate

Type: `Boolean`

Should this view be fully constructed from template. Useful when you want to
completely hold view representation inside template files (default Backbone
behavior is to have root element outside template).

Available only for [Virtual DOM implementation][virtual-dom-variant].

## Virtual DOM

Optionally you can use [`virtual-dom`][virtual-dom] implementation of this module 
to achieve performant rendering of your content. The difference in applying 
template content is very subtle—instead of applying new content to DOM element
directly, you use convenient `renderDiff` method.

## Browser support

Tested in IE9+ and all modern browsers.

## Test

For local automated tests, run `npm run test:automated:local` (append `:watch` for watcher support).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[ci]: https://travis-ci.org/niksy/kist-backbone-view
[ci-img]: https://travis-ci.org/niksy/kist-backbone-view.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://www.browserstack.com/automate/badge.svg?badge_key=UzVwazZSWHMxakttd2x5M1RZSE1adm1mYjRrM2FvN1dFdTh2eC9hQnNWTT0tLWFIYSttN21TMXFYVTlJOU9nSjJDYXc9PQ==--d68db6abc22b1c36559784b90651cc1dd07d0f43
[virtual-dom-explanation]: #virtual-dom
[virtual-dom]: https://github.com/Matt-Esch/virtual-dom
[virtual-dom-variant]: https://github.com/niksy/kist-backbone-view/blob/master/virtual-dom.js
[backbone-view]: http://backbonejs.org/#View
