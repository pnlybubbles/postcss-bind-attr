const postcss = require('postcss');
const parser = require('postcss-selector-parser');

function transform(attr) {
  return (selectors) => {
    const nodes = [];
    selectors.walk((selector) => {
      if (selector.type !== 'pseudo'
        && selector.type !== 'selector'
        && selector.type !== 'nesting'
        && (!selector.prev() || selector.prev().type === 'combinator')) {
        nodes.push(selector);
      }
    });
    nodes.forEach((node) => {
      node.parent.insertAfter(node, parser.attribute({attribute: attr}));
    });
  };
}

module.exports = postcss.plugin('postcss-bind-attr', (attr) => {
  const processor = parser(transform(attr));
  return (css) => {
    css.walk((rule) => {
      rule.selector = processor.process(rule.selector).result;
    });
  };
});

module.exports.transform = transform;
