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

import Context from "@prisma-cms/context";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import EditorComponent from '../../';

export const ConnectorContext = createContext({});

class Connector extends EditorComponent {


  static Name = "Connector"

  static defaultProps = {
    ...EditorComponent.defaultProps,
    query: "",
    pagevariable: "page",
    filtersname: "filters",
  };


  // canBeDropped(dragItem) {



  //   return dragItem && dragItem instanceof ConnectorView ? true : false;
  // }


  renderPanelView() {

    const {
      classes,
    } = this.context;


    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <ConnectorIcon
      /> Connector
    </div>);
  }



  prepareDragItem() {

    let newItem = super.prepareDragItem();

    Object.assign(newItem, {
      "first": 12,
      "components": [
        {
          "type": "ListView",
          "components": [
            {
              "type": "Grid",
              props: {
                "item": true,
                "xs": 12,
                "md": 6,
                "xl": 3
              },
            }
          ]
        },
        {
          "type": "Pagination"
        }
      ],
    });

    return newItem;
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


      if (activeItem) {

        const {
          props: {
            query: fieldName,
          },
        } = activeItem;

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


    if (name === "skip") {
    }


    return field !== undefined ? field : super.getEditorField(props);

  }


  updateComponentProperty(component, name, value) {



    let newProps = {};

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
                      propValue = defaultValue ? parseFloat(defaultValue) : defaultValue;

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

        break;

    }




    return this.updateComponentProps(component, {
      ...newProps,
      [name]: value,
    });
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
      filtersname,
      // pagevariable,
    } = this.props;

    const {
      uri,
    } = this.context;


    let {
      // [pagevariable]: page,
      [filtersname]: filters,
    } = uri.query(true);

    try {
      filters = filters && JSON.parse(filters) || null;
    }
    catch (error) {
      console.error(console.error(error));
    }

    return filters;
  }


  setFilters(filters) {

    const {
      uri,
      router: {
        history,
      },
    } = this.context;

    const {
      filtersname,
    } = this.props;

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

      newUri.removeQuery("filters");

    }

    newUri.removeQuery("page");


    const url = newUri.resource();


    history.push(url);

  }




  renderMainView() {

    const {
      props: {
        orderBy,
        query,
        ...otherProps
      },
      where: propsWhere,
      ...other
    } = this.getRenderProps();


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

    if (AND.length) {


      where = {
        AND,
      }
    }



    return <div
      {...other}
    >
      <Viewer
        key={query}
        query={query}
        setFilters={filters => this.setFilters(filters)}
        filters={filters || []}
        where={where}
        {...otherProps}
      >
        {super.renderMainView()}
      </Viewer>

    </div>
  }

}



class Viewer extends Component {

  static contextType = Context;


  componentWillMount() {


    const {
      query,
    } = this.props;


    if (query) {

      const {
        query: {
          [query]: apiQuery,
        },
      } = this.context;

      this.Renderer = graphql(gql(apiQuery))(props => {



        const {
          children,
          ...other
        } = props;

        return <ConnectorContext.Consumer>
          {context => <ConnectorContext.Provider
            value={{
              ...context,
              ...other,
            }}
          >
            {children}
          </ConnectorContext.Provider>}
        </ConnectorContext.Consumer>;

      });

    }

    super.componentWillMount && super.componentWillMount();
  }


  render() {

    const {
      query,
      children,
      first,
      pagevariable: pageVariable = "page",
      ...other
    } = this.props;

    const {
      Renderer,
    } = this;


    const {
      uri,
    } = this.context;


    let {
      [pageVariable]: page,
    } = uri.query(true);


    page = parseInt(page) || 0;

    const skip = page ? (page - 1) * first : 0;


    return <ConnectorContext.Provider
      value={{
        query,
        pageVariable,
      }}
    >
      {Renderer ?
        <Renderer
          page={page}
          skip={skip}
          first={first}
          {...other}
        >
          {children}
        </Renderer> :
        children
      }
    </ConnectorContext.Provider>

  }
}


export default Connector;