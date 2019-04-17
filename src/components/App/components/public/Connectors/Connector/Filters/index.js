import React, { Component } from 'react';
import PropTypes, { bool } from 'prop-types';

import { ConnectorContext } from '..';

import FiltersIcon from "material-ui-icons/FilterList";
import EditorComponent from '../../../..';


import PrismaCmsFilters from "@prisma-cms/filters";

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
          query,
          filters,
          setFilters,
          ...other
        } = context;

        if (!query) {
          return null;
        }


        return <PrismaCmsFilters
          queryName={query}
          filters={filters}
          setFilters={setFilters}
        />;

      }}
    </ConnectorContext.Consumer>;
  }

}

export default Filters;
