import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import ConnectorIcon from "material-ui-icons/SwapHoriz";
import { Select } from 'material-ui';
import { FormControl } from 'material-ui';
import { InputLabel } from 'material-ui';
import { MenuItem } from 'material-ui';

import EditorComponent from '../../..';
import { Typography } from 'material-ui';
import { ConnectorContext } from '../Connector';
import { ObjectView } from '../Viewer';


// export const ConnectorContext = createContext({});

class ObjectConnector extends EditorComponent {


  static Name = "ObjectConnector"
  static help_url = "https://front-editor.prisma-cms.com/topics/query.html";

  static defaultProps = {
    ...EditorComponent.defaultProps,
    query: "",
    // pagevariable: "page",
    filtersname: "filters",
    // first: 10,
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
      /> Object Connector
    </div>);
  }



  prepareDragItemProps() {

    return {
      ...super.prepareDragItemProps(),
      filtersname: "filters",
      where: {
      },
    };
  }


  prepareDragItemComponents() {

    return super.prepareDragItemComponents().concat([
      {
        "name": "Filters",
        "component": "Filters",
        props: {},
        "components": [],
      },
      {
        "name": "ObjectView",
        "component": "ObjectView",
        props: {},
        "components": [],
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
              {queryNames
                .filter(n => n.endsWith && !n.endsWith("Connection"))
                .map(queryName => {

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


  getFilters() {


    const {
      where: filters,
      // } = this.props;
    } = this.getComponentProps(this);

    return filters;

  }


  setFilters(filters) {





    // activeItem.updateComponentProperty("where", filters)
    // this.updateComponentProperty("test", "filters")

    return this.updateActiveComponentProps(this, {
      where: filters,
    });

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
      parent: offsetParent,
    } = this.props;


    const {
      props: {
        orderBy,
        query,
        ...otherProps
      },
      where: propsWhere,
      parent,
      ...other
    } = this.getRenderProps();



    /**
     * Если есть родитель и у родителя имеется свойство query, то используем его
     */

    let parentQuery;

    if (offsetParent) {

      const {
        query,
      } = offsetParent.props.data.object.props;

      if (query) {
        parentQuery = query;
      }

    }



    if (!query && !parentQuery) {
      return <Typography
        color="error"
      >
        Query props required
      </Typography>
    }

    // const {
    // } = this.getComponentProps(this);

    const filters = this.getFilters();


    let where = filters;




    if (!where || !Object.keys(where).length) {



      /**
       * Если элемент находится в роутере, пытаемся получить параметры из УРЛ.
       * Так как у нас добавился еще объект Query, который может возникнуть между 
       * коннектором и роутером. то роутинг смотрим и в прародителе
       */
      // let matchParams;


      if (parent) {

        const {
          match,
          parent: grandParent,
        } = parent.props;

        const {
          params,
        } = match || {};


        if (params) {
          where = params;
        }
        else if (grandParent) {

          const {
            match,
          } = grandParent.props;

          const {
            params,
          } = match || {};

          if (params) {
            where = params;
          }

        }
      }

    }

    return <ObjectView
      {...otherProps}
      {...this.getComponentProps(this)}
      key={query}
      query={query}
      parentQuery={parentQuery}
      setFilters={filters => this.setFilters(filters)}
      filters={filters || []}
      where={where}
      ConnectorContext={ConnectorContext}
    >
      {super.renderChildren()}
    </ObjectView>
  }


}



export default ObjectConnector;