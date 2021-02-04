import { EditorComponentObject, ElementWithReactComponent } from '../../../..'
import HtmlTag from '../../../Tag/HtmlTag'
import CSSTransform from '../../../Tag/HtmlTag/CSSTransform'

/**
 * Convert HTML Node to EditorComponentObject JSON
 */
const nodeToEditorComponentObject = (
  node: NonNullable<ElementWithReactComponent | Text | ChildNode>,
  content?: EditorComponentObject
) => {
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
    const { reactComponent, editorComponentObject } = node

    if (editorComponentObject) {
      return editorComponentObject
    }

    if (reactComponent && !(reactComponent instanceof HtmlTag)) {
      const component = reactComponent.getObjectWithMutations()

      return component
    }
  }

  const nodes = node.childNodes

  let NodeName = node.nodeName.toLowerCase() as keyof JSX.IntrinsicElements | '#text' | undefined

  if (NodeName === '#text') {
    NodeName = undefined
  }

  if (node.nodeType === Node.TEXT_NODE) {
    // https://stackoverflow.com/questions/12754256/removing-invalid-characters-in-javascript
    content.props.text = node.textContent?.replace(/\uFFFD/g, '') || ''
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
            // console.log("CSSTransform style", value);

            value = value ? CSSTransform(value) : undefined

            // console.log("CSSTransform new style", value);
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

    const components: EditorComponentObject['components'] = []

    nodes.forEach((node) => {
      const component = nodeToEditorComponentObject(node)
      component && components.push(component)
    })

    Object.assign(content, {
      components,
    })
  }

  content.props.tag = NodeName

  return content
}

/**
 * Конвертируем содержимое HTML-ноды в компоненты
 */
export const nodeChildsToEditorComponentObjectComponents = (node: Node) => {
  const nodes = node.childNodes

  const components: EditorComponentObject['components'] = []

  const content: Partial<EditorComponentObject> = {}

  nodes.forEach((n) => {
    // console.log('makeNewContent n', n)

    const component = nodeToEditorComponentObject(n)

    // console.log('makeNewContent component', component)

    component && components.push(component)
  })

  Object.assign(content, {
    components,
  })

  return content
}

export default nodeToEditorComponentObject
