import React, { Component } from 'react';
import PropTypes from 'prop-types';


import FrontEditor from "../../../../App";
import { Paper } from 'material-ui';
import { Typography } from 'material-ui';

import PrismaCmsComponent from "@prisma-cms/component";
import { Button } from 'material-ui';

export class TemplateView extends PrismaCmsComponent {

  static propTypes = {
    ...PrismaCmsComponent.propTypes,
    editable: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    ...PrismaCmsComponent.defaultProps,
    editable: false,
  }

  constructor(props) {

    super(props);

    const {
      inEditMode = false,
    } = props;

    this.state = {
      ...this.state,
      inEditMode,
    };

  }


  render() {




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
      editable,
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

    let toolbar;

    if (editable || true) {

      toolbar = <Grid
        rel="noindex, nofollow"
        container
        style={{
          // flexDirection: "row-reverse",
          position: "fixed",
          bottom: 0,
          right: 0,
          width: "auto",
          background: "rgba(255,255,255,0.5)",
          zIndex: 2000,
        }}
      >
        <Grid
          item
        >
          <Button
            size="small"
            onClick={event => this.setState({
              inEditMode: !inEditMode,
            })}
            variant="raised"
          >
            {inEditMode ? this.lexicon("Close") : this.lexicon("Edit template")}
          </Button>
        </Grid>
      </Grid>

    }


    return <Paper
      style={{
        padding: 10,
        position: "relative",
      }}
    >

      {toolbar}

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
        data={{
          object,
        }}
        {...other}
        inEditMode={inEditMode}
      />

    </Paper>

  }
}

export default TemplateView;

// export default withStyles(styles)(props => <TemplateView
//   {...props}
// />);
