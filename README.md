# kist-backbone-view

[![Build Status][ci-img]][ci]

Additions to [`Backbone.View`][backbone-view].

Features:

* Subview managment: adding, getting and removing
* [Optional Virtual DOM support for rendering][virtual-dom-explanation]

## Installation

```sh
npm install kist-backbone-view --save
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

### renderDiff(content)

Renders [`virtual-dom`][virtual-dom] patches to current view’s element. Available 
only as part of [virtual-dom variant of this module][virtual-dom-variant].

#### content

Type: `String|Number|Element|jQuery`

Content which should be diffed with current element and will be used to patch it.

## Virtual DOM

Optionally you can use [`virtual-dom`][virtual-dom] implementation of this module 
to achieve performant rendering of your content. The difference in applying 
template content is very subtle—instead of applying new content to DOM element
directly, you use convenient `renderDiff` method.

```js
/* Before */
render: function () {
	this.$el.html(this.template(data));
	return this;
}

/* After */
render: function () {
	this.renderDiff(this.template(data));
	return this;
}
```

## Examples

Basic usage.

```js
var View = require('kist-backbone-view');

var view = View.extend({
		
	initialize: function () {
		this.addSubview(new View());
		this.addSubview(new View(), 'customKey');
	},

	getCustomKeyView: function () {
		return this.getSubview('customKey');
	}

});
```

Virtual DOM variant usage.

```js
var View = require('kist-backbone-view/virtual-dom');

var view = View.extend({

	template: function ( data ) {
		return '<span class="foo">' + data.count + '</span>';
	},

	render: function () {
		this.renderDiff(this.template({ count: 42 }));
		return this;
	}

});
```

## Browser support

Tested in IE8+ and all modern browsers.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[ci]: https://travis-ci.org/niksy/kist-backbone-view
[ci-img]: https://travis-ci.org/niksy/kist-backbone-view.svg
[virtual-dom-explanation]: #virtual-dom
[virtual-dom]: https://github.com/Matt-Esch/virtual-dom
[virtual-dom-variant]: https://github.com/niksy/kist-backbone-view/blob/master/virtual-dom.js
[backbone-view]: http://backbonejs.org/#View
