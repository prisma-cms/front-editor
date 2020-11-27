import React from 'react'

import Icon from 'material-ui-icons/Image'
import EditorComponent from '../../../../../EditorComponent'
import { ObjectContext } from '../../ListView'

class ObjectImage extends EditorComponent {
  static defaultProps = {
    ...EditorComponent.defaultProps,
    name: 'image',
    type: 'thumb',
    style: {
      ...EditorComponent.defaultProps.style,
      maxWidth: '100%',
    },
    hide_wrapper_in_default_mode: true,
  }

  static Name = 'ObjectImage'

  renderPanelView(content) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">
          <Icon /> Object Image
        </div>
      )
    )
  }

  getRootElement() {
    return 'span'
  }

  renderMainView() {
    const { inEditMode } = this.getEditorContext()

    if (!inEditMode) {
      return this.renderChildren()
    }

    // else
    return super.renderMainView()
  }

  renderChildren() {
    const { Image } = this.context

    // {...this.getRenderProps()}

    const {
      name: nameProp,

      // Deprecated
      field_name,

      ...other
    } = this.getComponentProps(this)

    let name = nameProp

    if (name === undefined) {
      name = field_name
    }

    return (
      <ObjectContext.Consumer key="object_context">
        {(context) => {
          const { object } = context

          if (!object) {
            return null
          }

          const { [name]: image } = object

          /**
          Если нет картинки, то смотрим на текущий режим.
          Если в режиме редактирования работаем, 
         */
          if (!image) {
            return null
          }

          return <Image {...other} src={image}></Image>
        }}
      </ObjectContext.Consumer>
    )
  }
}

export default ObjectImage
