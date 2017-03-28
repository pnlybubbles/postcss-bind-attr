const postcss = require('postcss');
const parser = require('postcss-selector-parser');

function transform(attr) {
  return (selectors) => {
    selectors.each((selector) => {
      selector.each((node) => {
        if (node.type === 'tag') {
          node.parent.insertAfter(node, parser.attribute({attribute: attr}));
        }
      });
    });
  };
}

module.exports = postcss.plugin('postcss-bind-attr', (attr) => {
  const processor = parser(transform(attr));
  return (css) => {
    css.each((node) => {
      node.selector = processor.process(node.selector).result;
    });
  };
});

module.exports.transform = transform;
