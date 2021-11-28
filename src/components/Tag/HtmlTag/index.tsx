import React from 'react'

import EditorComponent, {
  ElementWithReactComponent,
} from '../../../EditorComponent'

import { HtmlTagProps, HtmlTagState } from './interfaces'
export * from './interfaces'

import CSSTransform from './CSSTransform'

export default class HtmlTag<
  P extends HtmlTagProps = HtmlTagProps,
  S extends HtmlTagState = HtmlTagState
> extends EditorComponent<P, S> {
  static Name: 'HtmlTag' | 'Tag' = 'HtmlTag'
  static help_url = 'https://front-editor.prisma-cms.com/topics/html-tag.html'

  static defaultProps = {
    ...EditorComponent.defaultProps,
    tag: 'span',
    contentEditable: undefined,
    render_badge: false,
    can_be_edited: false,
    render_add_button: false,
  }

  constructor(props: P) {
    super(props)

    const { components } = this.getObjectWithMutations() || {}

    this.state = {
      ...this.state,
      focused: false,
      components: components ? components.slice(0) : [],
      newContent: null,
    }

    this.saveChanges = this.saveChanges.bind(this)
    this.tagOnInput = this.tagOnInput.bind(this)
    this.tagOnFocus = this.tagOnFocus.bind(this)
    this.tagOnBlur = this.tagOnBlur.bind(this)
  }

  canBeChild() {
    return false
  }

  /**
   * Не выводим кнопки, так как иначе сбивается редактирование текста
   */
  renderAddButtons() {
    return null
  }

  renderPanelView(content?: React.ReactNode) {
    return content ? super.renderPanelView(content) : null
  }

  prepareDragItemProps() {
    const { tag } = this.props

    return {
      ...super.prepareDragItemProps(),
      tag,
    }
  }

  getRootElement() {
    const { tag } = this.getComponentProps(this as EditorComponent)

    return tag
  }

  tagOnInput(event: React.ChangeEvent) {
    const node = event.target

    const content = this.makeNewContent(node)

    const { components } = content

    components && this.onChangeContent(components)
  }

  /**
   * Измененный контент (конечная JSON-структура)
   */
  onChangeContent(components: P['object']['components']) {
    Object.assign(this.state, {
      newContent: {
        components,
      },
    })
  }

  tagOnFocus() {
    this.setState({
      focused: true,
    })
  }

  tagOnBlur() {
    this.saveChanges()

    this.setState({
      focused: false,
    })
  }

  /**
   * Сохраняем измененный контент (обновляем родительский объект)
   */
  saveChanges() {
    const { newContent } = this.state

    if (newContent && newContent.components) {
      this.setComponents(newContent.components)

      this.setState({
        newContent: null,
      })
      return true
    }

    return false
  }

  /**
   * Этот тег не должен редактироваться во фронт-редакторе
   */
  editable() {
    return false
  }

  renderMainView(options = {}) {
    const object = this.getObjectWithMutations()

    // const {
    //   props: {
    //     tag,
    //     text,
    //   },
    // } = object;

    const tag = object?.props.tag
    const text = object?.props.text

    const context = this.getEditorContext()

    if (!tag) {
      return text
    } else {
      switch (tag.toLowerCase()) {
        case 'script':
          if (!context.allowScriptTags) {
            console.error(`Tag "${tag}" not allowed`)

            return null
          }

          break

        default:
      }

      if (this.editable()) {
        const { style: baseStyle } = this.getRenderProps()

        const style = {
          outline: 'none',
          height: 'auto',
          width: 'auto',
          ...baseStyle,
        }

        switch (tag) {
          case 'a':
            Object.assign(style, {
              border: '1px solid green',
            })

            break

          default:
        }

        options = {
          contentEditable: this.isActive(),
          suppressContentEditableWarning: true,
          style,
          onInput: this.tagOnInput,
          onFocus: this.tagOnFocus,
          onBlur: this.tagOnBlur,
          ...options,
        }
      }

      return super.renderMainView(options)
    }
  }

  renderChildren() {
    const object = this.getObjectWithMutations()

    const text = object?.props.text ?? null

    const { components: itemComponents } = this.state

    if (itemComponents && itemComponents.length) {
      return super.renderChildren()
    } else return text
  }

  renderBadge(badge: React.ReactNode) {
    const { focused } = this.state

    return focused ? null : super.renderBadge(badge)
  }

  isVoidElement() {
    const { tag } = this.getComponentProps(this as EditorComponent)

    return tag && ['img'].indexOf(tag) !== -1 ? true : super.isVoidElement()
  }

  // makeNewContent(node: HTMLElement | (EventTarget & Element)) {
  // makeNewContent(node: EventTarget & Element) {
  makeNewContent(node: Node) {
    const nodes = node.childNodes

    const components: P['object']['components'] = []

    const content: Partial<P['object']> = {}

    nodes.forEach((n) => {
      const component = this.updateContent(n)

      component && components.push(component)
    })

    Object.assign(content, {
      components,
    })

    return content
  }

  updateContent(
    // node: NonNullable<InstanceType<typeof EditorComponent> | ElementWithReactComponent | Text | ChildNode>,
    node: NonNullable<ElementWithReactComponent | Text | ChildNode>,
    content?: P['object']
  ) {
    if (!content) {
      content = {
        name: 'HtmlTag',
        component: 'HtmlTag',
        props: {},
        components: [],
      }
    }

    /**
     * Если это реакт-нода, то возвращаем его состояние
     */
    if (node instanceof Element) {
      const { reactComponent } = node

      if (reactComponent && !(reactComponent instanceof HtmlTag)) {
        const component = reactComponent.getObjectWithMutations()

        return component
      }
    }

    const nodes = node.childNodes

    let NodeName = node.nodeName.toLowerCase() as
      | keyof JSX.IntrinsicElements
      | '#text'
      | undefined

    if (NodeName === '#text') {
      NodeName = undefined
    }

    if (node.nodeType === Node.TEXT_NODE) {
      content.props.text = node.textContent
    } else if (node instanceof Element && node.nodeType === Node.ELEMENT_NODE) {
      const attributes = node.attributes

      node.getAttributeNames().map((name) => {
        // let value = attributes[name].value;

        let value: string | Record<string, any> | undefined =
          attributes.getNamedItem(name)?.value ?? undefined

        switch (name) {
          // case "id":
          // case "src":
          // case "href":
          //   // case "editable":

          //   break;

          case 'props':
          case 'object':
          case 'data':
            return null

          case 'contenteditable':
            // name = "contentEditable";
            // break;

            return null

          case 'class':
            name = 'className'

            break

          case 'staticcontext':
            name = 'staticContext'

            break

          case 'style':
            try {
              value = value ? CSSTransform(value) : undefined
            } catch (error) {
              console.error(error)
              value = undefined
            }

            break

          default:
        }

        content &&
          Object.assign(content.props, {
            [name]: value,
          })

        return null
      })

      const components: P['object']['components'] = []

      nodes.forEach((node) => {
        const component = this.updateContent(node)
        component && components.push(component)
      })

      Object.assign(content, {
        components,
      })
    }

    content.props.tag = NodeName

    return content
  }

  componentDidCatch(error: Error, info: any) {
    console.error(error, info)
  }

  getEditorField(props: any) {
    const { name } = props

    const field = super.getEditorField(props)

    const { tag } = this.getComponentProps(this as EditorComponent)

    if (tag === 'img' && name === 'src') {
      return (
        <div>
          <div>{field}</div>

          <div>
            {this.renderUploader({
              onUpload: ({ path }: { path: string }) => {
                this.updateComponentProperty(name, `/images/big/${path}`)
              },
            })}
          </div>
        </div>
      )
    }

    return field
  }
}
