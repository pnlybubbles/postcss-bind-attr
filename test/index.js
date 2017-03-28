const bindAttr = require('../');
const transform = bindAttr.transform;
const isRoot = bindAttr.isRoot;
const ancestors = bindAttr.ancestors;
const postcss = require('postcss');
const parser = require('postcss-selector-parser');
const test = require('tape');
const path = require('path');
const fs = require('fs');

test('tag without postcss', (t) => {
  const attr = 'bound-attr';
  const expected = `a[${attr}]`;
  const css = 'a';
  const out = parser(transform(attr)).process(css).result;
  t.equal(out, expected);
  t.end();
});

test('tag', (t) => {
  const attr = 'bound-attr';
  const expected = `a[${attr}] {}`;
  const css = 'a {}';
  const out = postcss().use(bindAttr(attr)).process(css).toString();
  t.equal(out, expected);
  t.end();
});

test('multiple tags without postcss', (t) => {
  const attr = 'bound-attr';
  const expected = `h1[${attr}] h2[${attr}] h3[${attr}]`;
  const css = 'h1 h2 h3';
  const out = parser(transform(attr)).process(css).result;
  t.equal(out, expected);
  t.end();
});

test('multiple tags', (t) => {
  const attr = 'bound-attr';
  const expected = `h1[${attr}] h2[${attr}] h3[${attr}] {}`;
  const css = 'h1 h2 h3 {}';
  const out = postcss().use(bindAttr(attr)).process(css).toString();
  t.equal(out, expected);
  t.end();
});

test('group tags without postcss', (t) => {
  const attr = 'bound-attr';
  const expected = `h1[${attr}], h2[${attr}], h3[${attr}]`;
  const css = 'h1, h2, h3';
  const out = parser(transform(attr)).process(css).result;
  t.equal(out, expected);
  t.end();
});

test('group tags', (t) => {
  const attr = 'bound-attr';
  const expected = `h1[${attr}], h2[${attr}], h3[${attr}] {}`;
  const css = 'h1, h2, h3 {}';
  const out = postcss().use(bindAttr(attr)).process(css).toString();
  t.equal(out, expected);
  t.end();
});

test('ids classes attributes without postcss', (t) => {
  const attr = 'bound-attr';
  const expected = `#id[${attr}] .class[${attr}] [attr][${attr}]`;
  const css = '#id .class [attr]';
  const out = parser(transform(attr)).process(css).result;
  t.equal(out, expected);
  t.end();
});

test('ids classes attributes', (t) => {
  const attr = 'bound-attr';
  const expected = `#id[${attr}] .class[${attr}] [attr][${attr}] {}`;
  const css = '#id .class [attr] {}';
  const out = postcss().use(bindAttr(attr)).process(css).toString();
  t.equal(out, expected);
  t.end();
});

test('multiple conditions without postcss', (t) => {
  const attr = 'bound-attr';
  const expected = `#id[${attr}].class[attr]`;
  const css = '#id.class[attr]';
  const out = parser(transform(attr)).process(css).result;
  t.equal(out, expected);
  t.end();
});

test('multiple conditions', (t) => {
  const attr = 'bound-attr';
  const expected = `#id[${attr}].class[attr] {}`;
  const css = '#id.class[attr] {}';
  const out = postcss().use(bindAttr(attr)).process(css).toString();
  t.equal(out, expected);
  t.end();
});

test('multiple lines', (t) => {
  const attr = 'bound-attr';
  const expected = `h1[${attr}] {
  }
  h2[${attr}] {
  }`;
  const css = `h1 {
  }
  h2 {
  }`;
  const out = postcss().use(bindAttr(attr)).process(css).toString();
  t.equal(out, expected);
  t.end();
});

test('nested selectors', (t) => {
  const attr = 'bound-attr';
  const expected = `h1[${attr}] {
    & h2[${attr}] {
    }
  }`;
  const css = `h1 {
    & h2 {
    }
  }`;
  const out = postcss().use(bindAttr(attr)).process(css).toString();
  t.equal(out, expected);
  t.end();
});

test('media query', (t) => {
  const attr = 'bound-attr';
  const expected = `@media screen and (max-width: 100px) {
    a[${attr}] {}
  }`;
  const css = `@media screen and (max-width: 100px) {
    a {}
  }`;
  const out = postcss().use(bindAttr(attr)).process(css).toString();
  t.equal(out, expected);
  t.end();
});

test('pseudo without postcss', (t) => {
  const attr = 'bound-attr';
  const expected = `h1[${attr}]:hover h2[${attr}]::after`;
  const css = 'h1:hover h2::after';
  const out = parser(transform(attr)).process(css).result;
  t.equal(out, expected);
  t.end();
});

test('pseudo', (t) => {
  const attr = 'bound-attr';
  const expected = `h1[${attr}]:hover h2[${attr}]::after {}`;
  const css = 'h1:hover h2::after {}';
  const out = postcss().use(bindAttr(attr)).process(css).toString();
  t.equal(out, expected);
  t.end();
});

test('ignore root without postcss', (t) => {
  const attr = 'bound-attr';
  const expected = ':root';
  const css = ':root';
  const out = parser(transform(attr)).process(css).result;
  t.equal(out, expected);
  t.end();
});

test('ignore root', (t) => {
  const attr = 'bound-attr';
  const expected = ':root {}';
  const css = ':root {}';
  const out = postcss().use(bindAttr(attr)).process(css).toString();
  t.equal(out, expected);
  t.end();
});

test('isRoot', (t) => {
  t.equal(isRoot(':root'), true, 'root');
  t.equal(isRoot(':root a'), true, 'nested root');
  t.equal(isRoot('a'), false, 'no root');
  t.end();
});

test('ancestors', (t) => {
  const part = {parent: {}};
  t.equal(ancestors(part, part), true, 'same');
  t.equal(ancestors({parent: part}, part), true, 'include part');
  t.equal(ancestors({parent: {parent: {}}}, part), false, 'not include part');
  t.end();
});

test('ignore root (nested)', (t) => {
  const attr = 'bound-attr';
  const expected = `:root a {
    & .nested {}
  }`;
  const css = `:root a {
    & .nested {}
  }`;
  const out = postcss().use(bindAttr(attr)).process(css).toString();
  t.equal(out, expected);
  t.end();
});

test('generally file', (t) => {
  const expected = fs.readFileSync(path.resolve(__dirname, 'fixture-out.css'), 'utf8');
  const css = fs.readFileSync(path.resolve(__dirname, 'fixture.css'), 'utf8');
  const out = postcss().use(bindAttr('bound-attr')).process(css).toString();
  t.equal(out, expected, 'output is expected');
  t.end();
});
