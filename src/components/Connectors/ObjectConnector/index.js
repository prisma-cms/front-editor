import React from 'react'

import ConnectorIcon from 'material-ui-icons/SwapHoriz'

import Select from 'material-ui/Select'
import FormControl from 'material-ui/Form/FormControl'
import InputLabel from 'material-ui/Input/InputLabel'
import MenuItem from 'material-ui/Menu/MenuItem'
import Typography from 'material-ui/Typography'

import EditorComponent from '../../../EditorComponent'
import { ConnectorContext } from '../Connector'
import { ObjectView } from '../Viewer'
import { ObjectContext } from '../Connector/ListView'

import pathToRegexp from 'path-to-regexp'

// export const ConnectorContext = createContext({});

class ObjectConnector extends EditorComponent {
  static Name = 'ObjectConnector'
  static help_url = 'https://front-editor.prisma-cms.com/topics/query.html'

  static defaultProps = {
    ...EditorComponent.defaultProps,
    query: '',
    // pagevariable: "page",
    filtersname: 'filters',
    // first: 10,
    hide_wrapper_in_default_mode: true,

    // https://www.apollographql.com/docs/react/api/react-apollo/#optionsfetchpolicy
    fetchPolicy: undefined,
  }

  constructor(props) {
    super(props)

    this.getFilters = this.getFilters.bind(this)
    this.setFilters = this.setFilters.bind(this)
  }

  renderPanelView(content) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">
          <ConnectorIcon /> Object Connector
        </div>
      )
    )
  }

  prepareRootElementProps(props) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      fetchPolicy,
      ...other
    } = super.prepareRootElementProps(props)

    return other
  }

  prepareDragItemProps() {
    return {
      ...super.prepareDragItemProps(),
      filtersname: 'filters',
      where: {},
    }
  }

  prepareDragItemComponents() {
    return super.prepareDragItemComponents().concat([
      {
        name: 'Filters',
        component: 'Filters',
        props: {},
        components: [],
      },
      {
        name: 'ObjectView',
        component: 'ObjectView',
        props: {},
        components: [],
      },
    ])
  }

  getEditorField(props) {
    let { type } = props

    const { key, name, value } = props

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
                }}
              >
                {queryNames
                  .filter((n) => n.endsWith && !n.endsWith('Connection'))
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

        default:
      }
    }

    if (!field) {
      if (activeItem) {
        const {
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

  getFilters() {
    const { where: filters } = this.getComponentProps(this)

    return filters
  }

  setFilters(filters) {
    return this.updateComponentProps({
      where: filters,
    })
  }

  canBeChild(child) {
    let can = false

    if (super.canBeChild(child)) {
      const { props: componentProps } = this.getComponentProps(this)

      const { query } = componentProps || {}

      let parentQuery

      const { parent } = this.props

      if (parent) {
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
          where[i] = value.map((n) =>
            this.injectWhereFromObject({ ...n }, object)
          )
        } else if (typeof value === 'object') {
          where[i] = this.injectWhereFromObject({ ...value }, object)
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
    if (!schema) {
      return null
    }

    return (
      <ObjectContext.Consumer key="object_context">
        {(objectContext) => {
          const { object } = objectContext

          const { inEditMode } = this.getEditorContext()

          const { parent: offsetParent } = this.props

          const {
            props: {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              orderBy,
              query,
              ...otherProps
            },
            parent,
            // ...other
          } = this.getRenderProps()

          /**
           * Если есть родитель и у родителя имеется свойство query, то используем его
           */

          let parentQuery

          if (offsetParent) {
            // const {
            //   query,
            // } = offsetParent.props.data.object.props;

            const {
              props: { query },
            } = offsetParent.getObjectWithMutations()

            if (query) {
              parentQuery = query
            }
          }

          if (!query && !parentQuery) {
            return inEditMode ? (
              <Typography color="error">Query props required</Typography>
            ) : null
          }

          // const {
          // } = this.getComponentProps(this);

          const filters = this.getFilters()

          let where = filters ? { ...filters } : null

          if (!where || !Object.keys(where).length) {
            /**
             * Если элемент находится в роутере, пытаемся получить параметры из УРЛ.
             * Так как у нас добавился еще объект Query, который может возникнуть между
             * коннектором и роутером. то роутинг смотрим и в прародителе
             */
            // let matchParams;

            if (parent) {
              const { match, parent: grandParent } = parent.props

              const { params } = match || {}

              if (params) {
                where = { ...params }
              } else if (grandParent) {
                const { match } = grandParent.props

                const { params } = match || {}

                if (params) {
                  where = {}

                  /**
                   * Получаем только те значения, у которых ключ - строка.
                   */
                  Object.keys(params).map((key) => {
                    if (
                      key &&
                      typeof key === 'string' &&
                      isNaN(parseInt(key))
                    ) {
                      where[key] = params[key]
                    }

                    return null
                  })
                }
              }
            }
          }

          return (
            <ObjectView
              {...otherProps}
              {...this.getComponentProps(this)}
              key={query}
              query={query}
              parentQuery={parentQuery}
              setFilters={this.setFilters}
              getFilters={this.getFilters}
              filters={filters || []}
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
            </ObjectView>
          )
        }}
      </ObjectContext.Consumer>
    )
  }
}

export default ObjectConnector
