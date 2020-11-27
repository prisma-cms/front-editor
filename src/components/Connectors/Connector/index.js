import React from 'react'
// import PropTypes from 'prop-types';
import { createContext } from 'react'

import ConnectorIcon from 'material-ui-icons/SwapHoriz'
import Select from 'material-ui/Select'
import FormControl from 'material-ui/Form/FormControl'
import InputLabel from 'material-ui/Input/InputLabel'
import MenuItem from 'material-ui/Menu/MenuItem'
import Typography from 'material-ui/Typography'

import EditorComponent from '../../../EditorComponent'
import { ObjectsView } from '../Viewer'
import { ObjectContext } from './ListView'

import pathToRegexp from 'path-to-regexp'

export const ConnectorContext = createContext({})

class Connector extends EditorComponent {
  static Name = 'Connector'
  static help_url = 'https://front-editor.prisma-cms.com/topics/query.html'

  static defaultProps = {
    ...EditorComponent.defaultProps,
    query: '',
    pagevariable: 'page',
    filtersname: 'filters',
    first: 10,
    orderBy: undefined,
    hide_wrapper_in_default_mode: true,

    // https://www.apollographql.com/docs/react/api/react-apollo/#optionsfetchpolicy
    fetchPolicy: undefined,
  }

  constructor(props) {
    super(props)

    this.setFilters = this.setFilters.bind(this)
    this.getFilters = this.getFilters.bind(this)
    this.onChangeProps = this.onChangeProps.bind(this)
  }

  // canBeDropped(dragItem) {

  //   return dragItem && dragItem instanceof ConnectorView ? true : false;
  // }

