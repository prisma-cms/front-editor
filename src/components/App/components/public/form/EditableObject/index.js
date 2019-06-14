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

    return children ? children.filter(n => n.type !== DefaultView) : children;
  }

  renderDefaultView() {

    const {
      children,
    } = this.props;

    return children ? children.filter(n => n.type !== EditableView) : children;

    // const {
    //   fullname,
    // } = this.getObjectWithMutations();

    // return <div>

    //   <input
    //     onChange={event => this.onChange(event)}
    //     name="fullname"
    //     value={fullname || ""}
    //   />

    //   {children}

    // </div>;

  }



  // getEditor(props) {

  //   const {
  //     Editor,
  //     name,
  //     helperText,
  //     onFocus,
  //     fullWidth = true,
  //     label,
  //     ...other
  //   } = props;


  //   const object = this.getObjectWithMutations();

  //   console.log("getEditor object", { ...object });

  //   return super.getEditor(props);

  // }




  // async saveObject(data) {

  //   // const {
  //   //   object,
  //   //   saveObject,
  //   // } = this.props;

  //   // if(saveObject){
  //   //   return saveObject(data);
  //   // }

  //   console.log("saveObject data", data);

  //   const {
  //     mutate,
  //   } = this.props;

  //   if (!mutate) {
  //     throw (new Error("Mutate not defined"));
  //   }

  //   const mutation = this.getMutation(data);

  //   const result = await mutate(mutation).then(r => r).catch(e => {

  //     console.error("saveObject error", e);

  //     // throw (e);
  //     return e;
  //   });

  //   // console.log("result 333", result);

  //   return result;

  // }


  render() {

    return <EditableObjectContext.Provider
      value={{
        updateObject: data => this.updateObject(data),
        getEditor: props => this.getEditor(props),
        inEditMode: this.isInEditMode(),
        canEdit: this.canEdit(),
        getObjectWithMutations: () => this.getObjectWithMutations(),
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
  }

  static Name = "EditableObject"
  static help_url = "https://front-editor.prisma-cms.com/topics/editableobject.html";

  onBeforeDrop = () => {

  }


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelEditableObject}
    >
      EditableObject
    </div>);
  }


  renderChildren() {

    const {
      inEditMode,
    } = this.getEditorContext();

    let children = super.renderChildren();


    return <ObjectContext.Consumer>
      {context => {

        // console.log("EditableObject context", { ...context });

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

        return <Editable
          data={{
            object: object || {},
          }}
          _dirty={!object ? {} : undefined}
          mutate={async props => {

            try {
              const {
                client,
              } = this.context;



              let queries = {

              }

              children.map(n => {

                const {
                  type,
                  props: {
                    props: {
                      query,
                    },
                  },
                } = n;

                // console.log("EditableObject children type", type);
                // console.log("EditableObject children type Query", Query);

                // console.log("EditableObject children type === Query", type === Query);

                if (type === Query) {

                  // console.log("EditableObject children type Query n", n);

                  // console.log("EditableObject children type Query query", query);

                  if (query) {

                    const queryName = this.getQueryNameFromQuery(query);

                    // console.log("EditableObject children type Query query name", queryName);

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

              // console.log("mutate props", { ...props });

              const extendedQuery = this.extendQuery(mutation);

              // console.log("mutate extendQuery", extendedQuery);

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
        >
          {children}
        </Editable>;
      }
      }
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
