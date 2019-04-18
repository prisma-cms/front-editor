import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import CSSTransform from "./transform";
import { withStyles } from 'material-ui';



const styles = {
  root: {

  },
  editable: {
    // border: "1px solid red",
    // minHeight: "50px",
    height: "100%",
    border: "0px solid transparent",
  },
}

class EditableText extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    components: PropTypes.object,
    inEditMode: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
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
      // content: "Some Editable Text",

      // content: [
      //   {
      //     text: "Some",
      //   },
      //   {
      //     text: "text",
      //   },
      // ],
      content: components || {
        children: [
          // {
          //   text: "abc",
          //   tag: "b",
          // },
          // {
          //   text: " fdsf ",
          //   // tag: "span",
          // },
          // {
          //   tag: "span",
          //   text: "Some awesome text",
          //   // onClick: event => alert("sdfs"),
          // },
          // {
          //   tag: "b",
          //   text: "bold",
          // },
          // {
          //   text: "text",
          // },
          // {
          //   tag: "span",
          //   text: "text with \n line \r break",
          // },
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



        // let NodeName = (node.nodeName || "SPAN").toLowerCase();


        // if (NodeName === "#text") {
        //   NodeName = undefined;
        // }

        children.push(this.updateContent(node, {}));

      });

      Object.assign(content, {
        children,
      });

    }

    content.tag = NodeName;

    return content;

    // return;

    // let inner = [];

    // let NodeName = (node.nodeName || "SPAN").toLowerCase();


    // if (NodeName === "#text") {
    //   NodeName = "span";
    // }

    // nodes.forEach(node => {



    //   let NodeName = (node.nodeName || "SPAN").toLowerCase();


    //   if (NodeName === "#text") {
    //     NodeName = "span";
    //   }

    //   switch (node.nodeType) {

    //     case Node.TEXT_NODE:



    //       // inner.push(<NodeName>
    //       //   {node.textContent}
    //       // </NodeName>);
    //       inner.push(node.textContent);

    //       break;


    //     default:
    //       inner = inner.concat(this.updateContent(node, []));
    //       ;

    //   }

    // });

    // // content.push(<NodeName>
    // //   {inner}
    // // </NodeName>);

    // Object.assign(content, {
    //   children: inner,
    // });

    // return content;
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

    // if (text) {
    //   return text;
    // }

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

    // let output = [content];

    // // if (children && children.length) {
    // //   // output = output.concat(children.map((n, index) => this.renderContent(n, index))).reduce((curr, next) => [curr, " ", next]);
    // //   output = output.concat(children.map((n, index) => this.renderContent(n, index)));
    // // }

    // return output;

    // return <Fragment>
    //   {content}{children ? children.map((n, index) => this.renderContent(n, index)) : null}
    // </Fragment>;

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
    // Display fallback UI
    // this.setState({ hasError: true }); 

    console.error(error, info);
  }


  render() {

    const {
      content,
      newContent,
    } = this.state;

    const {
      onChange,
      inEditMode,
      classes,
    } = this.props;




    // const renderContent = this.renderContent(content);


    console.log("TextArea props", { ...this.props });


    return (
      <div>
        <Renderer
          key="content"
          className={[classes.root, inEditMode ? classes.editable : ""].join(" ")}
          contentEditable={inEditMode ? true : false}
          suppressContentEditableWarning
          onInput={event => {

            const {
              nativeEvent: {
                inputType,
              },
            } = event;





            // event.preventDefault();

            const node = event.target;


            const content = this.makeNewContent(node);

            // let content = this.updateContent(node, {
            //   children: [],
            // });





            let newState = {
              newContent: content,
            };

            // switch (inputType) {

            //   case "insertFromPaste":


            //     break;

            //   case "deleteContentBackward":



            //     break;
            // }

            Object.assign(newState, {
              // content,
            });

            Object.assign(this.state, newState);

            // this.setState(newState, () => {

            // });


            onChange(content);

            // this.forceUpdate();

            // setTimeout(() => {
            //   this.setState({
            //     content: { ...content },
            //   });
            // }, 1000);

            setTimeout(() => {
              this.forceUpdate();
            }, 1000);

            // setTimeout(() => {
            //   this.setState({
            //     content: {
            //       children: [
            //         {
            //           text: "abc",
            //           tag: "span",
            //         },
            //         {
            //           text: " fdsf ",
            //           // tag: "span",
            //         },
            //         {
            //           tag: "span",
            //           text: "Some awesome text",
            //           // onClick: event => alert("sdfs"),
            //         },
            //         // {
            //         //   tag: "b",
            //         //   text: "bold",
            //         // },
            //         {
            //           text: "text",
            //         },
            //         {
            //           tag: "span",
            //           text: "text with \n line \r break",
            //         },
            //       ],
            //     },
            //   });
            // }, 1000);

          }}
        // onPaste={event => {



        //   event.preventDefault();

        //   const currentTarget = event.currentTarget;

        //   const node = event.target;

        //   node.insertAdjacentHTML('afterend', '<b>wfewf</b>')

        //   const content = this.makeNewContent(currentTarget);



        //   setTimeout(() => {
        //     this.setState({
        //       content,
        //     });
        //   }, 1000);


        //   return false;
        // }}
        // onCut={event => {



        //   return false;
        // }}
        // onDelete={event => {



        //   // event.preventDefault();

        //   // const currentTarget = event.currentTarget;

        //   // const node = event.target;

        //   // node.insertAdjacentHTML('afterend', '<b>wfewf</b>')

        //   // const content = this.makeNewContent(currentTarget);



        //   // setTimeout(() => {
        //   //   this.setState({
        //   //     content,
        //   //   });
        //   // }, 1000);


        //   return false;
        // }}
        // style={{
        //   border: inEditMode ? "1px solid #ddd" : undefined,
        //   // whiteSpace: "pre-wrap",
        // }}
        >
          {/* {newContent || content} */}

          {/* {renderContent} */}

          {this.renderContent(content) || <div>d</div>}

        </Renderer>

        {/* {newContent ?
          <div
            style={{
              marginTop: 10,
            }}
          >
            {this.renderContent(newContent)}
          </div>
          : null
        } */}
      </div>
    );
  }
}

const Renderer = function (props) {

  return <div
    {...props}
  >

  </div>
}


export default withStyles(styles)(props => <EditableText
  {...props}
/>);