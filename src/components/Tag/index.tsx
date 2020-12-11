/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
// import PropTypes from 'prop-types';

import Icon from 'material-ui-icons/Title'

import HtmlTag from './HtmlTag'
import { TagProps, TagState } from './interfaces'

export class Tag<P extends TagProps = TagProps, S extends TagState = TagState>
  extends HtmlTag<P, S> {
  static Name = 'Tag' as 'Tag'

  static defaultProps = {
    ...HtmlTag.defaultProps,
    render_badge: true,
    can_be_edited: true,
    render_add_button: true,
  }

  renderPanelView(content?: React.ReactNode) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">
          <Icon /> Tag
        </div>
      )
    )
  }

  editable() {
    const inEditMode = this.inEditorMode()

    return inEditMode ? true : false
  }

  prepareRootElementProps(props: P & Record<string, any>): Record<string, any> {
    const {
      initialContent,
      read_only,
      updateObject,
      editable,
      ...other
    } = super.prepareRootElementProps(props)

    return other
  }
}

export default Tag
