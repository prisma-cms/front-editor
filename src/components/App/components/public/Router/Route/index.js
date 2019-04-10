import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../../..';

import Icon from "material-ui-icons/SettingsOverscan";

import { Route as RouterRoute } from "react-router-dom";
import { Typography } from 'material-ui';

class Route extends EditorComponent {


  static Name = "Route"

  static propTypes = {
    ...EditorComponent.propTypes,
    exact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    routername: PropTypes.string,
  };

  static defaultProps = {
    ...EditorComponent.defaultProps,
    exact: true,
    path: "",
    routername: "",
  }


  // renderPanelView() {

  //   const {
  //     classes,
  //   } = this.context;

  //   return super.renderPanelView(<div
  //     className={classes.panelButton}
  //   >
  //     Route
  //   </div>);
  // }


  // renderMainView() {

  //   const {
  //     inEditMode,
  //   } = this.context;

  //   let content = null

  //   const {
  //     routername: name,
  //     path,
  //     exact,
  //     showRoutes,
  //     ...other
  //   } = this.getComponentProps(this);

  //   // // console.log("Route other", other);


  //   // if (inEditMode && showRoutes || true) {
  //   if (true) {
  //     content = <RouterRoute
  //       path={path}
  //       exact={exact}
  //       render={props => {
  //         return <Fragment>
  //           <Typography>
  //             {name} <Typography
  //               component="span"
  //               variant="caption"
  //               style={{
  //                 disaply: "inline-block",
  //               }}
  //             >
  //               {path}{exact ? "/*" : ""}
  //             </Typography>
  //           </Typography>
  //           {super.renderMainView()}
  //         </Fragment>
  //       }}
  //     />
  //   }
  //   else {
  //     content = <RouterRoute
  //       path={path}
  //       exact={exact}
  //       render={props => {
  //         return super.renderChildren();
  //       }}
  //     />
  //   }

  //   return content;
  // }


  // renderMainView() {
  //   return this.renderChildren();
  // }

  renderMainView() {

    const {
      inEditMode,
    } = this.context;

    const {
      parent,
    } = this.props;

    const {
      showRoutes,
    } = parent.getComponentProps(parent);

    if (inEditMode && showRoutes) {
      return super.renderMainView();
    }

    else return this.renderChildren();
  }


  renderChildren() {

    const {
      inEditMode,
    } = this.context;

    let content = null

    const {
      routername,
      path,
      exact,
      ...other
    } = this.getComponentProps(this);


    if(!path) {
      return null;
    }

    const {
      parent,
    } = this.props;


    const {
      showRoutes,
    } = parent.getComponentProps(parent);

    // console.log("Route other", other);

    // console.log("Route showRoutes", showRoutes);


    if (inEditMode && showRoutes) {
      content = <Fragment>
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

        <RouterRoute
          path={path}
          exact={exact}
          render={props => {
            return super.renderChildren();
          }}
        />

      </Fragment>

    }
    else {
      content = <RouterRoute
        path={path}
        exact={exact}
        render={props => {
          return super.renderChildren();
        }}
      />
    }

    return content;
  }


  // renderMainView() {

  //   // const {
  //   //   inEditMode,
  //   // } = this.context;

  //   let content = null

  //   const {
  //     routername,
  //     path,
  //     exact,
  //     ...other
  //   } = this.getComponentProps(this);

  //   console.log("Route other", other);

  //   content = <RouterRoute
  //     path={path}
  //     exact={exact}
  //     render={props => {
  //       return super.renderChildren();
  //     }}
  //   />

  //   return content;
  // }

  // renderChildren() {

  //   const {
  //     inEditMode,
  //   } = this.context;

  //   let content = null

  //   const {
  //     name,
  //     path,
  //     exact,
  //     ...other
  //   } = this.getComponentProps(this);

  //   // // console.log("Route other", other);


  //   if (inEditMode) {
  //     content = <RouterRoute
  //       path={path}
  //       exact={exact}
  //       render={props => {
  //         return <Fragment>
  //           <Typography>
  //             {name} <Typography
  //               component="span"
  //               variant="caption"
  //               style={{
  //                 disaply: "inline-block",
  //               }}
  //             >
  //               {path}{exact ? "/*" : ""}
  //             </Typography>
  //           </Typography>
  //           {super.renderChildren()}
  //         </Fragment>
  //       }}
  //     />
  //   }
  //   else {
  //     content = <RouterRoute
  //       path={path}
  //       exact={exact}
  //       render={props => {
  //         return super.renderChildren();
  //       }}
  //     />
  //   }

  //   return content;
  // }



}

export default Route;
