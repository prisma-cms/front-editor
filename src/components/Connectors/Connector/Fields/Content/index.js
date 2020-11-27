import React from 'react'
// import PropTypes from 'prop-types';

import Editor from '@prisma-cms/editor'
import Icon from 'material-ui-icons/Subject'

import EditorComponent from '../../../../../EditorComponent'
import { ObjectContext } from '../../ListView'

// TODO replace with RichText
/**
 * @deprecated
 * Use RichText instead
 */
class Content extends EditorComponent {
  static defaultProps = {
    ...EditorComponent.defaultProps,
    readOnly: true,
    hide_wrapper_in_default_mode: true,
  }

  static Name = 'Content'

  renderPanelView(content) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">
          <Icon /> Content
        </div>
      )
    )
  }

  getRootElement() {
    return 'div'
  }

  renderChildren() {
    const { readOnly } = this.props

    return (
      <ObjectContext.Consumer key="object_context">
        {(context) => {
          const {
            object,
            // ...other
          } = context

          if (!object) {
            return null
          }

          const { content } = object

          return content ? <Editor value={content} readOnly={readOnly} /> : null
        }}
      </ObjectContext.Consumer>
    )
  }
}

export default Content
