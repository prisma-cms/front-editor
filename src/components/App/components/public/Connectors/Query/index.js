import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../../../';

import Icon from "material-ui-icons/SwapHoriz";

import QueryBuilder from "@prisma-cms/query-builder";


class Query extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
  }

  static Name = "Query"

  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <Icon /> Query
    </div>);
  }


  renderChildren() {

    // console.log("QueryProps", { ...this });

    const {
      activeItem,
    } = this.getEditorContext();

    let output = null;


    const {
      query,
    } = this.getComponentProps(this);


    if (activeItem && activeItem === this) {
      output = <div
        style={{
          height: "80vh",
        }}
      >
        <QueryBuilder
          query={query || ""}
          onEditQuery={query => {
            this.updateComponentProperty("query", query)
          }}
        />
      </div>;
    }
    else {
      output = super.renderChildren();
    }

    return output;

  }

}

export default Query;