  prepareRootElementProps(props) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      fetchPolicy,
      ...other
    } = super.prepareRootElementProps(props)

    return other
  }

  renderPanelView(content) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">
          <ConnectorIcon /> Connector
        </div>
      )
    )
  }

  prepareDragItemProps() {
    return {
      ...super.prepareDragItemProps(),
      first: 12,
      filtersname: 'filters',
    }
  }

  prepareDragItemComponents() {
    return super.prepareDragItemComponents().concat([
      {
        name: 'Grid',
        component: 'Grid',
        props: {
          container: true,
          spacing: 8,
        },
        components: [
          {
            name: 'Grid',
            component: 'Grid',
            props: {
              item: true,
              xs: 12,
            },
            components: [
              {
                name: 'Filters',
                component: 'Filters',
                props: {},
                components: [],
              },
            ],
          },
          {
            name: 'Grid',
            component: 'Grid',
            props: {
              item: true,
              xs: 12,
            },
            components: [
              {
                name: 'Grid',
                component: 'Grid',
                props: {
                  container: true,
                  spacing: 8,
                },
                components: [
                  {
                    name: 'ListView',
                    component: 'ListView',
                    props: {
                      style: {
                        display: 'flex',
                        width: '100%',
                        flexWrap: 'wrap',
                      },
                    },
                    components: [
                      {
                        name: 'Grid',
                        component: 'Grid',
                        props: {
                          item: true,
                          xs: 12,
                          md: 6,
                          xl: 3,
                        },
                        components: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: 'Grid',
            component: 'Grid',
            props: {
              item: true,
              xs: 12,
            },
            components: [
              {
                name: 'Pagination',
                component: 'Pagination',
                props: {},
                components: [],
              },
            ],
          },
        ],
      },
    ])
  }

  getEditorField(props) {
    const {
      key,
      name,
      value,
      // ...other
    } = props

    let { type } = props

    const { query } = this.context

    const activeItem = this.getActiveItem()

    const queryNames = Object.keys(query)

    let field

    if (!field) {
      switch (name) {
        case 'query':
          field = (
            <FormControl key={key} fullWidth>
              <InputLabel>Query name</InputLabel>
              <Select
                value={value}
                onChange={this.onChangeProps}
                inputProps={{
                  name,
                  // id: 'age-simple',
                }}
              >
                {queryNames
                  .filter((n) => n.endsWith && n.endsWith('Connection'))
                  .map((queryName) => {
                    return (
                      <MenuItem key={queryName} value={queryName}>
                        {queryName}
                      </MenuItem>
                    )
                  })}
              </Select>
            </FormControl>
          )
          break

        // case "skip":
        // case "last":

        //   type = "number";

        //   break;

        default:
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
          props: { query: fieldName },
        } = activeItem.getObjectWithMutations()

        if (fieldName) {
          const Field = this.getSchemaField(fieldName)

          if (Field) {
            const { args } = Field

            const arg = args ? args.find((n) => n.name === name) : null

            if (arg) {
              const {
                type: { kind: typeKind, name: typeName },
              } = arg

              switch (typeKind) {
                case 'ENUM':
                  {
                    const Type = this.getSchemaType(
                      (n) => n.name === typeName && n.kind === typeKind
                    )

                    if (Type) {
                      const { enumValues } = Type

                      field = (
                        <FormControl key={key} fullWidth>
                          <InputLabel>{name}</InputLabel>
                          <Select
                            value={value || ''}
                            onChange={this.onChangeProps}
                            inputProps={{
                              name,
                              // id: 'age-simple',
                            }}
                          >
                            {enumValues.map((n) => {
                              const { name: fieldName } = n

                              return (
                                <MenuItem key={fieldName} value={fieldName}>
                                  {fieldName}
                                </MenuItem>
                              )
                            })}
                          </Select>
                        </FormControl>
                      )
                    }
                  }
                  break

                case 'SCALAR':
                  switch (typeName) {
                    case 'Int':
                    case 'Float':
                      type = 'number'
                      break

                    default:
                  }

                  break

                default:
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
    })

    // if (name === "skip") {

    // }

    return field !== undefined ? field : super.getEditorField(props)
  }

  updateComponentProperty(name, value) {
    const newProps = {}

    const { props } = this.getObjectWithMutations()

    switch (name) {
      case 'query':
        {
          const Field = this.getSchemaField(value)

          if (Field) {
            const { args } = Field

            args.map((n) => {
              const {
                name: argName,
                defaultValue,
                type: {
                  kind: typeKind,
                  name: typeName,
                  // ofType,
                },
              } = n

              let propName
              let propValue

              switch (typeKind) {
                case 'SCALAR':
                  switch (typeName) {
                    case 'Int':
                    case 'Float':
                      propName = argName
                      propValue =
                        props[argName] !== undefined
                          ? props[argName]
                          : defaultValue
                          ? parseFloat(defaultValue)
                          : defaultValue

                      break

                    case 'String':
                      break

                    default:
                  }

                  break

                case 'ENUM':
                  propName = argName
                  propValue = defaultValue

                  break

                default:
              }

              if (propName) {
                Object.assign(newProps, {
                  [propName]: propValue,
                })
              }

              return null
            })
          } else {
            return false
          }
        }

        return this.updateComponentProps({
          ...newProps,
          [name]: value,
        })

      // break;

      default:
    }

    return super.updateComponentProperty(name, value)
  }

  getSchemaField(fieldName) {
    const { schema } = this.context

    const {
      queryType: { name: queryTypeName },
      // types,
    } = schema

    const query = schema.types.find(
      (n) => n.kind === 'OBJECT' && n.name === queryTypeName
    )

    const Field = query.fields.find((n) => n.name === fieldName)

    return Field
  }

  getSchemaType(filter) {
    const { schema } = this.context

    const { types } = schema

    const Field = types.find(filter)

    return Field
  }

  getUrlFilters() {
    const {
      filtersname,
      // pagevariable,
    } = this.getComponentProps(this)

    const { uri } = this.context

    let {
      // [pagevariable]: page,
      [filtersname]: filters,
    } = uri.query(true)

    try {
      filters = (filters && JSON.parse(filters)) || null

      if (filters === '{}') {
        filters = undefined
      }
    } catch (error) {
      console.error(console.error(error))
    }

    return filters
  }

  getFilters() {
    const { inEditMode } = this.getEditorContext()

    if (inEditMode) {
      const {
        where: filters,
        // } = this.props;
      } = this.getComponentProps(this)

      return filters
    } else {
      return this.getUrlFilters()
    }
  }

  setUrlFilters(filters) {
    const {
      uri,
      router: { history },
    } = this.context

    const { filtersname } = this.getComponentProps(this)

    let newUri = uri.clone()

    try {
      filters = filters ? JSON.stringify(filters) : undefined
    } catch (error) {
      console.error(error)
    }

    if (filters === '{}') {
      filters = null
    }

    if (filters) {
      if (newUri.hasQuery) {
        newUri = newUri.setQuery({
          [filtersname]: filters,
        })
      } else {
        newUri = newUri.addQuery({
          [filtersname]: filters,
        })
      }
    } else {
      newUri.removeQuery(filtersname)
    }

    newUri.removeQuery('page')

    const url = newUri.resource()

    history.push(url)
  }

  setFilters(filters) {
    const { inEditMode } = this.getEditorContext()

    if (!inEditMode) {
      return this.setUrlFilters(filters)
    } else {
      return this.updateComponentProps({
        where: filters,
      })
    }
  }

  canBeChild(child) {
    let can = false

    if (super.canBeChild(child)) {
      const {
        props: { query },
      } = this.getObjectWithMutations()

      let parentQuery

      const { parent } = this.props

      if (parent) {
        // const {
        //   query,
        // } = parent.props.data.object.props;

        const {
          props: { query },
        } = parent.getObjectWithMutations()

        if (query) {
          parentQuery = query
        }
      }

      if (query || parentQuery) {
        can = true
      }
    }

    return can
  }

  /**
   * Заменяем плейсхолдеры в условиях запроса
   */
  injectWhereFromObject(where, object) {
    for (const i in where) {
      const value = where[i]

      if (value) {
        if (Array.isArray(value)) {
          // where[i] = value.map(n => this.injectWhereFromObject({ ...n }, object));
          where[i] = value.map((n) => this.injectWhereFromObject(n, object))
        } else if (typeof value === 'object') {
          // where[i] = this.injectWhereFromObject({ ...value }, object)
          where[i] = this.injectWhereFromObject(value, object)
        } else if (typeof value === 'string' && value.startsWith(':')) {
          const toPath = pathToRegexp.compile(value)

          try {
            const newValue = toPath(object, { noValidate: true })

            if (newValue) {
              where[i] = newValue
            }
          } catch (error) {
            console.error(error)
          }
        }
      }
    }

    return where
  }

  renderChildren() {
    const { schema } = this.context

    /**
     * schema required for viewer
     */
    if (!schema && this.inEditorMode()) {
      return null
    }

    return (
      <ObjectContext.Consumer key="object_context">
        {(objectContext) => {
          const { object } = objectContext

          const { inEditMode } = this.getEditorContext()

          const { parent } = this.props

          const {
            props: componentProps,
            where: propsWhere,
            // ...other
          } = this.getComponentProps(this)

          const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            orderBy,
            query,
            ...otherProps
          } = componentProps || {}

          /**
           * Если есть родитель и у родителя имеется свойство query, то используем его
           */

          let parentQuery

          if (parent) {
            // const {
            //   query,
            // } = parent.props.data.object.props;

            const {
              props: { query },
            } = parent.getObjectWithMutations()

            if (query) {
              parentQuery = query
            }
          }

          if (!query && !parentQuery) {
            return inEditMode ? (
              <Typography color="error">Query props required</Typography>
            ) : null
          }

          let filters = this.getFilters()

          if (filters) {
            filters = { ...filters }
          }

          let where

          const AND = []

          if (propsWhere) {
            AND.push({ ...propsWhere })
          }

          if (filters) {
            AND.push({ ...filters })
          }

          if (AND.length === 1) {
            where = AND[0]
          } else if (AND.length) {
            where = {
              AND,
            }
          }

          return (
            <ObjectsView
              key={query}
              query={query}
              parentQuery={parentQuery}
              setFilters={this.setFilters}
              getFilters={this.getFilters}
              filters={filters || []}
              {...otherProps}
              {...this.getComponentProps(this)}
              /**
            Если есть объект where, пытаемся найти в нем условия для выборки 
            от родительского объекта
           */
              where={
                where && object
                  ? this.injectWhereFromObject({ ...where }, object)
                  : where
              }
              ConnectorContext={ConnectorContext}
            >
              {super.renderChildren()}
            </ObjectsView>
          )
        }}
      </ObjectContext.Consumer>
    )
  }
}

export default Connector
