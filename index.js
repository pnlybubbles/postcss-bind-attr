const postcss = require('postcss');
const parser = require('postcss-selector-parser');

function transform(attr) {
  return (selectors) => {
    selectors.each((selector) => {
      selector.each((node) => {
        if (node.type === 'combinator') {
          node.parent.insertBefore(node, parser.attribute({attribute: attr}));
        }
      });
    });
  };
}

module.exports = postcss.plugin('postcss-bind-attr', (options = {}) => {
  return (root) => {
  };
});

function initializer(attr, options) {
  const processor = parser(transform(attr));
  return function(root) {
    console.log(root);
  };
}
module.exports.initializer = initializer;
module.exports.transform = transform;
