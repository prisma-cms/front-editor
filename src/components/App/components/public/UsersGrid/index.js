import React, { Fragment } from 'react';

import EditorComponent from '../..';

import PeopleIcon from "material-ui-icons/People";

import UsersPage from "@prisma-cms/front/dist/components/pages/UsersPage";

class UsersGrid extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }

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


  canBeDropped() {

    return false;
  }


  renderChildren() {



    return <Fragment
      key="userpage"
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
