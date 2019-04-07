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
        "type": "Page",
        "props": {},
        "components": [
          {
            "type": "Connector",
            "props": {
              "first": null,
              "orderBy": null,
              "skip": null,
              "last": null,
              "query": "usersConnection"
            },
            "components": [
              {
                "type": "ListView",
                "components": [
                  {
                    "type": "Grid",
                    "props": {
                      "container": true
                    },
                    "components": [
                      {
                        "type": "Grid",
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
                            "type": "UserLink",
                            "props": {},
                            "components": []
                          }
                        ]
                      },
                      {
                        "type": "Grid",
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
                            "type": "NamedField",
                            "props": {
                              "name": "username"
                            },
                            "components": []
                          }
                        ]
                      },
                      {
                        "type": "Grid",
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
                            "type": "NamedField",
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
                "type": "Pagination"
              }
            ],
            "id": "cju6kgdi504f10917mah0jruc"
          }
        ],
        "id": "cju6kh8hd04fd0917i7shixfs"
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