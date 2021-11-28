import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import EditorComponent from '../../../EditorComponent'
import { EditableObjectContext, EditorContext } from '../../../context'
import Typography from 'material-ui/Typography'
import EditableObject from '../../form/EditableObject'

export class ResourceFieldsProxy extends EditorComponent {
  static propTypes = {
    objectContext: PropTypes.object.isRequired,
  }

  isDeletable() {
    return false
  }

  /**
   * Обновление данных объекта.
   * Так как компоненты рендерятся на основании передаваемых свойств,
   * надо обновить данные абсолютного родителя, а не просто текущего элемента
   */
  updateObject(data) {
    const { objectContext } = this.props

    const { updateObject } = objectContext

    return updateObject(data)
  }
}

export class ResourceFields extends EditorComponent {
  static Name = 'ResourceFields'

  static defaultProps = {
    ...EditorComponent.defaultProps,
  }

  renderPanelView() {
    return super.renderPanelView(
      <div className="editor-component--panel-icon">ResourceFields</div>
    )
  }

  renderMainView() {
    return (
      <EditableObjectContext.Consumer>
        {(context) => {
          Object.assign(this, {
            objectContext: context,
          })

          return super.renderMainView()
        }}
      </EditableObjectContext.Consumer>
    )
  }

  updateObject(data) {
    const { inEditMode } = this.getEditorContext()

    if (inEditMode) {
      return super.updateObject(data)
    } else {
      const { objectContext } = this

      const { updateObject, getObjectWithMutations } = objectContext || {}

      if (updateObject && getObjectWithMutations) {
        const { components } = getObjectWithMutations() || {}

        if (components) {
          updateObject({
            components,
          })
        }
      }
    }

    return false
  }

  addComponent(item) {
    const { inEditMode } = this.getEditorContext()

    if (inEditMode) {
      return super.addComponent(item)
    }

    const { name, component } = item

    if (!component) {
      item.component = name
    }

    this.addItem(item)
  }

  addItem(item) {
    const {
      objectContext: { updateObject, getObjectWithMutations },
    } = this

    const { components } = getObjectWithMutations() || {}

    updateObject({
      components: (components || []).concat([item]),
    })
  }

  canBeParent(parent) {
    return (
      super.canBeParent(parent) &&
      this.findInParent(parent, (parent) => parent instanceof EditableObject)
    )
  }

  panelRef = (el) => {
    this.actionPanel = el
  }

  renderChildren() {
    const { inEditMode } = this.getEditorContext()

    const { objectContext } = this

    const { inEditMode: objectInEditMode, getObjectWithMutations } =
      objectContext

    if (!getObjectWithMutations) {
      if (inEditMode) {
        return (
          <Typography color="error">
            EditableObject can not be found in parents
          </Typography>
        )
      } else {
        return null
      }
    }

    const { components } = getObjectWithMutations() || {}

    let customComponents
    let actionPanel

    if (
      !inEditMode &&
      ((components && components.length) || objectInEditMode)
    ) {
      if (objectInEditMode) {
        actionPanel = (
          <div
            ref={this.panelRef}
            className={['front-editor--action-panel'].join(' ')}
          ></div>
        )
      }

      customComponents = (
        <EditorContext.Consumer>
          {(context) => {
            if (objectInEditMode) {
              context = {
                ...context,
                inEditMode: true,
                getActionPanel: () => {
                  return this.actionPanel
                },
              }
            }

            return (
              <EditorContext.Provider value={context}>
                <ResourceFieldsProxy
                  object={{
                    props: {},
                    components,
                  }}
                  parent={this}
                  mode="main"
                  objectContext={objectContext}
                />
              </EditorContext.Provider>
            )
          }}
        </EditorContext.Consumer>
      )
    }

    return (
      <Fragment key="ResourceFields">
        {super.renderChildren()}

        {customComponents}

        {actionPanel}
      </Fragment>
    )
  }
}

export default ResourceFields
