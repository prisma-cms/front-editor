import React from 'react'

import EditorComponent from '../../EditorComponent'

class LanguageRouter extends EditorComponent {
  static defaultProps = {
    ...EditorComponent.defaultProps,
    tag: 'div',
    hide_wrapper_in_default_mode: true,
  }

  static Name = 'LanguageRouter'
  static help_url =
    'https://front-editor.prisma-cms.com/topics/language-router.html'

  onBeforeDrop = () => {
    return
  }

  renderPanelView(content) {
    return super.renderPanelView(
      content || <div className={'panelLanguageRouter'}>Language Router</div>
    )
  }

  getRootElement() {
    const { tag } = this.getComponentProps(this)

    return tag
  }

  renderChildren() {
    const { activeItem } = this.getEditorContext()

    const { getLanguage } = this.context

    const language = getLanguage()

    let children = super.renderChildren()

    if (children) {
      if (
        activeItem &&
        (activeItem === this || activeItem.props.parent === this)
      ) {
        return
      } else {
        children = children.filter((n) => {
          if (n) {
            const { props } = n.props

            const { lang } = props || {}

            if (lang && lang !== language) {
              return false
            }
          }

          return true
        })
      }
    }

    return children
  }
}

export default LanguageRouter
