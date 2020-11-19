import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSTransform from '../../Tag/HtmlTag/CSSTransform';

class EditableText extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    components: PropTypes.object,
    inEditMode: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    allowedTags: [
    ],
    inEditMode: false,
  }



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

  onInput = event => {

    const {
      onChange,
    } = this.props;

    const node = event.target;


    const content = this.makeNewContent(node);

    const newState = {
      newContent: content,
    };

    Object.assign(this.state, newState);


    onChange(content);

  }

  render() {

    const {
      content,
    } = this.state;

    const {
      inEditMode,
    } = this.props;

    return (<div
      key="content"
      style={inEditMode ? {
        height: "100%",
        minHeight: "1rem",
      } : undefined}
      contentEditable={inEditMode ? true : false}
      suppressContentEditableWarning
      onInput={this.onInput}
    >
      {this.renderContent(content) || <div></div>}
    </div>

    );
  }
}

export default EditableText;
