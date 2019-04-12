import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../../..';

import Icon from "material-ui-icons/SettingsOverscan";

import {
  Switch as RouterSwitch,
  Route,
} from "react-router-dom";
import { Typography } from 'material-ui';

class EditorSwitch extends EditorComponent {


  static Name = "EditorSwitch"


  static propTypes = {
    ...EditorComponent.propTypes,
    showRoutes: PropTypes.bool.isRequired,
  };


  static defaultProps = {
    ...EditorComponent.defaultProps,
    showRoutes: true,
  }



  prepareDragItemComponents() {

    return super.prepareDragItemComponents().concat([
      {
        name: "EditorRoute",
        props: {
          path: "/",
          exact: true,
        },
        components: [],
      }
    ]);
  }


  onDrop(event) {

    const {
      dragItem,
      dragTarget,
    } = this.context;

    if (dragItem && dragTarget && dragTarget === this) {

      event.preventDefault();
      event.stopPropagation();

      const {
        name,
      } = dragItem;

      /**
       * Позволяем добавить только роутеры
       */
      if (name !== "EditorRoute") {
        return false;
      }
    }

    return super.onDrop(event);

  }



  renderPanelView() {

    const {
      classes,
    } = this.context;

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      Router Switch
    </div>);
  }


  // renderMainView() {

  //   const {
  //     inEditMode,
  //   } = this.context;

  //   let content = null

  //   if (inEditMode) {
  //     content = <RouterSwitch>
  //       {super.renderMainView()}
  //     </RouterSwitch>
  //   }
  //   else {
  //     content = <RouterSwitch>
  //       {super.renderChildren()}
  //     </RouterSwitch>
  //   }

  //   return content;
  // }


  // renderMainView() {


  //   return <div

  //   >
  //     dsf
  //     <RouterSwitch>

  //       <Route
  //         path="/"
  //         exact={false}
  //       >
  //         1dsfds
  //       </Route>

  //       <div
  //         path="/"
  //         exact={false}
  //       >
  //         1dsfds
  //       </div>

  //       <div>
  //         4234dsfds
  //       </div>

  //     </RouterSwitch>
  //   </div>
  // }



  // renderChildren() {

  //   return <RouterSwitch>
  //     {super.renderChildren()}
  //   </RouterSwitch>;
  // }


  // renderChildren() {

  //   const {
  //     inEditMode,
  //   } = this.context;

  //   const {
  //     showRoutes,
  //   } = this.props;

  //   const {

  //   } = this.getRenderProps();

  //   const object = this.getObjectWithMutations();

  //   const {
  //     Components,
  //     // components,
  //     updateObject,
  //   } = this.context;


  //   const {
  //     props,
  //     components: itemComponents,
  //   } = object;


  //   let output = [];


  //   if (itemComponents && itemComponents.length) {

  //     itemComponents.map((n, index) => {

  //       const {
  //         id,
  //         name,
  //         props,
  //         ...other
  //       } = n;

  //       const {
  //         exact,
  //         path,
  //         routername,
  //       } = props;

  //       let Component = Components.find(n => n.Name === name);

  //       if (Component) {

  //         let component = <Route
  //           key={id || index}
  //           exact={exact === undefined ? true : exact}
  //           path={path}
  //           render={() => {
  //             return <Component
  //               // key={id || index}
  //               mode="main"
  //               // component={n}
  //               parent={this}
  //               props={props}
  //               data={{
  //                 object: n,
  //               }}
  //               exact={exact}
  //               path={path}
  //               routername={routername}
  //               // _dirty={n}
  //               showRoutes={showRoutes}
  //               {...other}
  //               {...props}
  //             />;
  //           }}
  //         />


  //         /**
  //          * Если в режиме редактирования и показывать роутеры, то выводим данные
  //          */
  //         if (inEditMode && showRoutes) {

  //           component = <Fragment>
  //             <Typography>
  //               {routername} <Typography
  //                 component="span"
  //                 variant="caption"
  //                 style={{
  //                   display: "inline-block",
  //                 }}
  //               >
  //                 {path}{!exact ? "*" : ""}
  //               </Typography>
  //             </Typography>

  //             {component}

  //           </Fragment>

  //         }

  //         output.push(component);

  //       }

  //     })

  //   }

  //   return <RouterSwitch>
  //     {output}
  //   </RouterSwitch>;
  // }


  renderChildren() {

    const {
      inEditMode,
    } = this.context;

    // const {
    //   showRoutes,
    // } = this.props;

    const {
      showRoutes,
    } = this.getComponentProps(this);

    console.log("renderChildren", this.getComponentProps(this));

    const {

    } = this.getRenderProps();

    const object = this.getObjectWithMutations();

    const {
      Components,
      // components,
      updateObject,
    } = this.context;


    const {
      props,
      components: itemComponents,
    } = object;


    let output = [];


    const routesShowed = inEditMode && showRoutes;


    if (itemComponents && itemComponents.length) {

      itemComponents.map((n, index) => {

        const {
          id,
          name,
          props,
          ...other
        } = n;

        const {
          exact,
          path,
          routername,
        } = props;

        let Component = Components.find(n => n.Name === name);

        if (Component) {

          let component;


          let element = <Component
            // key={id || index}
            mode="main"
            // component={n}
            parent={this}
            props={props}
            data={{
              object: n,
            }}
            exact={exact}
            path={path}
            routername={routername}
            // _dirty={n}
            showRoutes={showRoutes}
            {...other}
            {...props}
          />;


          let route = <Route
            key={id || index}
            exact={exact === undefined ? true : exact}
            path={path}
            render={() => {
              return element;
            }}
          />

          /**
           * Если в режиме редактирования и показывать роутеры, то выводим данные
           */
          // if (inEditMode && showRoutes) {
          if (routesShowed) {

            component = <Fragment
              key={id || index}
            >
              <Typography>
                {routername} <Typography
                  component="span"
                  variant="caption"
                  style={{
                    display: "inline-block",
                  }}
                >
                  {path}{!exact ? "*" : ""}
                </Typography>
              </Typography>

              {route}

            </Fragment>

          }
          else {

            // component = <Route
            //   key={id || index}
            //   exact={exact === undefined ? true : exact}
            //   path={path}
            //   render={() => {
            //     return element;
            //   }}
            // />

            component = route;

          }


          output.push(component);

        }

      })

    }

    if (routesShowed) {
      return output;
    }
    else {
      return <RouterSwitch>
        {output}
      </RouterSwitch>;
    }

  }

}

export default EditorSwitch;
