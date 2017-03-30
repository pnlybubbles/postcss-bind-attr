# postcss-bind-attr
[![js-standard-style][standard-image]][standard-url]

Bound an attribute of your choosing to every selectors which specify tags.

## Usage

```javascript
const postcss = require('postcss')
const bindAttr = require('postcss-bind-attr')
const css = `
a.hello {
  & .world { color: red; }
}
`

const out = postcss()
  .use(bindAttr('bound-attr'))
  .process(css)
  .toString()

console.log(out)
// a[bound-attr].hello {
//   & .world[bound-attr] { color: red; }
// }
```

## Example

Attributes are not bound under `:root` pseudo selector.

#### input.css
```css
:root a {
  & .nested {}
}

.base {
  & .nested {}
}

a.with-class#with-id {}

a[with-attr='hello'] {}
```

#### output.css
```css
:root a {
  & .nested {}
}

.base[bound-attr] {
  & .nested[bound-attr] {}
}

a[bound-attr].with-class#with-id {}

a[bound-attr][with-attr='hello'] {}
```

## Installation

```sh
$ npm install postcss-bind-attr
```

## License
[MIT](https://tldrlegal.com/license/mit-license)

[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
