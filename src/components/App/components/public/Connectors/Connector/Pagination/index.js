import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Connector, { ConnectorContext } from '..';

import PaginationIcon from "material-ui-icons/LastPage";
import EditorComponent from '../../../..';

class Pagination extends EditorComponent {

  static Name = "Pagination"

  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
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
        <PaginationIcon /> Pagination
    </div>);
  }


  canBeChild(child) {

    return false;
  }


  canBeParent(parent) {


    let can = false;

    // return false;

    if (super.canBeParent(parent)) {

      while (parent) {

        if (parent instanceof Connector) {

          can = true;

          break;
        }

        parent = parent.props.parent;
      }

    }

    return can;
  }


  renderChildren() {

    const {
      Pagination: PrismaCmsPagination,
    } = this.context;

    return <Fragment
      key="pagination"
    >
      <ConnectorContext.Consumer>
        {context => {



          const {
            data,
            pageVariable = "page",
            ...other
          } = context;

          if (!data) {
            return;
          }

          const {
            objectsConnection,
            variables,
          } = data;

          if (!objectsConnection) {
            return null;
          }

          const {
            aggregate: {
              count: total,
            },
          } = objectsConnection;



          const {
            first: limit,
          } = variables || {};


          const {
            uri,
          } = this.context;


          let {
            [pageVariable]: page,
          } = uri.query(true);


          page = parseInt(page) || 0;





          return <PrismaCmsPagination
            pageVariable={pageVariable}
            limit={limit}
            total={total}
            page={page || 1}
          />;

          {/* if (!object) {
            return null;
          }

          return <PrismaCmsPagination
            user={object}
          /> */}

        }}
      </ConnectorContext.Consumer>

      {super.renderChildren()}

    </Fragment>;
  }

}

export default Pagination;
