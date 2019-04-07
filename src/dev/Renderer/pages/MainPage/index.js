import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";

import { Button } from 'material-ui';
import { withStyles } from 'material-ui';
import FrontEditor from '../../../../components/App';


export const styles = {
  root: {
    "&.inEditMode": {
      height: "100%",
      display: "flex",
      flexDirection: "column",

      "& $editorWrapper": {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        // border: "1px solid red",
        overflow: "auto",
      },
    },
  },
  editorWrapper: {
  },
}

class FrontEditorPage extends Component {

  static contextType = Context;

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    inEditMode: true,
    components: [
      {
        "name": "Page",
        "props": {},
        "components": [
          {
            "name": "Connector",
            "props": {
              "first": null,
              "orderBy": null,
              "skip": null,
              "last": null,
              "query": "usersConnection"
            },
            "components": [
              {
                "name": "ListView",
                "components": [
                  {
                    "name": "Grid",
                    "props": {
                      "container": true
                    },
                    "components": [
                      {
                        "name": "Grid",
                        "props": {
                          "xs": 12,
                          "sm": 6,
                          "md": 4,
                          "lg": 3,
                          "xl": 2,
                          "item": true
                        },
                        "components": [
                          {
                            "name": "UserLink",
                            "props": {},
                            "components": []
                          }
                        ]
                      },
                      {
                        "name": "Grid",
                        "props": {
                          "xs": 12,
                          "sm": 6,
                          "md": 4,
                          "lg": 3,
                          "xl": 2,
                          "item": true
                        },
                        "components": [
                          {
                            "name": "NamedField",
                            "props": {
                              "name": "username"
                            },
                            "components": []
                          }
                        ]
                      },
                      {
                        "name": "Grid",
                        "props": {
                          "xs": 12,
                          "sm": 6,
                          "md": 4,
                          "lg": 3,
                          "xl": 2,
                          "item": true
                        },
                        "components": [
                          {
                            "name": "NamedField",
                            "props": {
                              "name": "email"
                            },
                            "components": []
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "name": "Pagination"
              }
            ],
            "id": "cju75cmah04o70917pnut4t5y"
          }
        ]
      }
    ],
  }

  render() {

    const {
      // FrontEditor,
      Grid,
    } = this.context;

    const {
      components,
      inEditMode,
    } = this.state;

    const {
      classes,
    } = this.props;

    let toolbar = <Grid
      container
      spacing={8}
    >
      <Grid
        item
      >
        <Button
          onClick={event => this.setState({
            inEditMode: !inEditMode,
          })}
          size="small"
          color={inEditMode ? "secondary" : "primary"}
        >
          {inEditMode ? "Stop editing" : "Start editing"}
        </Button>
      </Grid>
    </Grid>

    return (
      <div
        className={[classes.root, inEditMode ? "inEditMode" : ""].join(" ")}
      >

        {toolbar}

        <div
          className={classes.editorWrapper}
        >
          <FrontEditor
            inEditMode={inEditMode}
            components={components}
            onChange={components => {

              this.setState({
                components,
              })
            }}
            CustomComponents={[
            ]}
            debug={true}
          />
        </div>
      </div>
    );
  }
}


export default withStyles(styles)(props => <FrontEditorPage
  {...props}
/>);