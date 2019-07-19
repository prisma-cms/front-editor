import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../../..';

import ApolloEditableObject from "apollo-cms/lib/DataView/Object/Editable";
import { ObjectContext } from '../../Connectors/Connector/ListView';
import { EditableObjectContext } from '../../../../context';
import Query from '../../Connectors/Query';

// import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { parse } from 'graphql';

import pathToRegexp from 'path-to-regexp';
import EditableView from './EditableView';
import DefaultView from './DefaultView';

export class Editable extends ApolloEditableObject {


  static propTypes = {
    ...ApolloEditableObject.propTypes,
    show_header: PropTypes.bool.isRequired,
    extendQuery: PropTypes.func.isRequired,
    getQueryNameFromQuery: PropTypes.func.isRequired,
    query_components: PropTypes.array.isRequired,
  }

  static defaultProps = {
    ...ApolloEditableObject.defaultProps,
    show_header: true,
  };


  constructor(props) {

    super(props);

    this.mutate = this.mutate.bind(this);

  }

  // componentDidUpdate(prevProps, prevState) {

  //   const keys = Object.keys(this.props);

  //   keys.map(key => {

  //     const value = this.props[key];

  //     const prevValue = prevProps[key];

  //     if (value !== undefined && prevValue !== undefined && value !== prevValue) {

  //       console.log("Editable componentDidUpdate value !== prevValue / ", key, value, prevValue);

  //     }

  //   });

  //   super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState);

  // }



  async mutate(props) {

    /**
        Prepare Mutation
         */

    const {
      query_components: children,
      getQueryNameFromQuery,
      extendQuery,
    } = this.props;

    let queries = {

    }

    const {
      id: objectId,
    } = this.getObject() || {}

    children && children.length && children.filter(n => n).map(n => {

      const {
        type,
        props,
      } = n;

      if (type === Query) {

        const {
          query,
        } = props && props.props || {};

        if (query) {

          const queryName = getQueryNameFromQuery(query);

          if (queryName) {
            queries[queryName] = query;
          }

        }
      }

    });


    let mutation = objectId ? queries.update : queries.create;


    if (!mutation) {

      const error = new Error("Can not get mutation");

      return this.addError(error);

    }

    {/* const extendedQuery = this.extendQuery(mutation); */ }

    /**
    Eof Prepare Mutation
     */

    try {

      const extendedQuery = extendQuery(mutation);

      // console.log("mutation", mutation);
      // console.log("mutation extendQuery", extendedQuery);
      // console.log("props", props);

      mutation = gql(extendedQuery);

    }
    catch (error) {
      console.error(error);
    }

    return super.mutate({
      ...props,
      mutation,
      // mutation: extendedQuery(mutation),
    });

  }


  renderEditableView() {

    const {
      children,
    } = this.props;

    // return children ? children.filter(n => n && n.type !== DefaultView) : children;

    return children;
  }


  renderDefaultView() {

    const {
      children,
    } = this.props;

    // return children ? children.filter(n => n && n.type !== EditableView) : children;

    return children;

  }


  // getCacheKey = () => {

  //   const {
  //     cacheKey,
  //   } = this.props;

  // }

  renderHeader() {

    const {
      show_header,
    } = this.props;

    return show_header ? super.renderHeader() : null;
  }


  bindGetButtons = () => () => {

    return this.getButtons();
  }


  render() {

    return <EditableObjectContext.Provider
      value={{
        updateObject: data => this.updateObject(data),
        getEditor: props => this.getEditor(props),
        inEditMode: this.isInEditMode(),
        canEdit: this.canEdit(),
        getObjectWithMutations: () => this.getObjectWithMutations(),
        // getCacheKey: this.getCacheKey,
        getButtons: this.bindGetButtons(),
        mutate: this.mutate,
        ...this.props,
      }}
    >

      <ObjectContext.Provider
        value={{
          object: this.getObjectWithMutations(),
        }}
      >

        {super.render()}

      </ObjectContext.Provider>

    </EditableObjectContext.Provider>;

  }

}



