import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ConnectorContext } from '..';

import FiltersIcon from "material-ui-icons/FilterList";
import EditorComponent from '../../../..';


import PrismaCmsFilters from "@prisma-cms/filters";

class Filters extends EditorComponent {

  static Name = "Filters"


  renderPanelView() {

    const {
      classes,
    } = this.context;

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <FiltersIcon /> Filters
    </div>);
  }


  renderChildren() {

    const {
    } = this.context;


    return <ConnectorContext.Consumer>
      {context => {

        console.log("Filters context", context);

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
