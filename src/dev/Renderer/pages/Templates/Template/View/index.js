import React, { Component } from 'react';
import PropTypes from 'prop-types';


import FrontEditor from "../../../../../../App";
import { Paper } from 'material-ui';
import { Typography } from 'material-ui';

import PrismaCmsContext from "@prisma-cms/context";

export class TemplateView extends Component {


  static contextType = PrismaCmsContext;


  state = {
    inEditMode: false,
  }

  render() {

    // console.log("TemplateView props", { ...this.props });


    const {
      Grid,
      TemplateLink,
      UserLink,
    } = this.context;

    const {
      classes,
      data: {
        object,
      },
      ...other
    } = this.props;

    const {
      inEditMode,
    } = this.state;


    if (!object) {
      return null;
    }


    const {
      name,
      component,
      description,
      CreatedBy,
    } = object;


    return <Paper
      style={{
        padding: 10,
      }}
    >

      <Grid
        container
        spacing={8}
        alignItems="center"
      >
        <Grid
          item
          xs
        >
          <TemplateLink
            object={object}
          >
            {name} / {component}
          </TemplateLink>
        </Grid>
        <Grid
          item
        >
          {CreatedBy ?
            <UserLink
              user={CreatedBy}
            />
            : null
          }
        </Grid>
        <Grid
          item
          xs={12}
        >
          {description ?
            <Typography
              variant="caption"
            >
              {description}
            </Typography>
            : null
          }
        </Grid>
      </Grid>

      
      <FrontEditor
        inEditMode={inEditMode}
        data={{
          object,
        }}
        {...other}
      />

    </Paper>

  }
}

export default TemplateView;

// export default withStyles(styles)(props => <TemplateView
//   {...props}
// />);