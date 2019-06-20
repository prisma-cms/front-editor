import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../..';

import PeopleIcon from "material-ui-icons/People";

import UsersPage from "@prisma-cms/front/lib/components/pages/UsersPage";

class UsersGrid extends EditorComponent {


  static Name = "UsersGrid"

  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
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


  prepareDragItemProps() {

    return {
      ...super.prepareDragItemProps(),
      first: 10,
    };

  }


}


export default UsersGrid;
