import React from 'react';
import ReactDOM from 'react-dom';

import EditorComponent from '../../../';
import CSSTransform from "./CSSTransform";

export default class HtmlTag extends EditorComponent {

  static Name = "HtmlTag"
  static help_url = "https://front-editor.prisma-cms.com/topics/html-tag.html";

  static defaultProps = {
    ...EditorComponent.defaultProps,
    tag: "span",
    // text: "",
    // color: "default",
    // displayType: "span",
    // display: "inline-block",
    // contentEditable: true,
    render_badge: false,
    can_be_edited: false,
  }




  constructor(props) {

    // console.log('HtmlTag constructor props', props);

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


    // console.log('components', components);
    // return;

    this.state = {
      ...this.state,
      focused: false,
      components: components ? components.slice(0) : [],
    }
  }


  isActive = () => {

    // console.log('isActiveisActiveisActiveisActive1111111111', this);

    const {
      inEditMode,
    } = this.getEditorContext();

    return inEditMode ? super.isActive() : true;
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

    console.log("TagEvent tagOnInput", event);
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

    console.log('onChangeContent', components);

    this.updateObject({
      components,
    });

    // Object.assign(this.state, {
    //   newContent: {
    //     components,
    //   },
    // });

    // this.setState({
    //   newContent: {
    //     components,
    //   },
    // });

  }


  tagOnFocus(event) {

    // console.log("TagEvent tagOnFocus", event);

    // if (this.isActive()) {
    // this.setState({
    //   focused: true,
    // });
    // }

  }


  tagOnBlur(event) {

    // console.log("TagEvent tagOnBlur", event);

    // if (activeItem === this) {
    // if (this.isActive()) {

    // this.saveChanges();

    // }

    // this.setState({
    //   focused: false,
    // });

  }


  /**
   * Сохраняем измененный контент (обновляем родительский объект)
   */
  // saveChanges() {

  //   const {
  //     newContent,
  //   } = this.state;

  //   if (newContent) {

  //     const {
  //       components,
  //     } = newContent;

  //     this.setComponents(components);

  //     this.setState({
  //       newContent: null,
  //     })

  //   }

  // }


  /**
   * Этот тег не должен редактироваться во фронт-редакторе
   */
  editable() {

    return false;
  }


  renderMainView(options = {}) {


    // const {
    //   inEditMode,
    //   // activeItem,
    // } = this.getEditorContext();

    const object = this.getObjectWithMutations();

    const {
      props,
      components,
      props: {
        tag,
        text,
      },
    } = object;

    if (!tag) {

      // return super.renderMainView({
      //   contentEditable: this.isActive(),
      //   suppressContentEditableWarning: true,
      //   ref: el => {
      //     this.container = el;

      //     // console.log('ref text', el);
      //   },
      //   children: text,
      // });

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

      // if (inEditMode) {
      if (this.editable()) {

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


        switch (tag) {

          case "a":

            Object.assign(style, {
              border: "1px solid green",
            });

            break;

          default: ;
        }



        options = {
          contentEditable: true,
          // contentEditable: activeItem === this,
          // contentEditable: this.isActive(),
          suppressContentEditableWarning: true,
          style,
          // onInput: event => this.tagOnInput(event),
          // onFocus: event => this.tagOnFocus(event),
          // onBlur: event => this.tagOnBlur(event),

          ref: el => {
            this.container = el;

            // if (el) {
            //   el.addEventListener("DOMSubtreeModified", a => console.log("DOMSubtreeModified", a));
            // }
          },
          ...options,
        }

        // console.log("options", options);

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

  //   // const {
  //   //   contentEditable,
  //   //   ...other
  //   // } = this.getComponentProps(this);

  //   // console.log('contentEditable', contentEditable, other);

  //   /**
  //    * Если принимать входящие изменения из стейта,
  //    * то уходим в бесконечное обновление.
  //    */
  //   return this.editable() ? false : super.shouldComponentUpdate ? super.shouldComponentUpdate() : true;
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

    // console.log("makeNewContent components", components);

    return content;
  }



  updateContent(node,
    content = {
      name: "HtmlTag",
      component: "HtmlTag",
      props: {},
      components: [],
    }) {



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

          case "props":
          case "object":
          case "data":

            return null;

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

              // console.log("CSSTransform style", value);

              value = value ? CSSTransform(value) : undefined;

              // console.log("CSSTransform new style", value);

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

        components.push(this.updateContent(node));

      });

      Object.assign(content, {
        components,
      });

    }

    content.props.tag = NodeName;

