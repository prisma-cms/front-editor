import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../..';

import PeopleIcon from "material-ui-icons/People";

import UsersPage from "@prisma-cms/front/lib/modules/pages/UsersPage";

class UsersGrid extends EditorComponent {


  static Name = "UsersGrid"

  renderPanelView() {

    const {
      classes,
    } = this.context;

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <PeopleIcon /> Users Grid
    </div>);
  }


  canBeDropped(dragItem) {

    return false;
  }


  renderChildren() {



    return <Fragment
    >
      <UsersPage
        {...this.getComponentProps(this)}
      />
      {/* {...super.renderChildren()} */}
    </Fragment>
  }


  prepareDragItem() {

    let newItem = super.prepareDragItem();

    Object.assign(newItem, {
      first: 10,
    });

    return newItem;
  }


}


export default UsersGrid;
