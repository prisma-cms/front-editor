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


  renderEditableView() {

    const {
      children,
    } = this.props;

    return children ? children.filter(n => n && n.type !== DefaultView) : children;
  }

  renderDefaultView() {

    const {
      children,
    } = this.props;

    return children ? children.filter(n => n && n.type !== EditableView) : children;

  }


  // getCacheKey = () => {

  //   const {
  //     cacheKey,
  //   } = this.props;

  // }


  render() {

    return <EditableObjectContext.Provider
      value={{
        updateObject: data => this.updateObject(data),
        getEditor: props => this.getEditor(props),
        inEditMode: this.isInEditMode(),
        canEdit: this.canEdit(),
        getObjectWithMutations: () => this.getObjectWithMutations(),
        // getCacheKey: this.getCacheKey,
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

    /**
     * УРЛ, куда редиректить при создании нового объекта
     */
    on_create_redirect_url: undefined,
    cache_key: undefined,
    cache_key_prefix: undefined,
    new_object_cache_key: undefined,
  }

  static Name = "EditableObject"
  static help_url = "https://front-editor.prisma-cms.com/topics/editableobject.html";

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

        {/* console.log("ObjectContext context", { ...context }); */ }

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
          mutate={async props => {

            try {
              const {
                client,
              } = this.context;



              let queries = {

              }

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

                    const queryName = this.getQueryNameFromQuery(query);

                    if (queryName) {
                      queries[queryName] = query;
                    }

                  }
                }

              });


              let mutation = objectId ? queries.update : queries.create;

              if (!mutation) {

                console.error("Can not get mutation");

                return false;
              }

              const extendedQuery = this.extendQuery(mutation);

              return await client.mutate({
                mutation: gql(extendedQuery),
                ...props,
              })
                .catch(error => {
                  console.error(error);
                })
                ;

            }
            catch (error) {
              console.error(error);
            }


          }}
          onSave={this.prepareOnSave(object)}
          cacheKey={cacheKey}
          cacheKeyPrefix={cacheKeyPrefix}
          {...other}
        >
          {children}
        </Editable>;
      }}
    </ObjectContext.Consumer >

  }


  prepareOnSave(object) {

    const {
      id: objectId,
    } = object || {};

    if (!objectId) {

      return result => this.onCreateObject(result)

    }
    else {

      return result => this.onUpdateObject(result)

    }

  }


  onCreateObject(result) {


    const {
      on_create_redirect_url,
    } = this.getComponentProps(this);


    if (on_create_redirect_url) {


      const {
        response,
      } = result.data || {};

      const {
        data: object,
      } = response || {}

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

    return result;
  }


  onUpdateObject(result) {

    return result;
  }



  /**
   * Расширяем запрос
   */
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
