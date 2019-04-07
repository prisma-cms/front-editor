import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ConnectorContext } from '..';

import FiltersIcon from "material-ui-icons/FilterList";
import EditorComponent from '../..';


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


  renderMainView() {

    const {
    } = this.context;


    return <div
      {...this.getRenderProps()}
    >
      <ConnectorContext.Consumer>
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
      </ConnectorContext.Consumer>
    </div>;
  }

}

export default Filters;
