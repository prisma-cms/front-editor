import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import CSSTransform from "./transform";
import { withStyles } from 'material-ui';

class EditableText extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    components: PropTypes.object,
    inEditMode: PropTypes.bool.isRequired,
    // classes: PropTypes.object.isRequired,
  };

  static defaultProps = {
    allowedTags: [
    ],
    inEditMode: false,
  }

  // shouldComponentUpdate() {
  //   return false;
  // }


  constructor(props) {

    super(props);

    const {
      components,
    } = props;

    this.state = {
      ...this.state,
      content: components || {
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


  render() {

    const {
      content,
      // newContent,
    } = this.state;

    const {
      onChange,
      inEditMode,
      // classes,
    } = this.props;


    // console.log("TextArea props", { ...this.props });


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


        onChange(content);


        // setTimeout(() => {
        //   this.forceUpdate();
        // }, 1000);


      }}
    >

      {this.renderContent(content) || <div></div>}

    </div>

    );
  }
}

export default EditableText;
