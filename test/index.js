const bindAttr = require('../');
const transform = bindAttr.transform;
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

// test('postcss-bind-attr', (t) => {
//   const expected = fs.readFileSync(path.resolve(__dirname, 'fixture-out.css'), 'utf8');
//   const css = fs.readFileSync(path.resolve(__dirname, 'fixture.css'), 'utf8');
//   const out = postcss().use(bindAttr('bound-attr')).process(css).toString();
//   t.equal(expected, out, 'output is expected');
//   t.end();
// });