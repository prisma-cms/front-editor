import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import ConnectorIcon from "material-ui-icons/SwapHoriz";
import { Select } from 'material-ui';
import { FormControl } from 'material-ui';
import { InputLabel } from 'material-ui';
import { MenuItem } from 'material-ui';

import {
  createContext,
} from 'react';

import EditorComponent from '../../..';
import { Typography } from 'material-ui';
import { ObjectsView } from '../Viewer';

export const ConnectorContext = createContext({});

class Connector extends EditorComponent {


  static Name = "Connector"
  static help_url = "https://front-editor.prisma-cms.com/topics/query.html";

  static defaultProps = {
    ...EditorComponent.defaultProps,
    query: "",
    pagevariable: "page",
    filtersname: "filters",
    first: 10,
    orderBy: undefined,
  };


  // canBeDropped(dragItem) {



  //   return dragItem && dragItem instanceof ConnectorView ? true : false;
  // }


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();


    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <ConnectorIcon
      /> Connector
    </div>);
  }


  prepareDragItemProps() {

    return {
      ...super.prepareDragItemProps(),
      "first": 12,
      filtersname: "filters",
    };
  }


  prepareDragItemComponents() {

    return super.prepareDragItemComponents().concat([

      {
        "name": "Grid",
        "component": "Grid",
        props: {
          "container": true,
          spacing: 8,
        },
        components: [
          {
            "name": "Grid",
            "component": "Grid",
            props: {
              "item": true,
              "xs": 12,
            },
            components: [
              {
                "name": "Filters",
                "component": "Filters",
                props: {
                },
                "components": [],
              },
            ],
          },
          {
            "name": "Grid",
            "component": "Grid",
            props: {
              "item": true,
              "xs": 12,
            },
            components: [
              {
                "name": "ListView",
                "component": "ListView",
                props: {
                },
                "components": [
                  {
                    "name": "Grid",
                    "component": "Grid",
                    props: {
                      "item": true,
                      "xs": 12,
                      "md": 6,
                      "xl": 3,
                    },
                    components: [],
                  }
                ]
              },
            ],
          },
          {
            "name": "Grid",
            "component": "Grid",
            props: {
              "item": true,
              "xs": 12,
            },
            components: [
              {
                "name": "Pagination",
                "component": "Pagination",
                props: {
                },
                components: [],
              },
            ],
          },

        ],
      },

    ]);
  }


  getEditorField(props) {

    let {
      key,
      type,
      name,
      value,
      ...other
    } = props;


    const {
      query,
    } = this.context;


    const activeItem = this.getActiveItem();


    const queryNames = Object.keys(query);



    let field;


    if (!field) {

      switch (name) {

        case "query":

          field = <FormControl
            key={key}
            fullWidth
          >
            <InputLabel>Query name</InputLabel>
            <Select
              value={value}
              onChange={event => this.onChangeProps(event)}
              inputProps={{
                name,
                // id: 'age-simple',
              }}
            >
              {queryNames.filter(n => n.endsWith && n.endsWith("Connection")).map(queryName => {

                return <MenuItem
                  key={queryName}
                  value={queryName}
                >
                  {queryName}
                </MenuItem>
              })}
            </Select>
          </FormControl>;
          break;

        // case "skip":
        // case "last":

        //   type = "number";

        //   break;
      }

    }


    if (!field) {


      // if (name === "skip") {



      // }

      if (activeItem) {

        const {
          // props: {
          //   query: fieldName,
          // },
          props: {
            query: fieldName,
          },
        } = activeItem.getObjectWithMutations();

        if (fieldName) {

          const Field = this.getSchemaField(fieldName);




          if (Field) {

            const {
              args,
            } = Field;

            const arg = args ? args.find(n => n.name === name) : null;

            if (arg) {


              const {
                type: {
                  kind: typeKind,
                  name: typeName,
                },
              } = arg;

              switch (typeKind) {

                case "ENUM":


                  const Type = this.getSchemaType(n => n.name === typeName && n.kind === typeKind);

                  if (Type) {



                    const {
                      enumValues,
                    } = Type;

                    field = <FormControl
                      key={key}
                      fullWidth
                    >
                      <InputLabel>{name}</InputLabel>
                      <Select
                        value={value || ""}
                        onChange={event => this.onChangeProps(event)}
                        inputProps={{
                          name,
                          // id: 'age-simple',
                        }}
                      >
                        {enumValues.map(n => {

                          const {
                            name: fieldName,
                          } = n;

                          return <MenuItem
                            key={fieldName}
                            value={fieldName}
                          >
                            {fieldName}
                          </MenuItem>
                        })}
                      </Select>
                    </FormControl>;

                  }

                  break;

                case "SCALAR":


                  switch (typeName) {

                    case "Int":
                    case "Float":

                      type = "number";
                      break;

                  }

                  break;

              }

            }

          }

        }

      }

    }


    Object.assign(props, {
      type,
      name,
      value,
    });


    // if (name === "skip") {




    // }



    return field !== undefined ? field : super.getEditorField(props);

  }


  updateComponentProperty(name, value) {

    const activeItem = this.getActiveItem();


    let newProps = {};

    const {
      props,
    } = activeItem;

    switch (name) {

      case "query":

        {

          const Field = this.getSchemaField(value);

          if (Field) {

            const {
              args,
            } = Field;


            args.map(n => {



              let {
                name: argName,
                defaultValue,
                type: {
                  kind: typeKind,
                  name: typeName,
                  ofType,
                },
              } = n;


              let propName;
              let propValue;

              switch (typeKind) {

                case "SCALAR":

                  switch (typeName) {

                    case "Int":
                    case "Float":

                      propName = argName;
                      propValue = props[argName] !== undefined ? props[argName] : defaultValue ? parseFloat(defaultValue) : defaultValue;

                      break;

                    case "String":


                      break;

                  }

                  break;

                case "ENUM":

                  propName = argName;
                  propValue = defaultValue;

                  break;

              }


              if (propName) {
                Object.assign(newProps, {
                  [propName]: propValue,
                });
              }


            });

          }
          else {
            return false;
          }

        }

        return activeItem.updateComponentProps({
          ...newProps,
          [name]: value,
        });

        break;

    }


    return super.updateComponentProperty(name, value)

  }


  getSchemaField(fieldName) {

    const {
      schema,
    } = this.context;



    const {
      queryType: {
        name: queryTypeName,
      },
      types,
    } = schema;

    const query = schema.types.find(n => n.kind === "OBJECT" && n.name === queryTypeName);



    const Field = query.fields.find(n => n.name === fieldName);



    return Field;

  }


  getSchemaType(filter) {

    const {
      schema,
    } = this.context;



    const {
      types,
    } = schema;


    const Field = types.find(filter);


    return Field;

  }



  getUrlFilters() {


    const {
      filtersname,
      // pagevariable,
    } = this.getComponentProps(this);

    const {
      uri,
    } = this.context;


    let {
      // [pagevariable]: page,
      [filtersname]: filters,
    } = uri.query(true);

    try {



      filters = filters && JSON.parse(filters) || null;

      if (filters === "{}") {
        filters = undefined;
      }
    }
    catch (error) {
      console.error(console.error(error));
    }



    return filters;
  }


  getFilters() {






    const {
      inEditMode,
    } = this.getEditorContext();


    if (inEditMode) {
      const {
        where: filters,
        // } = this.props;
      } = this.getComponentProps(this);

      return filters;
    }
    else {
      return this.getUrlFilters();
    }

  }


  setUrlFilters(filters) {

    const {
      uri,
      router: {
        history,
      },
    } = this.context;

    const {
      filtersname,
    } = this.getComponentProps(this);

    let newUri = uri.clone();





    try {

      filters = filters ? JSON.stringify(filters) : undefined;
    }
    catch (error) {
      console.error(error);
    }

    if (filters === "{}") {
      filters = null;
    }



    if (filters) {

      if (newUri.hasQuery) {
        newUri = newUri.setQuery({
          [filtersname]: filters,
        });
      }
      else {
        newUri = newUri.addQuery({
          [filtersname]: filters,
        });
      }

    }
    else {

      newUri.removeQuery(filtersname);

    }

    newUri.removeQuery("page");




    const url = newUri.resource();




    history.push(url);

  }

  setFilters(filters) {





    // activeItem.updateComponentProperty("where", filters)
    // this.updateComponentProperty("test", "filters")


    const {
      inEditMode,
    } = this.getEditorContext();


    if (!inEditMode) {
      return this.setUrlFilters(filters);
    }
    else {
      return this.updateActiveComponentProps(this, {
        where: filters,
      });
    }

  }




  // renderMainView() {

  //   const {
  //     props: {
  //       orderBy,
  //       query,
  //       ...otherProps
  //     },
  //     where: propsWhere,
  //     ...other
  //   } = this.getRenderProps();


  //   // const {
  //   // } = this.getComponentProps(this);

  //   const filters = this.getFilters();


  //   let where;

  //   let AND = [];

  //   if (propsWhere) {
  //     // AND.push({
  //     //   ...propsWhere,
  //     // });
  //     AND.push(propsWhere);
  //   }

  //   if (filters) {
  //     AND.push(filters);
  //   }

  //   if (AND.length) {


  //     where = {
  //       AND,
  //     }
  //   }



  //   return <div
  //     {...other}
  //   >
  //     <Viewer
  //       key={query}
  //       query={query}
  //       setFilters={filters => this.setFilters(filters)}
  //       filters={filters || []}
  //       where={where}
  //       {...otherProps}
  //     >
  //       {super.renderMainView()}
  //     </Viewer>

  //   </div>
  // }



  canBeChild(child) {

    let can = false;

    if (super.canBeChild(child)) {


      const {
        props: componentProps,
      } = this.getComponentProps(this);


      const {
        query,
      } = componentProps || {};


      let parentQuery;

      const {
        parent,
      } = this.props;

      if (parent) {

        const {
          query,
        } = parent.props.data.object.props;

        if (query) {
          parentQuery = query;
        }

      }


      if (query || parentQuery) {

        can = true;

      }

    }

    return can;

  }


  renderChildren() {

    const {
      schema,
    } = this.context;

    /**
     * schema required for viewer
     */
    if (!schema) {
      return null;
    }

    const {
      inEditMode,
    } = this.getEditorContext();

    const {
      parent,
    } = this.props;

    const {
      props: componentProps,
      where: propsWhere,
      ...other
    } = this.getComponentProps(this);


    const {
      orderBy,
      query,
      ...otherProps
    } = componentProps || {};



    /**
     * Если есть родитель и у родителя имеется свойство query, то используем его
     */

    let parentQuery;

    if (parent) {

      const {
        query,
      } = parent.props.data.object.props;

      if (query) {
        parentQuery = query;
      }

    }




    if (!query && !parentQuery) {

      return inEditMode ? <Typography
        color="error"
      >
        Query props required
      </Typography> : null;
      
    }

    // const {
    // } = this.getComponentProps(this);

    const filters = this.getFilters();





    let where;

    let AND = [];

    if (propsWhere) {
      // AND.push({
      //   ...propsWhere,
      // });
      AND.push(propsWhere);
    }

    if (filters) {
      AND.push(filters);
    }


    if (!AND.length) {

    }
    else if (AND.length === 1) {

      where = AND[0];
    }
    else {

      where = {
        AND,
      }
    }




    return <ObjectsView
      key={query}
      query={query}
      parentQuery={parentQuery}
      setFilters={filters => this.setFilters(filters)}
      filters={filters || []}
      {...otherProps}
      {...this.getComponentProps(this)}
      where={where}
      ConnectorContext={ConnectorContext}
    >
      {super.renderChildren()}
    </ObjectsView>
  }

}



export default Connector;