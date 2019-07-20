import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../../..';

// import Icon from "material-ui-icons/SettingsOverscan";

import {
  Switch as RouterSwitch,
  Route,
} from "react-router-dom";
import Typography from 'material-ui/Typography';
import EditorRoute from '../Route';
import { RouteContext } from '../../../../context';

import PrismaCmsPerformanceTester from "@prisma-cms/performance";

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



  // prepareDragItemComponents() {

  //   return super.prepareDragItemComponents().concat([
  //     {
  //       name: "EditorRoute",
  //       component: "EditorRoute",
  //       props: {
  //         path: "/",
  //         exact: true,
  //       },
  //       components: [],
  //     }
  //   ]);
  // }


  // onDrop(event) {

  //   const {
  //     dragItem,
  //     dragTarget,
  //   } = this.getEditorContext();

  //   if (dragItem && dragTarget && dragTarget === this) {

  //     event.preventDefault();
  //     event.stopPropagation();

  //     const {
  //       name,
  //     } = dragItem;

  //     /**
  //      * Позволяем добавить только роутеры
  //      */
  //     if (name !== "EditorRoute") {
  //       return false;
  //     }
  //   }

  //   return super.onDrop(event);

  // }


  /**
   * Не может быть дочерним для другого роутера
   */
  canBeChild(child) {

    return child instanceof EditorRoute && super.canBeChild(child);
  }



  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        Router Switch
    </div>);
  }


  renderMainView() {

    const {
      inEditMode,
    } = this.getEditorContext();

    return inEditMode ? super.renderMainView() : this.renderChildren();

  }


  renderChildren() {

    const {
      Grid,
    } = this.context;

    const {
      inEditMode,
    } = this.getEditorContext();

    const {
      mutate,
      createTemplate,
      updateTemplate,
    } = this.props;

    const {
      showRoutes,
    } = this.getComponentProps(this);



    const {

    } = this.getRenderProps();

    const object = this.getObjectWithMutations();

    // const {
    //   // Components,
    //   // components,
    //   updateObject,
    // } = this.context;


    // const Components = this.getComponents();
    const {
      Components,
    } = this.getEditorContext();


    const {
      props,
      components: itemComponents,
    } = object;


    let output = [];

    let header;


    const routesShowed = inEditMode && showRoutes;


    if (itemComponents && itemComponents.length) {

      let menuItems = []

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


          let route = <Route
            key={id || index}
            exact={exact === undefined ? false : exact}
            path={path}
            render={(routerProps) => {

              /**
              ToDo: Удалить routerProps, потому что передает каждый раз новый объект
              и Роуты перерендериваются
               */

              return <RouteContext.Provider
                value={routerProps}
              >
                <Component
                  // key={id || index}
                  mode="main"
                  // component={n}
                  parent={this}
                  props={props}
                  // data={{
                  //   object: n,
                  // }}
                  object={n}
                  exact={exact}
                  path={path}
                  routername={routername}
                  // _dirty={n}
                  showRoutes={showRoutes}
                  createTemplate={createTemplate}
                  updateTemplate={updateTemplate}
                  {...other}
                  {...props}
                  {...routerProps}
                />
              </RouteContext.Provider>
            }}
          />

          /**
           * Если в режиме редактирования и показывать роутеры, то выводим данные
           */
          // if (inEditMode && showRoutes) {
          if (routesShowed) {

            const key = `${id}-${index}`;

            const title = <Typography>
              {routername} <Typography
                component="span"
                variant="caption"
                style={{
                  display: "inline-block",
                }}
              >
                {path}{!exact ? "*" : ""}
              </Typography>
            </Typography>;

            component = <Fragment
              key={key}
            >
              {title}

              {route}

            </Fragment>




            menuItems.push(<Grid
              key={key}
              item
            >
              {title}
            </Grid>);

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

      });


      header = <Grid
        container
        spacing={16}
      >
        {menuItems}
      </Grid>

    }

    let result = null;

    if (routesShowed) {
      result = <Fragment>
        {header}
        {output}
      </Fragment>;
    }
    else {
      result = <RouterSwitch>
        {output}
      </RouterSwitch>;
    }

    return <Fragment>
      <PrismaCmsPerformanceTester
        props={this.props}
        state={this.state}
        context={this.context}
        prefix="switch_performance"
      />

      {result}

    </Fragment>

    return result;

  }

}

export default EditorSwitch;
