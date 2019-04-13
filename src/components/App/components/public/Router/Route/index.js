import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../../..';

import Icon from "material-ui-icons/SettingsOverscan";

import { Route as RouterRoute } from "react-router-dom";
import { Typography } from 'material-ui';

class EditorRoute extends EditorComponent {


  static Name = "EditorRoute"

  static propTypes = {
    ...EditorComponent.propTypes,
    exact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    routername: PropTypes.string,
  };

  static defaultProps = {
    ...EditorComponent.defaultProps,
    exact: false,
    path: "",
    routername: "",
  }


  renderPanelView() {

    const {
      classes,
    } = this.context;

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      Router
    </div>);
  }


  prepareDragItemProps() {

    return {
      ...super.prepareDragItemProps(),
      exact: false,
    }
  }


  // onDrop(event) {

  //   const {
  //     dragItem,
  //     dragTarget,
  //   } = this.context;









  //   if (dragItem && dragTarget && dragItem === this) {



  //     if (dragTarget.constructor.Name !== "EditorSwitch") {

  //       event.preventDefault();
  //       event.stopPropagation();
  //       return false;
  //     }

  //   }

  //   return super.onDrop(event);

  // }

  /**
   * Учитывается при наведении. 
   * Определяет может ли быть брошен сюда перетаскиваемый элемент
   */
  canBeDropped(dragItem) {




    /**
     * Нельзя роутеры сюда же кидать
     */
    if (dragItem && dragItem.constructor === this.constructor) {
      return false;
    }

    // else
    return super.canBeDropped(dragItem);

  }


  // renderMainView() {

  //   const {
  //     inEditMode,
  //   } = this.context;

  //   const {
  //     parent,
  //   } = this.props;

  //   const {
  //     showRoutes,
  //   } = parent.getComponentProps(parent);



  //   if (inEditMode && showRoutes) {
  //     return super.renderMainView();
  //   }

  //   else return this.renderChildren();
  // }


  // getRootElement(){

  //   return RouterRoute;
  // }

  // renderMainView() {

  //   const {
  //     inEditMode,
  //   } = this.context;

  //   const {
  //     exact,
  //     path,
  //     parent,
  //   } = this.props;

  //   const {
  //     showRoutes,
  //   } = parent.getComponentProps(parent);



  //   if (inEditMode && showRoutes) {
  //     return super.renderMainView();
  //   }

  //   // else return this.renderChildren();

  //   return <RouterRoute
  //     exact={exact}
  //     path={path}
  //     render={props => {
  //       return super.renderMainView();
  //     }}
  //   >
  //   </RouterRoute>;
  // }


  // renderChildren() {

  //   const {
  //     inEditMode,
  //   } = this.context;

  //   let content = null

  //   const {
  //     routername,
  //     path,
  //     exact,
  //     ...other
  //   } = this.getComponentProps(this);


  //   if (!path) {
  //     return null;
  //   }

  //   const {
  //     parent,
  //   } = this.props;


  //   const {
  //     showRoutes,
  //   } = parent.getComponentProps(parent);







  //   if (inEditMode && showRoutes) {
  //     content = <Fragment>
  //       <Typography>
  //         {routername} <Typography
  //           component="span"
  //           variant="caption"
  //           style={{
  //             display: "inline-block",
  //           }}
  //         >
  //           {path}{!exact ? "*" : ""}
  //         </Typography>
  //       </Typography>

  //       {/* <RouterRoute
  //         path={path}
  //         exact={exact}
  //         render={props => {
  //           return super.renderChildren();
  //         }}
  //       /> */}

  //       {super.renderChildren()}

  //     </Fragment>

  //   }
  //   else {
  //     // content = <RouterRoute
  //     //   path={path}
  //     //   exact={exact}
  //     //   render={props => {
  //     //     return super.renderChildren();
  //     //   }}
  //     // />

  //     content = super.renderChildren();
  //   }

  //   return content;
  // }

  // renderChildren() {

  //   const {
  //     inEditMode,
  //   } = this.context;

  //   let content = null

  //   const {
  //     routername,
  //     path,
  //     exact,
  //     ...other
  //   } = this.getComponentProps(this);


  //   if (!path) {
  //     return null;
  //   }

  //   const {
  //     parent,
  //   } = this.props;


  //   const {
  //     showRoutes,
  //   } = parent.getComponentProps(parent);







  //   if (inEditMode && showRoutes) {
  //     content = <Fragment>
  //       <Typography>
  //         {routername} <Typography
  //           component="span"
  //           variant="caption"
  //           style={{
  //             display: "inline-block",
  //           }}
  //         >
  //           {path}{!exact ? "*" : ""}
  //         </Typography>
  //       </Typography>

  //       {/* <RouterRoute
  //         path={path}
  //         exact={exact}
  //         render={props => {
  //           return super.renderChildren();
  //         }}
  //       /> */}

  //       {super.renderChildren()}

  //     </Fragment>

  //   }
  //   else {
  //     // content = <RouterRoute
  //     //   path={path}
  //     //   exact={exact}
  //     //   render={props => {
  //     //     return super.renderChildren();
  //     //   }}
  //     // />

  //     content = super.renderChildren();
  //   }

  //   return content;
  // }



  // renderChildren() {

  //   const {
  //     inEditMode,
  //   } = this.context;

  //   let content = null

  //   const {
  //     routername,
  //     path,
  //     exact,
  //     ...other
  //   } = this.getComponentProps(this);


  //   if (!path) {
  //     return null;
  //   }

  //   const {
  //     parent,
  //   } = this.props;


  //   const {
  //     showRoutes,
  //   } = parent.getComponentProps(parent);







  //   if (inEditMode && showRoutes) {
  //     content = <Fragment>
  //       <Typography>
  //         {routername} <Typography
  //           component="span"
  //           variant="caption"
  //           style={{
  //             display: "inline-block",
  //           }}
  //         >
  //           {path}{!exact ? "*" : ""}
  //         </Typography>
  //       </Typography>

  //       <RouterRoute
  //         path={path}
  //         exact={exact}
  //         render={props => {
  //           return super.renderChildren();
  //         }}
  //       />

  //     </Fragment>

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

export default EditorRoute;
