import React, { Component } from 'react';
import PropTypes, { bool } from 'prop-types';

import Connector, { ConnectorContext } from '..';

import FiltersIcon from "material-ui-icons/FilterList";
import EditorComponent from '../../../..';


import PrismaCmsFilters from "@prisma-cms/filters";
import ObjectConnector from '../../ObjectConnector';

class Filters extends EditorComponent {

  static Name = "Filters"

  static propsTypes = {
    ...EditorComponent.propsTypes,
    visible: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    ...EditorComponent.defaultProps,
    visible: true,
  }


  canBeChild(child) {

    return false;
  }


  canBeParent(parent) {


    let can = false;

    // return false;

    if (super.canBeParent(parent)) {

      while (parent) {

        if (parent instanceof Connector || parent instanceof ObjectConnector) {

          can = true;

          break;
        }

        parent = parent.props.parent;
      }

    }

    return can;
  }


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <FiltersIcon /> Filters
    </div>);
  }


  renderChildren() {

    const {
      inEditMode,
    } = this.getEditorContext();

    const {
      visible,
    } = this.getComponentProps(this);




    if (!visible && !inEditMode) {

      return null
    }

    return <ConnectorContext.Consumer>
      {context => {



        const {
          queryName,
          filters,
          setFilters,
          ...other
        } = context;

        if (!queryName) {
          return null;
        }


        return <PrismaCmsFilters
          queryName={queryName}
          filters={filters}
          setFilters={setFilters}
        />;

      }}
    </ConnectorContext.Consumer>;
  }

}

export default Filters;
