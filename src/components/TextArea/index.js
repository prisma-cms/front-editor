import React from 'react';

import EditorComponent from '../../EditorComponent';

import TextIcon from "material-ui-icons/Title";

import CSSTransform from "./EditableText/transform";

class TextArea extends EditorComponent {

  static Name = "TextArea"

  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        <TextIcon /> TextArea
    </div>);
  }



  renderMainView() {


    const {
      inEditMode,
    } = this.getEditorContext();




    let options;

    if (inEditMode) {

      options = {
        contentEditable: true,
        suppressContentEditableWarning: true,
        onInput: event => {

          const node = event.target;


          const content = this.makeNewContent(node);



          const newState = {
            newContent: content,
          };


          // Object.assign(newState, {
          //   // content,
          // });

          Object.assign(this.state, newState);


          // onChange(content);

          this.updateComponentProps({
            content,
          });

        },
      }

    }

    return super.renderMainView(options);

  }


  renderChildren() {

    const {
      content,
    } = this.state;

    return this.renderContent(content) || "";

  }




  constructor(props) {

    super(props);

    const {
      // content,
      data: {
        object,
      },
    } = props;


    const {
      props: objectProps,
    } = object || {};

    const {
      content,
    } = objectProps || {};



    this.state = {
      ...this.state,
      content: content || {
        children: [
        ],
      },
    }
  }


  updateContent(node) {

    const content = {
      attributes: {},
    };

    const nodes = node.childNodes;


    let NodeName = node.nodeName.toLowerCase();


    if (NodeName === "#text") {
      NodeName = undefined;
    }


    if (node.nodeType === Node.TEXT_NODE) {
      content.text = node.textContent;
    }
    else if (node.nodeType === Node.ELEMENT_NODE) {

      const attributes = node.attributes;

      node.getAttributeNames().map(name => {

        let value = attributes[name].value;

        switch (name) {

          case "id":
          case "src":
          case "href":
            // case "editable":

            break;

          case "class":

            name = "className";

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

          default: return;
        }

        Object.assign(content.attributes, {
          [name]: value,
        });

      })

      const children = [];

      nodes.forEach(node => {

        children.push(this.updateContent(node, {}));

      });

      Object.assign(content, {
        children,
      });

    }

    content.tag = NodeName;

    return content;

  }


  renderContent(node, key) {

    if (!node) {
      return null;
    }

    const {
      text,
      tag: Tag,
      children,
      attributes,
      ...other
    } = node;

    let content = text;


    if (children && children.length) {
      content = children.map((n, index) => this.renderContent(n, index));
    }

    if (Tag) {
      content = <Tag
        key={key}
        {...attributes}
        {...other}
      >
        {content}
      </Tag>
    }

    return content;


  }


  makeNewContent(node) {
    const nodes = node.childNodes;



    const children = [];

    const content = {
    };

    nodes.forEach(n => {
      children.push(this.updateContent(n));
    });

    Object.assign(content, {
      children,
    });

    return content;
  }

  componentDidCatch(error, info) {

    console.error(error, info);
  }



}

export default TextArea;
