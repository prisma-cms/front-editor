import React from 'react';

import EditorComponent from '../../../';
import CSSTransform from "./CSSTransform";

export default class HtmlTag extends EditorComponent {

  static Name = "HtmlTag"
  static help_url = "https://front-editor.prisma-cms.com/topics/html-tag.html";

  static defaultProps = {
    ...EditorComponent.defaultProps,
    tag: "span",
    contentEditable: undefined,
    render_badge: false,
    can_be_edited: false,
  }




  constructor(props) {

    super(props);

    const {
      components,
    } = this.getObjectWithMutations() || {};


    this.state = {
      ...this.state,
      focused: false,
      components: components ? components.slice(0) : [],
    }

    this.saveChanges = this.saveChanges.bind(this);
  }


  canBeChild() {

    return false;
  }


  /**
   * Не выводим кнопки, так как иначе сбивается редактирование текста
   */
  renderAddButtons() {

    return null;
  }


  renderPanelView(content) {

    return content ?
      super.renderPanelView(
        content) :
      null;
  }


  prepareDragItemProps() {

    const {
      tag,
    } = this.props;

    return {
      ...super.prepareDragItemProps(),
      tag,
    }

  }

  getRootElement() {

    const {
      tag,
    } = this.getComponentProps(this);

    return tag;
  }


  tagOnInput(event) {


    const node = event.target;


    const content = this.makeNewContent(node);

    const {
      components,
    } = content;


    this.onChangeContent(components);

  }


  /**
   * Измененный контент (конечная JSON-структура)
   */
  onChangeContent(components) {

    Object.assign(this.state, {
      newContent: {
        components,
      },
    });

  }


  tagOnFocus() {

    this.setState({
      focused: true,
    });

  }


  tagOnBlur() {

    this.saveChanges();

    this.setState({
      focused: false,
    });

  }

  /**
   * Сохраняем измененный контент (обновляем родительский объект)
   */
  saveChanges() {

    const {
      newContent,
    } = this.state;

    if (newContent) {

      const {
        components,
      } = newContent;

      this.setComponents(components);

      this.setState({
        newContent: null,
      })

    }

  }


  /**
   * Этот тег не должен редактироваться во фронт-редакторе
   */
  editable() {

    return false;
  }


  renderMainView(options = {}) {

    const object = this.getObjectWithMutations();

    const {
      props: {
        tag,
        text,
      },
    } = object;

    if (!tag) {
      return text;
    }

    else {

      switch (tag.toLowerCase) {

        case "script":

          console.error(`Tag "${tag}" not allowed`);

          return null;

        default: ;
      }

      if (this.editable()) {

        const {
          style: baseStyle,
        } = this.getRenderProps();

        const style = {
          outline: "none",
          height: "auto",
          width: "auto",
          ...baseStyle,
        }

        switch (tag) {

          case "a":

            Object.assign(style, {
              border: "1px solid green",
            });

            break;

          default: ;
        }

        options = {
          contentEditable: this.isActive(),
          suppressContentEditableWarning: true,
          style,
          onInput: event => this.tagOnInput(event),
          onFocus: event => this.tagOnFocus(event),
          onBlur: event => this.tagOnBlur(event),
          ...options,
        }

      }

      return super.renderMainView(options);
    }
  }


  renderChildren() {

    const object = this.getObjectWithMutations();

    const {
      props: {
        text,
      },
    } = object;


    const {
      components: itemComponents,
    } = this.state;

    if (itemComponents && itemComponents.length) {

      return super.renderChildren();

    }

    else return text;
  }

  renderBadge(badge) {

    const {
      focused,
    } = this.state;

    return focused ? null : super.renderBadge(badge);
  }


  isVoidElement() {

    const {
      tag,
    } = this.getComponentProps(this);

    return tag && ["img"].indexOf(tag) !== -1 ? true : super.isVoidElement();

  }


  makeNewContent(node) {

    const nodes = node.childNodes;


    const components = [];

    const content = {
    };

    nodes.forEach(n => {
      components.push(this.updateContent(n));
    });

    Object.assign(content, {
      components,
    });


    return content;
  }



  updateContent(node,
    content = {
      name: "HtmlTag",
      component: "HtmlTag",
      props: {},
      components: [],
    }) {

    const {
      reactComponent,
    } = node;

    /**
     * Если это реакт-нода, то возвращаем его состояние
     */
    if (reactComponent && !(reactComponent instanceof HtmlTag)) {

      const component = reactComponent.getObjectWithMutations();

      return component;
    }


    const nodes = node.childNodes;


    let NodeName = node.nodeName.toLowerCase();


    if (NodeName === "#text") {
      NodeName = undefined;
    }


    if (node.nodeType === Node.TEXT_NODE) {
      content.props.text = node.textContent;
    }
    else if (node.nodeType === Node.ELEMENT_NODE) {

      const attributes = node.attributes;

      node.getAttributeNames().map(name => {

        let value = attributes[name].value;

        switch (name) {

          // case "id":
          // case "src":
          // case "href":
          //   // case "editable":

          //   break;

          case "props":
          case "object":
          case "data":

            return null;

          case "contenteditable":

            // name = "contentEditable";
            // break;

            return null;

          case "class":

            name = "className";

            break;

          case "staticcontext":

            name = "staticContext";

            break;

          case "style":

            try {

              value = value ? CSSTransform(value) : undefined;


            }
            catch (error) {
              console.error(error);
              value = undefined;
            }

            break;

          default: ;
        }

        Object.assign(content.props, {
          [name]: value,
        });

        return null;
      })

      const components = [];

      nodes.forEach(node => {

        components.push(this.updateContent(node));

      });

      Object.assign(content, {
        components,
      });

    }

    content.props.tag = NodeName;

    return content;

  }


  componentDidCatch(error, info) {

    console.error(error, info);
  }


  getEditorField(props) {

    const {
      name,
    } = props;

    const field = super.getEditorField(props);

    const {
      tag,
    } = this.getComponentProps(this);


    if (tag === "img" && name === "src") {

      return <div>

        <div>
          {field}
        </div>

        <div>
          {this.renderUploader({
            onUpload: ({ path }) => {
              this.updateComponentProperty(name, `/images/big/${path}`);
            },
          })}
        </div>

      </div>

    }


    return field;
  }

}