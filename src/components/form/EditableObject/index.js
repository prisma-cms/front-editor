/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/forbid-foreign-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../../../EditorComponent';

import { EditableObject as ApolloEditableObject } from "apollo-cms";

import { ObjectContext } from '../../Connectors/Connector/ListView';
import { EditableObjectContext } from '../../../context';
import Query from '../../Connectors/Query';

// import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { parse } from 'graphql';

import pathToRegexp from 'path-to-regexp';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/Progress/CircularProgress';

import DeleteIcon from 'material-ui-icons/Delete';

// TODO Fix for new EditableObject
export class Editable extends ApolloEditableObject {


  static propTypes = {
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...ApolloEditableObject.propTypes,
    show_header: PropTypes.bool.isRequired,
    extendQuery: PropTypes.func.isRequired,
    getQueryNameFromQuery: PropTypes.func.isRequired,
    query_components: PropTypes.array.isRequired,
    DeleteIcon: PropTypes.func.isRequired,
    deletable_object: PropTypes.bool.isRequired,
    on_delete_redirect_url: PropTypes.string,
    data: PropTypes.object,
  }

  static defaultProps = {
    ...ApolloEditableObject.defaultProps,
    show_header: true,
    DeleteIcon,
    deletable_object: false,
  };


  constructor(props) {

    super(props);

    this.delete = this.delete.bind(this);

  }


  updateObject(data) {

    for (const i in data) {

      const value = data[i];

      if (value === "") {
        data[i] = null;
      }

    }

    return super.updateObject(data);
  }


  async mutate(props, method) {

    /**
        Prepare Mutation
         */

    const {
      query_components: children,
      getQueryNameFromQuery,
      extendQuery,
    } = this.props;

    const queries = {

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
        } = (props && props.props) || {};

        if (query) {

          const queryName = getQueryNameFromQuery(query);

          if (queryName) {
            queries[queryName] = query;
          }

        }
      }

