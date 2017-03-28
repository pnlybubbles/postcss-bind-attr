# postcss-bind-attr

Bound an attribute of your choosing to every selectors which specify tags.

## Usage

```javascript
const bindAttr = require('postcss-bind-attr');
const css = `
a.hello {
  & .world { color: red; }
}
`;

const out = postcss()
  .use(bindAttr('bound-attr'))
  .process(css)
  .toString();

console.log(out);
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
