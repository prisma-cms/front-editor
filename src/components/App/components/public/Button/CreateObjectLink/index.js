import React from 'react';

import { Link } from "react-router-dom";

import Icon from "material-ui-icons/Add";
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import EditorComponent from '../../..';

class CreateObjectLink extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    to: "",
    hide_wrapper_in_default_mode: true,
  }

  static Name = "CreateObjectLink"

  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <Icon /> Create Object
    </div>);
  }


  renderChildren() {

    const {
      inEditMode,
    } = this.getEditorContext();

    const {
      to,
    } = this.getComponentProps(this);

    if (!to) {

      if (inEditMode) {
        return <Typography
          color="error"
        >
          "to" property required
        </Typography>
      }
      else {
        return null;
      }
    }

    const children = super.renderChildren();

    return <Link
      key="link"
      to={to}
      style={{
        textDecoration: "none",
      }}
    >
      {children && children.length ?
        children :
        <IconButton
          title="Add object"
        >
          <Icon

          />
        </IconButton>
      }
    </Link>

  }


}

export default CreateObjectLink;