      return null;
    });


    if (!method) {
      method = objectId ? "update" : "create";
    }

    let mutation = queries && method ? queries[method] : null;

    if (!mutation) {

      const error = new Error("Can not get mutation");

      return this.addError(error);

    }

    /**
    Eof Prepare Mutation
     */

    try {

      const extendedQuery = extendQuery(mutation);


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

    return children;
  }


  renderDefaultView() {

    const {
      children,
    } = this.props;

    return children;

  }


  renderHeader() {

    const {
      show_header,
    } = this.props;

    return show_header ? super.renderHeader() : null;
  }


  getButtons() {

    const {
      id: objectId,
    } = this.getObject() || {};

    const buttons = super.getButtons() || [];

    if (this.inEditMode() && objectId) {
      buttons.push(this.renderDeleteButton());
    }

    return buttons;
  }


  renderDeleteButton() {

    const {
      DeleteIcon,
      deletable_object,
    } = this.props;

    const {
      loading,
    } = this.state;


    return deletable_object ?
      <IconButton
        key="delete"
        onClick={this.delete}
        disabled={loading}
      >
        {loading
          ?
          <CircularProgress />
          :
          <DeleteIcon
          />
        }
      </IconButton>
      : null;
  }


  delete() {

    const {
      id: objectId,
    } = this.getObject() || {};

    if (objectId) {

      if (window.confirm("Удалить данный объект?")) {

        return this.mutate({
          variables: {
            where: {
              id: objectId,
            },
          },
        }, "delete")
          .then(r => {

            const {
              on_delete_redirect_url,
            } = this.props;

            if (on_delete_redirect_url) {

              const {
                router: {
                  history,
                },
              } = this.context;

              history.push(decodeURIComponent(on_delete_redirect_url));

            }

            return r;
          });
      }
    }

  }


  render() {

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _dirty: _dirty_null,
      ...other
    } = this.props;

    const {
      loading,
      _dirty,
      errors,
      notifications,
    } = this.state;

    const fieldErrors = {};

    if (errors && errors.length) {
      errors.map(({ key, message }) => {
        fieldErrors[key] = message;
        return null;
      })
    }

    const object = this.getObjectWithMutations();

    return <EditableObjectContext.Provider
      value={{
        // getCacheKey: this.getCacheKey,

        updateObject: this.updateObject,
        getEditor: this.getEditor,
        inEditMode: this.inEditMode(),
        canEdit: this.canEdit(),
        getObjectWithMutations: this.getObjectWithMutations,
        getObject: this.getObject,
        getButtons: this.getButtons,
        save: this.save,
        mutate: this.mutate,
        loading,
        _dirty,
        errors,
        fieldErrors,
        notifications,
        ...other,
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


  static propTypes = {
    ...EditorComponent.propTypes,
    deletable_object: PropTypes.bool.isRequired,

    /**
     * Если новый объект создается как дочерний от другого объекта,
     * то можно указать имя родителя, чтобы сформировать конструкцию [parent_name]: {connect: parent_id}.
     * Важно! Если выставить это свойство, будет создан именно новый объект, 
     * даже если это имеющийся уже объект (объект будет перетерт). 
     */
    create_as_a_child_of: PropTypes.string,

    /**
     * При рендеринге создает новый ключ для рендеринга Editable.
     * Это удобно, когда надо обновить данные 
     * при сохранении нового объекта без перезагрузки страницы.
     * Важно! В режиме редактирования шаблонов передача меняемого key
     * ломает вывод элементов, поэтому этот параметр следует использовать очень осторожно.
     */
    random_key: PropTypes.bool,
  }

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

    /**
     * Куда редиректить при успешном удалении элемента
     */
    on_delete_redirect_url: undefined,
    cache_key: undefined,
    cache_key_prefix: undefined,
    new_object_cache_key: undefined,
    show_header: true,
    hide_wrapper_in_default_mode: true,
    deletable_object: false,
    create_as_a_child_of: undefined,
    random_key: false,
  }

  static Name = "EditableObject"
  static help_url = "https://front-editor.prisma-cms.com/topics/editableobject.html";



  constructor(props) {

    super(props);

    this.state = {
      ...this.state,
      object_key: Math.random(),
    }

    this.onCreateObject = this.onCreateObject.bind(this);
    this.onSaveObject = this.onSaveObject.bind(this);

  }



  onBeforeDrop = () => {

    return;
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




  /**
   * Позволяет переопределить редактируемый объект, 
   * например, чтобы создавать новый внутри имеющегося
   */
  prepareEditableObject(object) {

    const {
      create_as_a_child_of,
    } = this.getComponentProps(this);

    return create_as_a_child_of ? {} : object;
  }


  /**
   * Этот метод не модифицирует сам редактируемые объект, 
   * а только формирует параметры для класса Editable
   */
  prepareObject(context) {

    return {
      _dirty: this.getDirty(context),
    }
  }


  getDirty(context) {

    let {
      _dirty,
    } = context;

    const {
      object,
    } = context;


    const {
      create_as_a_child_of,
    } = this.getComponentProps(this);

    const {
      id: objectId,
    } = object || {};


    if (create_as_a_child_of) {

      _dirty = _dirty ? {
        ..._dirty,
      } : {};

      Object.assign(_dirty, {
        [create_as_a_child_of]: {
          connect: {
            id: objectId,
          },
        }
      });

    }

    return _dirty;

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

    return;
  }


  onSaveObject(result) {

    const {
      random_key,
    } = this.getComponentProps(this);


    if (random_key) {
      this.setState({
        object_key: Math.random(),
      });
    }


    return this.onCreateObject(result);
  }

  // onUpdateObject(result) {

  //   return result;
  // }



  /**
   * Расширяем запрос
   */

  extendQueryBind = (Query) => this.extendQuery(Query);

  extendQuery(Query) {

    const {
      schema,
    } = this.context;

    if (Query && schema) {
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
              selectionSet: {
                loc: {
                  end,
                },
              },
              typeCondition,
            } = definition;

            if (kind === "FragmentDefinition" && typeCondition) {


              const needAutoloadFields = directives && directives.find(n => n && n.name && n.name.value === "prismaCmsFragmentAllFields") ? true : false;

              if (needAutoloadFields) {

                const {
                  // kind,
                  name: {
                    value: type,
                  },
                } = typeCondition;


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


  renderChildren() {

    // const {
    //   inEditMode,
    // } = this.getEditorContext();

    const children = super.renderChildren();



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
      random_key,
      // _dirty,
      ...other
    } = this.getComponentProps(this);

    const {
      object_key,
    } = this.state;


    const Editable = this.getEditableClass();


    return <ObjectContext.Consumer
      key="editable_object"
    >
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

        /**
         * Здесь есть возможность переопределить объект
         */
        const editableObject = this.prepareEditableObject(object);

        const {
          id: objectId,
        } = editableObject || {};


        const cacheKey = cache_key !== undefined ? cache_key : new_object_cache_key && !objectId ? new_object_cache_key : undefined;
        const cacheKeyPrefix = cache_key_prefix;

        return <Editable
          key={random_key ? object_key : undefined}
          // data={{
          //   object: object || {},
          // }}
          object={editableObject}


          extendQuery={this.extendQueryBind}
          // extendQuery={(query) => this.extendQuery(query)}
          getQueryNameFromQuery={this.getQueryNameFromQuery}
          query_components={children}
          onSave={!objectId ? this.onSaveObject : null}
          cacheKey={cacheKey}
          cacheKeyPrefix={cacheKeyPrefix}
          {...this.prepareObject(context)}
          {...other}
        >
          {children}
        </Editable>;
      }}
    </ObjectContext.Consumer>

  }

}

export default EditableObject;
