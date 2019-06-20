import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../..';

import Icon from "material-ui-icons/Link";

import { Link as MuiLink } from "react-router-dom";
import { ObjectContext } from '../Connectors/Connector/ListView';

class Link extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    // native: false,
    to: "",
    target: "",
  }

  static Name = "Link"

  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        <Icon /> Link
    </div>);
  }


  getRootElement() {


    return MuiLink;

  }


  // prepareDragItemComponents() {

  //   return super.prepareDragItemComponents().concat([
  //     {
  //       name: "Tag",
  //       component: "Tag",
  //       props: {
  //         tag: "span",
  //       },
  //       components: [],
  //     }
  //   ]);
  // }


  // getRenderProps() {

  //   let renderProps = super.getRenderProps();




  //   // let test = <ObjectContext.Consumer>
  //   //   {context => {



  //   //     {/* return content; */}
  //   //   }}
  //   // </ObjectContext.Consumer>

  //   return renderProps;

  // }


  renderMainView() {

    const object = this.getObjectWithMutations();


    // const {
    // } = this.props;

    let {
      to,
      native,
      ...props
    } = this.getComponentProps(this);


    // let content = super.renderMainView();;



    if (to) {
      /**
       * Проверяем есть ли параметры в УРЛ
       */

      let segments = to.split("/");



      /**
       * Если есть, то нам надо обернуть вывод в контекст объекта
       */
      if (segments.find(n => n && n.startsWith(":"))) {

        return <ObjectContext.Consumer>
          {context => {

            const {
              object,
            } = context;

            if (object) {

              to = segments.map(n => {

                if (n && n.startsWith(":")) {
                  n = object[n.replace(/^\:/, '')];
                }

                return n;
              }).join("/");

            }

            return super.renderMainView({
              to,
            });
          }}
        </ObjectContext.Consumer>
      }

    }


    return super.renderMainView();
  }

  // getRenderProps() {

  //   const {
  //     style,
  //     marginTop,
  //     marginBottom,
  //     // props: {
  //     //   ...otherProps
  //     // },
  //     ...other
  //   } = super.getRenderProps();

  //   // const {
  //   //   text,
  //   //   // type,
  //   //   // style,
  //   //   color,
  //   //   display,
  //   //   displayType,
  //   //   ...otherProps
  //   // } = this.getComponentProps(this);





  //   const renderProps = {
  //     style: {
  //       ...style,
  //       marginTop,
  //       marginBottom,
  //     },
  //     ...other,
  //     // ...otherProps
  //   }




  //   return renderProps;
  // }

  // renderMainView() {

  //   // const {
  //   //   marginTop,
  //   //   marginBottom,
  //   // } = this.getComponentProps(this);

  //   const {
  //     style,
  //     marginTop,
  //     marginBottom,
  //     ...other
  //   } = this.getRenderProps();

  //   return <div
  //     style={{
  //       marginTop,
  //       marginBottom,
  //       ...style,
  //     }}
  //     {...other}
  //   >
  //     {super.renderMainView()}
  //   </div>;
  // }

}

export default Link;
