import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../..';

import Icon from "material-ui-icons/Title";

import CSSTransform from "./CSSTransform";

class Tag extends EditorComponent {

  static Name = "Tag"

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

    const {
      // content,
      data: {
        object,
      },
    } = props;


    const {
      // props: objectProps,
      components,
    } = object || {};

    // const {
    // } = objectProps || {};




    this.state = {
      ...this.state,
      focused: false,
      components: components ? components.slice(0) : [],
    }
  }


  canBeDropped(dragItem) {



    // return dragItem.name === "Tag";

    return false;
  }

  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <Icon /> HTML Tag
    </div>);
  }


  prepareDragItemProps() {

    return {
      ...super.prepareDragItemProps(),
      tag: "div",
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


  renderMainView() {


    const {
      inEditMode,
      activeItem,
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

      let options;

      switch (tag.toLowerCase) {

        case "script":
        case "link":

          console.error(`Tag "${tag}" not allowed`);

          return null;

          break;

      }

      if (inEditMode) {


        const {
          components,
          newContent,
          focused,
        } = this.state;


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
        }



        options = {
          // contentEditable: true,
          contentEditable: activeItem === this,
          suppressContentEditableWarning: true,
          style,
          onInput: event => {

            const node = event.target;




            // return;


            const content = this.makeNewContent(node);






            // let newState = {
            //   newContent: content,
            // };

            // Object.assign(this.state, newState);

            // // onChange(content);

            const {
              components,
            } = content;

            // Object.assign(this.state, {
            //   components,
            // });

            Object.assign(this.state, {
              newContent: {
                components,
              },
            });

            // const {
            //   components,
            // } = this.state;

            // this.setComponents(components);

            // this.props.components.splice(0, this.props.components.length);

            // components.map(n => {
            //   this.props.components.push(n);
            // });

            // this.updateParentComponents();

            // this.getActiveParent().updateObject({});

            // const {
            //   forceUpdate,
            // } = this.getEditorContext();

            // forceUpdate();


            // Object.assign(this.props, {
            //   components,
            // });


            // this.props.components = this.props.components.concat(components);

            // this.updateComponentProps({
            //   content,
            // });

            // this.setComponents(components || []);


          },
          onFocus: event => {

            // console.log("Tag onFocus", event);

            const {
              activeItem,
            } = this.getEditorContext();

            if (activeItem && activeItem === this) {
              this.setState({
                focused: true,
              });
            }

          },
          onBlur: event => {

            // console.log("Tag onBlur", event);

            const {
              activeItem,
            } = this.getEditorContext();


            if (activeItem === this) {

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

            this.setState({
              focused: false,
            });

          },
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
      // components: itemComponents,
    } = object;


    const {
      components: itemComponents,
    } = this.state;

    if (itemComponents && itemComponents.length) {

      return super.renderChildren(itemComponents);

    }

    else return text;
  }

  renderBadge(badge) {

    const {
      focused,
    } = this.state;

    return focused ? null : super.renderBadge(badge);
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


}

export default Tag;
