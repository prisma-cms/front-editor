import React from 'react';
// import PropTypes from 'prop-types';
import EditorComponent from '../..';

import Icon from "material-ui-icons/Title";

import CSSTransform from "./CSSTransform";

class Tag extends EditorComponent {

  static Name = "Tag"
  static help_url = "https://front-editor.prisma-cms.com/topics/html-tag.html";

  static defaultProps = {
    ...EditorComponent.defaultProps,
    tag: "span",
    // text: "",
    // color: "default",
    // displayType: "span",
    // display: "inline-block",
    // contentEditable: true,
  }




  constructor(props) {

    super(props);

    // const {
    //   // content,
    //   // data: {
    //   //   object,
    //   // },
    // } = props;


    // const {
    //   // props: objectProps,
    //   components,
    // } = object || {};

    const {
      components,
    } = this.getObjectWithMutations() || {};

    // const {
    // } = objectProps || {};




    this.state = {
      ...this.state,
      focused: false,
      components: components ? components.slice(0) : [],
    }
  }


  // canBeDropped(dragItem) {



  //   // return dragItem.name === "Tag";

  //   return false;
  // }

  canBeChild(child) {

    // return super.canBeChild(child) && child instanceof Tag;

    return false;
  }


  /**
   * Не выводим кнопки, так как иначе сбивается редактирование текста
   */
  renderAddButtons(content) {

    return null;
  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        <Icon /> HTML Tag
    </div>);
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

  // prepareDragItemComponents() {

  //   return [{
  //     name: "Tag",
  //     props: {
  //       text: "",
  //     },
  //     components: [],
  //   }];
  // }


  getRootElement() {

    const {
      tag,
    } = this.getComponentProps(this);

    return tag;
  }


  tagOnInput(event) {

    // event.preventDefault();
    // event.stopPropagation();

    const node = event.target;

    // console.log("TagEvent tagOnInput", event);
    // console.log("TagEvent event.target", event.target);
    // console.log("TagEvent event.currentTarget", event.currentTarget);

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

    // this.setState({
    //   newContent: {
    //     components,
    //   },
    // });

  }


  tagOnFocus(event) {

    // console.log("TagEvent tagOnFocus", event);

    if (this.isActive()) {
      this.setState({
        focused: true,
      });
    }

  }


  tagOnBlur(event) {

    // console.log("TagEvent tagOnBlur", event);

    // if (activeItem === this) {
    if (this.isActive()) {

      this.saveChanges();

    }

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


  renderMainView(options = {}) {


    const {
      inEditMode,
      // activeItem,
    } = this.getEditorContext();

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
          // case "link":

          console.error(`Tag "${tag}" not allowed`);

          return null;

        default: ;
      }

      if (inEditMode) {


        // const {
        //   components,
        //   newContent,
        //   focused,
        // } = this.state;


        const {
          style: baseStyle,
        } = this.getRenderProps();

        let style = {
          outline: "none",
          height: "auto",
          width: "auto",
          // padding: 3,
          ...baseStyle,
        }


        // if (focused) {

        //   Object.assign(style, {
        //     border: "none",
        //   });

        // }


        switch (tag) {

          case "a":

            Object.assign(style, {
              border: "1px solid green",
            });

            break;

          default: ;
        }



        options = {
          // contentEditable: true,
          // contentEditable: activeItem === this,
          contentEditable: this.isActive(),
          suppressContentEditableWarning: true,
          style,
          onInput: event => this.tagOnInput(event),
          onFocus: event => this.tagOnFocus(event),
          onBlur: event => this.tagOnBlur(event),
          ...options,
        }
      }

      // console.log("options", options);

      return super.renderMainView(options);
    }
  }



  renderChildren() {

    const object = this.getObjectWithMutations();

    const {
      props: {
        text,
      },
      // components: itemComponents,
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

  // shouldComponentUpdate() {
  //   return false;
  // }


  makeNewContent(node) {

    // const {
    //   components,
    // } = this.state;

    // return {
    //   components,
    // }

    const nodes = node.childNodes;


    let components = [];

    let content = {
    };

    nodes.forEach(n => {
      components.push(this.updateContent(n));
    });

    Object.assign(content, {
      components,
    });

    console.log("makeNewContent components", components);

    return content;
  }



  updateContent(node) {

    let content = {
      name: "Tag",
      component: "Tag",
      props: {},
      components: [],
    };

    const nodes = node.childNodes;


    let NodeName = node.nodeName.toLowerCase();


    if (NodeName === "#text") {
      NodeName = undefined;
    }


    if (node.nodeType === Node.TEXT_NODE) {
      content.props.text = node.textContent;
    }
    else if (node.nodeType === Node.ELEMENT_NODE) {

      let attributes = node.attributes;

      node.getAttributeNames().map(name => {

        let value = attributes[name].value;

        switch (name) {

          // case "id":
          // case "src":
          // case "href":
          //   // case "editable":

          //   break;

          case "contenteditable":

            name = "contentEditable";

            break;

          case "class":

            name = "className";

            break;

          case "staticcontext":

            name = "staticContext";

            break;

          case "style":

            try {

              console.log("CSSTransform style", value);

              value = value ? CSSTransform(value) : undefined;

              console.log("CSSTransform new style", value);

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

      let components = [];

      nodes.forEach(node => {

        components.push(this.updateContent(node, {}));

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

    let field = super.getEditorField(props);

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

export default Tag;
