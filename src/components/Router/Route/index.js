import React from 'react'
import PropTypes from 'prop-types'
import EditorComponent from '../../../EditorComponent'
import EditorSwitch from '../Switch'

class EditorRoute extends EditorComponent {
  static Name = 'EditorRoute'

  static saveable = false

  static propTypes = {
    ...EditorComponent.propTypes,
    exact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    routername: PropTypes.string,
  }

  static defaultProps = {
    ...EditorComponent.defaultProps,
    exact: false,
    path: '',
    routername: '',
    hide_wrapper_in_default_mode: true,
  }

  renderPanelView(content) {
    return super.renderPanelView(
      content || <div className="editor-component--panel-icon">Router</div>
    )
  }

  prepareDragItemProps() {
    return {
      ...super.prepareDragItemProps(),
      exact: false,
    }
  }

  canBeParent(parent) {
    return parent.constructor === EditorSwitch && super.canBeParent(parent)
  }

  // renderMainView() {

  //   const {
  //     inEditMode,
  //   } = this.getEditorContext();

  //   return inEditMode ? super.renderMainView() : this.renderChildren();

  // }
}

export default EditorRoute
