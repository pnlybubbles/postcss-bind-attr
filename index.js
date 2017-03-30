const postcss = require('postcss')
const parser = require('postcss-selector-parser')

function transform (attr) {
  return (selectors) => {
    const nodes = []
    selectors.walk((selector) => {
      if (selector.type !== 'pseudo' &&
        selector.type !== 'selector' &&
        selector.type !== 'nesting' &&
        (!selector.prev() || selector.prev().type === 'combinator')) {
        nodes.push(selector)
      }
    })
    nodes.forEach((node) => {
      node.parent.insertAfter(node, parser.attribute({attribute: attr}))
    })
  }
}

function isRoot (selector) {
  let isRoot_ = false
  parser((selectors) => {
    selectors.walk((selector_) => {
      if (selector_.value === ':root') {
        isRoot_ = true
        return false
      }
    })
  }).process(selector)
  return isRoot_
}

function ancestors (nested, checker) {
  return checker(nested) ||
    (!!nested.parent &&
      ancestors(nested.parent, checker))
}

module.exports = postcss.plugin('postcss-bind-attr', (attr) => {
  const processor = parser(transform(attr))
  return (css) => {
    css.walkRules((rule) => {
      if ([
        (n) => n.selector && isRoot(n.selector),
        (n) => n.type === 'atrule' && n.name === 'keyframes'
      ].map((chceker) => ancestors(rule, chceker)).every((b) => !b)) {
        rule.selector = processor.process(rule.selector).result
      }
    })
  }
})

module.exports.transform = transform
module.exports.isRoot = isRoot
module.exports.ancestors = ancestors
