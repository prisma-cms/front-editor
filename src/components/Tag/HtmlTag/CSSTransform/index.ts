/* eslint-disable @typescript-eslint/no-unused-vars */

import { Declaration, Media, Rule, StyleRules, Stylesheet } from 'css'

//
// Transform implementation or originally thanks to
// https://github.com/staxmanade/CssToReact/blob/gh-pages/src/transform.js
// https://github.com/raphamorim/native-css
//

// https://github.com/reworkcss/css/pull/146#issuecomment-740412799
const cssParse = require('css/lib/parse')

function transformRules(
  rules: StyleRules['rules'],
  result: Record<string, any>
) {
  rules.forEach(function (n) {
    const obj: Record<string, any> = {}
    if (n.type === 'media') {
      const rule: Media = n

      if (rule.media) {
        const name = mediaNameGenerator(rule.media)
        const media = (result[name] = result[name] || {
          __expression__: rule.media,
        })

        if (rule.rules) {
          transformRules(rule.rules, media)
        }
      }
    } else if (n.type === 'rule') {
      const rule: Rule = n

      rule.declarations?.forEach(function (nn) {
        if (nn.type === 'declaration') {
          const declaration: Declaration = nn
          if (declaration.property) {
            const cleanProperty = cleanPropertyName(declaration.property)
            obj[cleanProperty] = declaration.value
          }
        }
      })

      rule.selectors?.forEach(function (selector) {
        const name = nameGenerator(selector.trim())
        result[name] = obj
      })
    }
  })
}

const cleanPropertyName = function (name: string) {
  // turn things like 'align-items' into 'alignItems'
  name = name.replace(/(-.)/g, function (v) {
    return v[1].toUpperCase()
  })

  return name
}

const mediaNameGenerator = function (name: string) {
  return '@media ' + name
}

const nameGenerator = function (name: string) {
  name = name.replace(/\s\s+/g, ' ')
  name = name.replace(/[^a-zA-Z0-9]/g, '_')
  name = name.replace(/^_+/g, '')
  name = name.replace(/_+$/g, '')

  return name
}

export default function CSSTransform(inputCssText: string) {
  // if (!inputCssText) {
  //   throw new Error('missing css text to transform')
  // }

  // If the input "css" doesn't wrap it with a css class (raw styles)
  // we need to wrap it with a style so the css parser doesn't choke.
  let bootstrapWithCssClass = false
  if (inputCssText.indexOf('{') === -1) {
    bootstrapWithCssClass = true
    inputCssText = `.bootstrapWithCssClass { ${inputCssText} }`
  }

  let result: Record<string, any> = {}

  const css: Stylesheet = cssParse(inputCssText)

  if (css.stylesheet) {
    transformRules(css.stylesheet.rules, result)
  }

  // Don't expose the implementation detail of our wrapped css class.
  if (bootstrapWithCssClass) {
    result = result.bootstrapWithCssClass
  }

  return result
}