    return content;

  }



  addEventListeners() {

    const {
      inEditMode,
    } = this.getEditorContext();

    // console.log('addEventListeners inEditMode', inEditMode)

    if (inEditMode) {

      return;
    }

    // if (!this.readOnly()) {

    const {
      container,
    } = this;

    // console.log('addEventListeners container', container)

    if (container) {

      container.addEventListener("focusin", event => {

        // console.log('on focusin', event.target, event.currentTarget, event)
      });

      const config = {
        attributes: true,
        // attributeFilter: ["class"],
        childList: true,
        // subtree: true,
        characterData: true,
        characterDataOldValue: true,
        attributeOldValue: true,
      };


      // Create an observer instance linked to the callback function
      // const observer = new MutationObserver(this.onDOMSubtreeModified);
      const observer = new MutationObserver((changes, observer) => {

        console.log("MutationObserver changes", changes);
        console.log("MutationObserver container", container);

        // this.onChangeDom(container, changes, observer);

        const {
          components: components,
          props,
        } = this.getObjectWithMutations();

        let newComponents = components ? [].concat(components) : [];

        // console.log("MutationObserver current props", props);
        // console.log("MutationObserver current components", components);

        let data;
        let newProps = {
          ...props,
        }

        changes.map(n => {

          // console.log("MutationObserver change", n);

          const {
            type,
            target,
          } = n;

          // let nodeTarget = target.nodeType === Node.TEXT_NODE ? target.parentNode : target;

          // console.log("MutationObserver change nodeTarget", nodeTarget);

          if (container === target) {

            console.log("MutationObserver change target", target);
            console.log("MutationObserver change", n);

            // console.log("MutationObserver change container === nodeTarget", container === nodeTarget);

            switch (type) {

              case 'characterData':
                {

                  const {
                    target: {
                      nodeValue: text,
                    },
                    oldValue,
                  } = n;

                  console.log("MutationObserver characterData", n, oldValue, text);

                  if (text !== oldValue) {
                    data = {
                      ...data,
                      props: {
                        ...newProps,
                        text,
                      },
                    }
                  }


                }
                break;


              case 'attributes':

                // console.log('n.attributeName', n.attributeName);

                switch (n.attributeName) {

                  /**
                   * Пропускаем некоторые атрибуты
                   */
                  case 'props':
                  case 'components':
                  case 'component':
                  case 'data':
                  case 'object':

                    // console.log('n.attributeName skip', n.attributeName);

                    break;

                  default: ;
                }

                break;


              case 'childList':
                {
                  console.log("MutationObserver childList", n);

                  const {
                    target: {
                      nodeValue: text,
                    },
                    addedNodes,
                    removedNodes,
                  } = n;

                  if (addedNodes && addedNodes.length) {

                    console.log("MutationObserver addedNodes", addedNodes);

                    // addedNodes.forEach(addedNode => {

                    //   console.log("MutationObserver addedNode", typeof addedNode, addedNode);

                    //   // const content = this.makeNewContent(addedNode);
                    //   const content = this.updateContent(addedNode);

                    //   console.log("MutationObserver addedNode content", content);

                    //   if (content) {
                    //     newComponents.push(content);
                    //   }

                    // });

                  }

                  // const content = this.makeNewContent(container);

                  // console.log("MutationObserver childList content", content);

                  // newComponents = (content && content.components) || [];



                  data = {
                    ...data,
                    components: newComponents,
                  }

                }
                break;

              default: ;
            }

          }

          return null;
        });

        if (data) {

          console.log('Will updateObject data', JSON.stringify(data, true, 2));

          setTimeout(() => {
            if (window.confirm('Обновить компонент?')) {
              this.updateObject(data);
            }
          }, 1000);
        }

        // console.log("MutationObserver current newComponents", newComponents);

      });

      // Start observing the target node for configured mutations
      observer.observe(container, config);

      this.observer = observer;


      container.addEventListener("focusout", event => {

        // console.log('on focusout', event.target, event.currentTarget, event)

        if (this.observer) {

          // this.observer.disconnect();

          // this.observer = null;
        }

      });


    }

    document.addEventListener("selectionchange", this.onSelectionChange);

    // }

    super.addEventListeners && super.addEventListeners();

  }



  // componentDidMount() {

  //   // global.React = React;
  //   // global.ReactDOM = ReactDOM;

  //   // console.log('componentDidMount', this.props.props, this);

  //   // if (!this.container) {
  //   //   const node = ReactDOM.findDOMNode(this);

  //   //   node.reactComponent = this;

  //   //   this.container = node;
  //   // }

  //   this.addEventListeners();

  //   // if (!this.readOnly()) {

  //   //   this.setActiveItem(this);

  //   // }

  //   super.componentDidMount && super.componentDidMount();
  // }


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