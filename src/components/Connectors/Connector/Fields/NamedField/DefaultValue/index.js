import React from 'react'
import EditorComponent from '../../../../../../EditorComponent'
import NamedField from '..'
import ObjectView from '../../../../ObjectConnector/ObjectView'
import ListView from '../../../ListView'
import CurrentUser from '../../../../../CurrentUser'

export class DefaultValue extends EditorComponent {
  static Name = 'DefaultValue'

  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }

  renderPanelView(content) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">DefaultValue</div>
      )
    )
  }

  canBeParent(parent) {
    return (
      parent instanceof NamedField ||
      parent instanceof ObjectView ||
      parent instanceof ListView ||
      parent instanceof CurrentUser
    )
  }
}

export default DefaultValue
