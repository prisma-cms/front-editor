import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../../..';

import Icon from "material-ui-icons/SettingsOverscan";

import { Switch as RouterSwitch } from "react-router-dom";

class Switch extends EditorComponent {


  static Name = "Switch"


  static propTypes = {
    ...EditorComponent.propTypes,
    showRoutes: PropTypes.bool.isRequired,
  };


  static defaultProps = {
    ...EditorComponent.defaultProps,
    showRoutes: false,
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
      if (name !== "Route") {
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


  renderMainView() {

    const {
      inEditMode,
    } = this.context;

    let content = null

    if (inEditMode) {
      content = <RouterSwitch>
        {super.renderMainView()}
      </RouterSwitch>
    }
    else {
      content = <RouterSwitch>
        {super.renderChildren()}
      </RouterSwitch>
    }

    return content;
  }



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


  //       let Component = Components.find(n => n.Name === name);

  //       if (Component) {

  //         let component = <Component
  //           key={id || index}
  //           mode="main"
  //           // component={n}
  //           parent={this}
  //           // props={props}
  //           data={{
  //             object: n,
  //           }}
  //           // _dirty={n}
  //           showRoutes={showRoutes}
  //           {...props}
  //           {...other}
  //         />;


  //         /**
  //          * Если в режиме редактирования и показывать роутеры, то выводим данные
  //          */
  //         if (inEditMode && showRoutes) {

  //           // component = 

  //         }

  //         output.push(component);

  //       }

  //     })

  //   }


  //   return output;
  // }

}

export default Switch;
