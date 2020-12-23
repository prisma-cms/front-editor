import React from 'react'

import EditorComponent, { EditorComponentState } from '../../EditorComponent'

import ContentProxy from './ContentProxy'
import { ContentEditorProps } from './interfaces'

export class ContentEditor<
  P extends ContentEditorProps = ContentEditorProps,
  S extends EditorComponentState = EditorComponentState
  > extends EditorComponent<P, S> {
  static Name = 'ContentEditor' as 'ContentEditor'

  static defaultProps = {
    ...EditorComponent.defaultProps,

    /**
     * Если да, то нельзя редактировать содержимое никаким образом.
     */
    read_only: false,

    /**
     * Этот контент по-умолчанию только в режиме редактирования и когда
     * еще нет установленного значения
     */
    // "initialContent": [],
    initialContent: [
      {
        name: 'HtmlTag',
        component: 'HtmlTag',
        props: {
          tag: 'p',
        },
        components: [
          {
            name: 'HtmlTag',
            component: 'HtmlTag',
            props: {
              tag: 'br',
            },
            components: [],
          },
        ],
      },
    ],

    // TagEditor,
    hide_wrapper_in_default_mode: true,
    render_toolbar: true,
  }

  renderPanelView(content?: React.ReactNode) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">ContentEditor</div>
      )
    )
  }

  getRootElement() {
    return super.getRootElement()
  }

  canBeChild() {
    return false
  }

  prepareRootElementProps(props: P & Record<string, any>) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      initialContent,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      read_only,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updateObject,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      editable,
      ...other
    } = super.prepareRootElementProps(props)

    return other
  }

  getComponentProps(component: EditorComponent): P['object']['props'] {
    return super.getComponentProps(component)
  }

  renderChildren() {
    const inEditMode = this.inEditorMode()

    const {
      initialContent,
      read_only,
      // TagEditor,
      render_toolbar,
      contentproxyclassname,
      experimental,
    } = this.getComponentProps(this)

    const object = this.getObjectWithMutations()

    if (!object) {
      return null
    }

    const { components } = object

    const editable = inEditMode && !read_only ? true : false

    return editable ? (
      <ContentProxy
        experimental={experimental === "true"}
        key={editable.toString()}
        updateObject={this.updateObject}
        components={components}
        editable={editable}
        initialContent={initialContent}
        render_toolbar={render_toolbar}
        className={contentproxyclassname}
      >
        {super.renderChildren()}
      </ContentProxy>
    ) : (
        super.renderChildren()
      )
  }
}

export default ContentEditor
