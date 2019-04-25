import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'material-ui';
import { Tab } from 'material-ui';


import PrismaCmsComponent from "@prisma-cms/component";
import TemplateWrapper from './components/templateWrapper';


class MarketPlace extends PrismaCmsComponent {

  static propTypes = {
    ...PrismaCmsComponent.propTypes,
    classes: PropTypes.object.isRequired,
    activeItem: PropTypes.object.isRequired,
    FrontEditor: PropTypes.func.isRequired,
  };


  render() {

    const {
      tabIndex = "local",
    } = this.state;


    let content = null;


    switch (tabIndex) {

      case "local":

        content = this.getLocalTemplates();

        break;

    }

    return <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >

      <Tabs
        value={tabIndex}
        onChange={(event, tabIndex) => {
          console.log("onChange tabIndex", tabIndex);

          this.setState({
            tabIndex,
          });
        }}
      >

        <Tab
          label={this.lexicon("local")}
          value="local"
        />

        <Tab
          label={this.lexicon("remote")}
          value="remote"
        />

      </Tabs>

      {content}

    </div>;
  }


  getLocalTemplates() {

    const {
      FrontEditor,
      activeItem,
    } = this.props;

    console.log("getLocalTemplates props", { ...this.props });

    return <FrontEditor
      inEditMode={false}
      CustomComponents={[
        TemplateWrapper,
      ]}
      data={{
        object: {
          name: "Section",
          component: "Section",
          props: {
            style: {
              height: "100",
              overflow: "auto",
            },
          },
          components: [
            {
              "name": "Connector",
              "props": {
                "first": 10,
                "filtersname": "filters",
                "orderBy": null,
                "skip": null,
                "last": null,
                "query": "templatesConnection"
              },
              "components": [
                {
                  "name": "Grid",
                  "component": "Grid",
                  "props": {
                    "container": true,
                    "spacing": 0
                  },
                  "components": [
                    {
                      "name": "Grid",
                      "component": "Grid",
                      "props": {
                        "item": true,
                        "xs": 12
                      },
                      "components": [
                        {
                          "name": "Filters",
                          "component": "Filters",
                          "props": {},
                          "components": []
                        }
                      ]
                    },
                    {
                      "name": "Grid",
                      "component": "Grid",
                      "props": {
                        "item": true,
                        "xs": 12
                      },
                      "components": [

                        {
                          "name": "ListView",
                          "component": "ListView",
                          "props": {
                            "spacing": 16
                          },
                          "components": [
                            {
                              "name": "Grid",
                              "component": "Grid",
                              "props": {
                                item: true,
                                xs: 12,
                              },
                              "components": [
                                {
                                  activeItem,
                                  FrontEditor,
                                  name: "TemplateWrapper",
                                  component: "TemplateWrapper",
                                  props: {
                                  },
                                  components: [
                                    {
                                      "externalKey": null,
                                      "name": "Grid",
                                      "description": null,
                                      "component": "Grid",
                                      "props": {
                                        "item": true,
                                        "xs": 12
                                      },
                                      "components": [
                                        {
                                          "name": "Grid",
                                          "props": {
                                            "container": true,
                                            "spacing": 0,
                                            "alignItems": "center"
                                          },
                                          "components": [
                                            {
                                              "name": "Grid",
                                              "props": {
                                                "spacing": 0,
                                                "xs": true,
                                                "item": true
                                              },
                                              "components": [
                                                {
                                                  "name": "NamedField",
                                                  "props": {
                                                    "name": "name"
                                                  },
                                                  "components": [],
                                                  "component": "NamedField"
                                                },
                                                {
                                                  "name": "Tag",
                                                  "props": {
                                                    "tag": "span"
                                                  },
                                                  "components": [
                                                    {
                                                      "name": "Tag",
                                                      "component": "Tag",
                                                      "props": {
                                                        "text": "/"
                                                      },
                                                      "components": []
                                                    }
                                                  ],
                                                  "component": "Tag"
                                                },
                                                {
                                                  "name": "NamedField",
                                                  "props": {
                                                    "name": "component"
                                                  },
                                                  "components": [],
                                                  "component": "NamedField"
                                                }
                                              ],
                                              "component": "Grid"
                                            },
                                            {
                                              "name": "Grid",
                                              "props": {
                                                "spacing": 0,
                                                "item": true
                                              },
                                              "components": [
                                                {
                                                  "name": "CreatedBy",
                                                  "props": {},
                                                  "components": [],
                                                  "component": "CreatedBy"
                                                }
                                              ],
                                              "component": "Grid"
                                            },
                                            {
                                              "name": "Grid",
                                              "props": {
                                                "spacing": 0,
                                                "xs": 12,
                                                "item": true
                                              },
                                              "components": [
                                                {
                                                  "name": "Typography",
                                                  "component": "Typography",
                                                  "props": {
                                                    "variant": "caption"
                                                  },
                                                  "components": [
                                                    {
                                                      "name": "NamedField",
                                                      "props": {
                                                        "name": "description"
                                                      },
                                                      "components": [],
                                                      "component": "NamedField"
                                                    },
                                                  ],
                                                },
                                              ],
                                              "component": "Grid"
                                            }
                                          ],
                                          "component": "Grid"
                                        }
                                      ],
                                      "rank": 0,
                                    },
                                  ],
                                },
                              ],
                            },
                          ]
                        },

                      ]
                    },
                    {
                      "name": "Grid",
                      "component": "Grid",
                      "props": {
                        "item": true,
                        "xs": 12
                      },
                      "components": [
                        {
                          "name": "Pagination",
                          "component": "Pagination",
                          "props": {},
                          "components": []
                        }
                      ]
                    }
                  ]
                }
              ],
              "component": "Connector"
            },
          ],
        },
      }}
    />

  }