class EditableObject extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    style: {
      ...EditorComponent.defaultProps.style,
      flexBasis: "100%",
    },

    /**
     * УРЛ, куда редиректить при создании нового объекта
     */
    on_create_redirect_url: undefined,
    cache_key: undefined,
    cache_key_prefix: undefined,
    new_object_cache_key: undefined,
    show_header: true,
    hide_wrapper_in_default_mode: true,
  }

  static Name = "EditableObject"
  static help_url = "https://front-editor.prisma-cms.com/topics/editableobject.html";



  constructor(props) {

    super(props);

    this.onCreateObject = this.onCreateObject.bind(this);

  }



  onBeforeDrop = () => {

  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelEditableObject}
      >
        EditableObject
    </div>);
  }


  getEditableClass() {

    return Editable;
  }


  renderChildren() {

    // const {
    //   inEditMode,
    // } = this.getEditorContext();

    let children = super.renderChildren();



    const {
      on_create_redirect_url,
      props,
      data,
      components,
      style,
      cache_key,
      cache_key_prefix,
      new_object_cache_key,
      object,
      ...other
    } = this.getComponentProps(this);


    const Editable = this.getEditableClass();


    return <ObjectContext.Consumer>
      {context => {

        const {
          object,
          loading,
        } = context;

        /**
        Если объекта нет и еще выполняется загрузка,
        прерываем рендерер.
        Иначе объект будет инициализирован как новый, то есть в режиме редактирования со свойством _dirty
         */
        if (!object && loading) {
          return null;
        }


        const {
          id: objectId,
        } = object || {};

        const cacheKey = cache_key ? cache_key : new_object_cache_key && !objectId ? new_object_cache_key : undefined;
        const cacheKeyPrefix = cache_key_prefix;


        return <Editable
          // data={{
          //   object: object || {},
          // }}
          object={object || {}}
          _dirty={!object ? {} : undefined}


          extendQuery={this.extendQueryBind}
          // extendQuery={(query) => this.extendQuery(query)}
          getQueryNameFromQuery={this.getQueryNameFromQuery}
          query_components={children}
          // mutation={gql(extendedQuery)}

          // mutate__={async props => {

          //   try {

          //     let queries = {

          //     }

          //     children && children.length && children.filter(n => n).map(n => {

          //       const {
          //         type,
          //         props,
          //       } = n;

          //       if (type === Query) {

          //         const {
          //           query,
          //         } = props && props.props || {};

          //         if (query) {

          //           const queryName = this.getQueryNameFromQuery(query);

          //           if (queryName) {
          //             queries[queryName] = query;
          //           }

          //         }
          //       }

          //     });


          //     let mutation = objectId ? queries.update : queries.create;

          //     if (!mutation) {

          //       // this.addError("Can not get mutation");

          //       const error = new Error("Can not get mutation");

          //       this.addError(error);

          //       return error;

          //     }

          //     const extendedQuery = this.extendQuery(mutation);

          //     return await this.mutate({
          //       mutation: gql(extendedQuery),
          //       ...props,
          //     })
          //       .catch(error => {
          //         console.error(error);
          //         return error;
          //       })
          //       ;

          //   }
          //   catch (error) {
          //     console.error(error);
          //     return error;
          //   }


          // }}
          // onSave={this.prepareOnSave(object)}
          // onSave={this.onCreateObjectBind}
          onSave={!objectId ? this.onCreateObject : null}
          cacheKey={cacheKey}
          cacheKeyPrefix={cacheKeyPrefix}
          {...other}
        >
          {children}
        </Editable>;
      }}
    </ObjectContext.Consumer>

  }


  // prepareOnSave = (object) => {

  //   const {
  //     id: objectId,
  //   } = object || {};

  //   if (!objectId) {

  //     return result => this.onCreateObject(result)

  //   }
  //   else {

  //     return result => this.onUpdateObject(result)

  //   }

  // }


  // onCreateObjectBind = () => this.onCreateObject();


  onCreateObject(result) {


    const {
      on_create_redirect_url,
    } = this.getComponentProps(this);


    // console.log("onCreateObject on_create_redirect_url", on_create_redirect_url);


    if (on_create_redirect_url) {


      const {
        response,
      } = result.data || {};

      const {
        data: object,
      } = response || {}

      // console.log("onCreateObject object", { ...object });
      // console.log("onCreateObject result", { ...result });


      if (object) {

        const toPath = pathToRegexp.compile(on_create_redirect_url);


        try {

          const url = toPath(object, { noValidate: true });


          if (url) {

            const {
              router: {
                history,
              },
            } = this.context;

            history.push(decodeURIComponent(url));

          }

        }
        catch (error) {
          console.error(error)
        }


      }

    }

    return;
  }


  // onUpdateObject(result) {

  //   return result;
  // }



  /**
   * Расширяем запрос
   */

  extendQueryBind = (Query) => this.extendQuery(Query);

  extendQuery(Query) {

    if (Query) {


      const {
        schema,
      } = this.context;

      /**
       * Проходим запрос на предмет директив в фрагментах
       */



      const parsedQuery = parse(Query);



      if (parsedQuery && schema) {

        const {
          types,
        } = schema;

        const {
          definitions,
        } = parsedQuery;

        if (definitions && definitions.length) {

          definitions.reduceRight((current, definition) => {

            const {
              kind,
              directives,
              // loc: {
              //   start,
              //   end,
              //   source: {
              //     body,
              //   },
              // },
              selectionSet: {
                loc: {
                  start,
                  end,
                  source: {
                    body,
                  },
                },
              },
              typeCondition,
            } = definition;

            if (kind === "FragmentDefinition" && typeCondition) {


              const needAutoloadFields = directives && directives.find(n => n && n.name && n.name.value === "prismaCmsFragmentAllFields") ? true : false;

              if (needAutoloadFields) {

                const {
                  kind,
                  name: {
                    value: type,
                  },
                } = typeCondition;








                /**
                 * Если указана автоподгрузка типов и получен тип, то получаем все скалярные поля для этого типа
                 */






                const fragmentSource = body.slice(start, end);



                if (type) {

                  const field = types.find(n => {

                    const {
                      kind,
                      name,
                    } = n;

                    return kind === "OBJECT" && name === type;

                  });




                  if (field) {

                    let {
                      fields,
                    } = field;




                    fields = fields.filter(n => {

                      return n && n.name && this.isScalar(n) ? true : false;
                    });




                    /**
                     * Если были получены скалярные поля,
                     * добавляем их в запрос
                     */
                    if (fields.length) {

                      const fieldsList = "\n" + fields.map(({ name }) => name).join("\n") + "\n";



                      const position = end - 1;

                      Query = [Query.slice(0, position), fieldsList, Query.slice(position)].join('');



                    }

                  }

                }

              }

            }

            return current;

          }, []);

        }

      }

    }

    return Query;
  }




  isScalar(field) {

    const {
      type: {
        kind,
        ofType,
      },
    } = field;

    if (kind === "SCALAR") {
      return true;
    }
    else if (kind === "ENUM") {
      return true;
    }
    else if ((kind === "NON_NULL" || kind === "LIST") && ofType) {
      return this.isScalar({
        type: ofType,
      });
    }
    else {
      return false;
    }
  }



  getQueryNameFromQuery(query) {


    try {

      const parsedSchema = parse(query);



      if (parsedSchema) {


        const {
          definitions,
        } = parsedSchema;

        if (definitions) {

          const OperationDefinition = definitions.find(n => n.kind === "OperationDefinition");

          if (OperationDefinition) {

            const {
              value,
            } = OperationDefinition.name || {};

            return value;

          }

        }

      }

    }
    catch (error) {
      console.error(error);
    }

  }


}

export default EditableObject;
