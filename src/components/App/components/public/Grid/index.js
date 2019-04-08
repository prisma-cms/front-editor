import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../..';

import GridIcon from "material-ui-icons/GridOn";
import { Button } from 'material-ui';


class Grid extends EditorComponent {


  // static propTypes = {
  //   ...EditorComponent.propTypes,
  // }


  static defaultProps = {
    ...EditorComponent.defaultProps,
  }

  static Name = "Grid"

  onBeforeDrop = () => {

  }


  getEditorField(props) {

    const {
      key,
      name,
      value,
    } = props;


    switch (name) {

      case "container":
      case "item":

        console.log("getEditorField", props);

        return <Button
          key={key}
          size="small"
          variant="raised"
          onClick={event => {

            // const component = this.getActiveComponent();
            // this.updateComponentProperty(component, name === "container" ? "item" : "container", true);

            this.updateComponentProperty(name === "container" ? "item" : "container", true);

          }}
        >
          {name}
        </Button>

        break;

    }

    return super.getEditorField(props);
  }



  updateComponentProperty( name, value) {

    switch (name) {

      case "xs":
      case "sm":
      case "md":
      case "lg":
      case "xl":

        if (value === 0) {
          value = true;
        }
        else if (!value || typeof value !== "number" || value < 0 || value > 12) {
          return false;
        }

        break;

      // case "container":

      //   break;

    }


    return super.updateComponentProperty( name, value);
  }


  updateComponentProps( data) {

    // console.log("Grid updateComponentProps",   { ...data });

    if (data.container) {

      Object.assign(data, {
        item: undefined,
        xs: undefined,
        sm: undefined,
        md: undefined,
        lg: undefined,
        xl: undefined,
        alignItems: "flex-end",
      });

    }
    else if (data.item) {
      Object.assign(data, {
        container: undefined,
        alignItems: undefined,
        ...this.getItemDefaultProps(),
      });
    }

    return super.updateComponentProps( data);
  }


  removeProps(name) {


    switch (name) {

      case "container":
      case "item":

        return false;

        break;

    }


    return super.removeProps(name);
  }


  renderPanelView() {

    const {
      classes,
    } = this.context;

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <GridIcon /> Grid
    </div>);
  }


  prepareNewItem() {


    let newItem = super.prepareNewItem();



    if (!newItem) {
      return false;
    }

    const {
      dragItem,
    } = this.context;


    // console.log("prepareNewItem this.props", { ...this.props });

    let {
      props: {
        container,
      },
    } = this.props;



    const {
      name,
      props: {
        ...props
      },
    } = dragItem;


    switch (name) {

      case "Grid":

        if (container) {

          delete props.container;

          Object.assign(props, {
            ...this.getItemDefaultProps(),
            item: true,
          });
        }
        else {
          Object.assign(props, {
            container: true,
            alignItems: "flex-end",
            spacing: 0,
          });
        }


        break;

    }

    Object.assign(newItem, {
      props,
    });

    return newItem;

  }


  getItemDefaultProps() {

    return {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 3,
      xl: 2,
    };
  }


  prepareDragItemProps() {

    let props = super.prepareDragItemProps();

    Object.assign(props, {
      container: true,
    });

    return props;
  }


  getRootElement() {

    const {
      Grid: MaterialUiGrid,
    } = this.context;

    return MaterialUiGrid;
  }


  // renderMainView() {

  //   const {
  //     Grid: MaterialUiGrid,
  //   } = this.context;


  //   const {
  //     props,
  //     ...other
  //   } = this.getRenderProps();


  //   return <MaterialUiGrid
  //     {...other}
  //     {...props}
  //   >

  //     {super.renderMainView()}

  //   </MaterialUiGrid>;
  // }

}

export default Grid;
