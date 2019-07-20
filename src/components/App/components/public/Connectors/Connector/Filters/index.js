import React, { Component, Fragment } from 'react';
import PropTypes, { bool } from 'prop-types';

import Connector, { ConnectorContext } from '..';

import FiltersIcon from "material-ui-icons/FilterList";
import EditorComponent from '../../../..';


import PrismaCmsFilters from "@prisma-cms/filters";
import ObjectConnector from '../../ObjectConnector';

import PrismaCmsPerformanceTester from "@prisma-cms/performance";

class Filters extends EditorComponent {

  static Name = "Filters"

  static propsTypes = {
    ...EditorComponent.propsTypes,
    visible: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    ...EditorComponent.defaultProps,
    visible: true,
    hide_wrapper_in_default_mode: true,
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


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
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

        return <Fragment>
          <PrismaCmsPerformanceTester
            props={this.props}
            state={this.state}
            context={this.context}
            prefix="filters_performance"
          />
          
          <PrismaCmsFilters
            queryName={queryName}
            filters={filters}
            setFilters={setFilters}
          />

        </Fragment>

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
