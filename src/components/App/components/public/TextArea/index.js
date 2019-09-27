import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../..';

import TextIcon from "material-ui-icons/Title";
// import EditableText from './EditableText';

import CSSTransform from "./EditableText/transform";


class TextArea extends EditorComponent {


  static Name = "TextArea"

  // onBeforeDrop = () => {

  // }


  // canBeDropped(dragItem) {

  //   return false;
  // }

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
      content,
      // newContent,
    } = this.state;

    // const {
    //   // onChange,
    //   inEditMode,
    //   // classes,
    // } = this.props;


    const {
      inEditMode,
    } = this.getEditorContext();




    let options;

    if (inEditMode) {

      options = {
        contentEditable: true,
        suppressContentEditableWarning: true,
        onInput: event => {

          // const {
          //   nativeEvent: {
          //     inputType,
          //   },
          // } = event;


          const node = event.target;


          const content = this.makeNewContent(node);



          let newState = {
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


          // setTimeout(() => {
          //   this.forceUpdate();
          // }, 1000);


        },
      }

    }

    return super.renderMainView(options);



    // return (<div
    //   key="content"
    //   // className={[classes.root, inEditMode ? classes.editable : ""].join(" ")}
    //   style={inEditMode ? {
    //     height: "100%",
    //     minHeight: "1rem",
    //   } : undefined}
    //   contentEditable={inEditMode ? true : false}
    //   suppressContentEditableWarning
    //   onInput={event => {

    //     // const {
    //     //   nativeEvent: {
    //     //     inputType,
    //     //   },
    //     // } = event;


    //     const node = event.target;


    //     const content = this.makeNewContent(node);



    //     let newState = {
    //       newContent: content,
    //     };


    //     // Object.assign(newState, {
    //     //   // content,
    //     // });

    //     Object.assign(this.state, newState);


    //     // onChange(content);

    //     this.updateComponentProps({
    //       content,
    //     });


    //     // setTimeout(() => {
    //     //   this.forceUpdate();
    //     // }, 1000);


    //   }}
    // >

    //   {this.renderContent(content) || ""}

    // </div>

    // );
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

    let content = {
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

      let attributes = node.attributes;

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

      let children = [];

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



    let children = [];

    let content = {
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





  renderTextArea___() {

    const {
      content,
      // newContent,
    } = this.state;

    // const {
    //   // onChange,
    //   inEditMode,
    //   // classes,
    // } = this.props;


    const {
      inEditMode,
    } = this.getEditorContext();




    return (<div
      key="content"
      // className={[classes.root, inEditMode ? classes.editable : ""].join(" ")}
      style={inEditMode ? {
        height: "100%",
        minHeight: "1rem",
      } : undefined}
      contentEditable={inEditMode ? true : false}
      suppressContentEditableWarning
      onInput={event => {

        // const {
        //   nativeEvent: {
        //     inputType,
        //   },
        // } = event;


        const node = event.target;


        const content = this.makeNewContent(node);



        let newState = {
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


        // setTimeout(() => {
        //   this.forceUpdate();
        // }, 1000);


      }}
    >

      {this.renderContent(content) || ""}

    </div>

    );
  }






  // getRenderProps() {

  //   const {
  //     inEditMode,
  //   } = this.getEditorContext();

  //   const {
  //     style,
  //     ...props
  //   } = super.getRenderProps();

  //   return {
  //     contentEditable: inEditMode ? true : false,
  //     suppressContentEditableWarning: true,
  //     onInput: event => {

  //       const {
  //         nativeEvent: {
  //           inputType,
  //         },
  //       } = event;

  //     },
  //     style: {
  //       ...style,
  //       display: "inline-block",
  //     },
  //     ...props,
  //   }
  // }


  // renderMainView() {

  //   return <span
  //     {...this.getRenderProps()}
  //   >
  //   </span>;
  // }


}

export default TextArea;