  // render___() {



  //   return "dsfsdf";

  //   const {

  //   } = this.context;

  //   let list = "sdfdsf";

  //   let templatesGroup = [];

  //   return <div>

  //     {list}

  //     {templatesGroup && templatesGroup.length ?
  //       <div
  //         style={{
  //           position: "absolute",
  //           // border: "1px solid blue",
  //           left: "100%",
  //           top: 0,
  //           height: "100%",
  //           width: "490px",
  //           padding: 15,
  //           zIndex: 1200,
  //           background: "rgba(255, 255, 255, 1)",
  //           overflowY: "auto",
  //         }}
  //       >

  //         <Grid
  //           container
  //         >
  //           <Grid
  //             item
  //             xs
  //           >

  //           </Grid>
  //           <Grid
  //             item
  //           >
  //             <IconButton
  //               onClick={event => {
  //                 this.closeTemplates();
  //               }}
  //             >
  //               <CloseIcon

  //               />
  //             </IconButton>
  //           </Grid>
  //         </Grid>

  //         {templatesGroup.map((n, index) => {

  //           const {
  //             label,
  //             ...component
  //           } = n;

  //           return <div
  //             key={index}
  //             style={{
  //               position: "relative",
  //               borderBottom: index - 1 === templatesGroup.length ? undefined : "1px solid #ddd",
  //               margin: "30px 0",
  //               cursor: "pointer",
  //             }}
  //             onClick={event => {

  //               event.preventDefault();
  //               event.stopPropagation();

  //               if (activeItem) {
  //                 activeItem.addComponent(component);
  //               }

  //               this.closeTemplates();

  //             }}
  //           >
  //             <h3
  //               style={{
  //                 borderBottom: "2px solid #ddd",
  //               }}
  //             >
  //               {label}
  //             </h3>
  //             <FrontEditor
  //               {...other}
  //               inEditMode={false}
  //               data={{
  //                 object: component,
  //               }}
  //             />
  //           </div>;

  //         })}

  //       </div>
  //       : null
  //     }
  //   </div>
  // }
}


export default MarketPlace;