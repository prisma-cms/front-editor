
/**
 * ToDo
 * 1. Сейчас не оптимально структура компонентов выстроена, из-за чего нарушается 
 * отзывчивость компонентов на изменения. В частности renderHeader() выполняется
 * из активного элемента, а не текущего, и после сохранения объекта не 
 * прекращается индикатор загрузки. Пришлось хакнуть принудительным обновлением через 2 сек.
 */

import React, { Component, createContext, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";
import * as Module from "@prisma-cms/context";
import { Button, IconButton, TextField } from 'material-ui';

import DeleteIcon from "material-ui-icons/Delete";
import CloseIcon from "material-ui-icons/Close";
import { FormControlLabel } from 'material-ui';
import { Switch } from 'material-ui';




// ComponentContext = createContext();

import ObjectEditable from "apollo-cms/lib/DataView/Object/Editable";
import gql from 'graphql-tag';
import { EditorContext } from '../context';


const emptyMutate = async () => { };


class EditorComponent extends ObjectEditable {

  // static id = module.id;

  // static contextType = Context;

  static propTypes = {
    ...ObjectEditable.propTypes,
    mode: PropTypes.oneOf(["main", "panel", "settings"]).isRequired,

    /**
     * Родительский инстанс компонента.
     * Нужен для того, чтобы получить доступ к родительским элементам
     */
    parent: PropTypes.object,
    deletable: PropTypes.bool.isRequired,
  };


  static defaultProps = {
    ...ObjectEditable.defaultProps,
    deletable: true,
    mutate: emptyMutate,
    data: {},
    style: {
      marginTop: 0,
      marginLeft: 0,
      marginTop: 0,
      marginBottom: 0,
      fontFamily: "Roboto",
      fontSize: undefined,
      textAlign: undefined,
      minHeight: undefined,
      width: undefined,
    },
    contentEditable: false,
  }


  constructor(props) {

    super(props);

    this.updateComponentProperty = this.updateComponentProperty.bind(this);
    this.updateObject = this.updateObject.bind(this);
    this.onChangeProps = this.onChangeProps.bind(this);
    this.updateProps = this.updateProps.bind(this);
    this.getActiveParent = this.getActiveParent.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.save = this.save.bind(this);

  }


  /**
   * Пока что имеются коллизии с обновляемыми объектами, взятыми из кеша,
   * так что пока кеш отключаем
   */
  getCacheKey() {

    return null;
  }


  componentWillUnmount() {

    const {
      activeItem,
      setActiveItem,
    } = this.getEditorContext();

    if (activeItem && activeItem === this) {
      setActiveItem(null);
    }

    super.componentWillUnmount && super.componentWillUnmount();
  }


  canEdit() {

    return true;
  }



  updateObject(data) {

    super.updateObject(data);

    const {
      forceUpdate,
    } = this.getEditorContext();


    /**
     * Обновляем рутовый компонент, чтобы применить изменения ко всем элементам
     */
    forceUpdate();

  }


  onDragStart() {

    const {
      onDragStart,
    } = this.getEditorContext();



    onDragStart(this.prepareDragItem());

  }


  /**
   * Создаем новый элемент, который будет добавлен в схему при перетаскивании
   */
  prepareDragItem() {

    return {
      component: this,
      name: this.constructor.Name,
      props: this.prepareDragItemProps(),
      components: this.prepareDragItemComponents(),
    };
  }

  prepareDragItemProps() {

    return {};
  }

  prepareDragItemComponents() {

    return [];
  }


  onDragEnd(event) {


    const {
      onDragEnd
    } = this.getEditorContext();

    onDragEnd(event);

  }


  onDrop(event) {

    const {
      dragItem,
      dragTarget,
    } = this.getEditorContext();








    if (dragItem && dragTarget && dragTarget === this) {

      event.preventDefault();
      event.stopPropagation();


      const newItem = this.prepareNewItem();



      if (newItem) {

        this.addComponent(newItem);

        return;

      }

      return true;
    }

  }


  /**
   * Обновить мы должны текущий элемент или предка
   */

  addComponent(newItem) {


    let {
      data: {
        object,
      },
    } = this.props;


    let components = object.components || [];

    if (components) {
      components.push(newItem);
    }

    this.updateParentComponents();

  }


  /**
   * Перетираем компоненты текущего объекта
   */
  setComponents(components) {


    let {
      data: {
        object,
      },
    } = this.props;

    Object.assign(object, {
      components,
    });

    this.updateParentComponents();

  }


  /**
   * Удаление элемента.
   * Если это корневой элемент, удаляем его.
   * Если нет, то удаляем из родительского
   */
  deleteItem() {

    const {
      setActiveItem,
    } = this.getEditorContext();

    const activeItem = this.getActiveItem();

    const activeParent = activeItem.getActiveParent();





    if (activeItem === activeParent) {

      this.addError("Sdfdsfds");
      return;
    }
    else {


      let {
        data: {
          object,
        },
        parent: {
          props: {
            data: {
              object: {
                components,
              },
            },
          },
        },
      } = activeItem.props;


      const index = components.indexOf(object);

      components.splice(index, 1);




      // if (components) {
      //   components.push(newItem);
      // }

      activeItem.updateParentComponents();


    }

    // return;

    setActiveItem(null);

  }


  isDeletable() {

    const {
      deletable,
    } = this.props;


    const activeItem = this.getActiveItem();

    if (!activeItem) {
      return false;
    }

    const activeParent = activeItem.getActiveParent();

    return deletable && activeItem !== activeParent ? true : false;
  }


  // isDeletable = () => {

  //   const {
  //     deletable,
  //   } = this.props;


  //   // const activeItem = this.getActiveItem();

  //   // if(!activeItem) {
  //   //   return false;
  //   // }

  //   // const activeParent = this.getActiveParent();

  //   return deletable ? true : false;
  // }


  /**
   * Надо обновить components, чтобы в объекте было актуальное свойство
   */
  updateParentComponents() {

    const activeParent = this.getActiveParent();



    if (!activeParent) {
      // throw new Error("Can not get absParent");

      console.error("Can not get absParent");

      return;
    }

    activeParent.updateObject({
      components: activeParent.props.data.object.components.slice(0),
    });

  }


  /**
   * Проходимся вверх до тех пор, пока не найдем родителя с id
   */
  getActiveParent() {

    const {
      parent,
      data: {
        object,
      },
    } = this.props;

    if (object && object.id) {
      return this;
    }
    else if (parent) {
      return parent.getActiveParent();
    }
    else {
      return this;
    }

  }


  prepareNewItem() {

    const {
      dragItem,
    } = this.getEditorContext();


    let {
      component: componentProto,
      ...newItem
    } = dragItem;


    return newItem;

  }

  /**
   * При клике по активному элементу в документе,
   * отмечаем его, чтобы можно было редактировать его свойства
   */
  onClick(event) {



    event.preventDefault();
    event.stopPropagation();

    const {
      setActiveItem,
    } = this.getEditorContext();

    setActiveItem(this);

  }


  onMouseOver(event) {



    event.preventDefault();
    event.stopPropagation();

    const {
      setHoveredItem,
    } = this.getEditorContext();

    setHoveredItem(this);

  }


  onMouseLeave(event) {



    event.preventDefault();
    event.stopPropagation();

    const {
      setHoveredItem,
      hoveredItem,
    } = this.getEditorContext();

    if (hoveredItem && hoveredItem === this) {

      setHoveredItem(null);

    }

  }


  /**
   * Учитывается при наведении. 
   * Определяет может ли быть брошен сюда перетаскиваемый элемент
   */
  canBeDropped(dragItem) {

    return true;
  }


  onDragEnter(event) {


    const {
      setDragTarget,
      dragItem,
    } = this.getEditorContext();

    if (dragItem && this.canBeDropped(dragItem)) {

      event.preventDefault();
      event.stopPropagation();

      setDragTarget(this);

      return true;

    }


  }

  onDragOver(event) {

    const {
      dragTarget,
    } = this.getEditorContext();

    if (dragTarget === this) {

      event.preventDefault();
      event.stopPropagation();

      return true;
    }

  }


  getComponentProps(component) {


    // const {
    //   component: {
    //     type,
    //     components,
    //     ...props
    //   },
    // } = this.props;

    const {
      mode,
      deletable,
      parent,
      // components,
      // component: {
      //   name,
      //   components: itemComponents,
      //   props: componentProps,
      // },
      // props,
      // errorDelay,
      // object: {
      //   props,
      // },
      // fontFamily,
      // fontSize,
      // marginTop,
      // marginBottom,
      style: defaultStyle,
      ...other
    } = component.props;

    const {
      name,
      components,
      props: objectProps,

    } = component.getObjectWithMutations();


    const {
      style,
      ...componentProps
    } = objectProps || {}


    return {
      ...other,
      ...componentProps,
      style: {
        ...defaultStyle,
        ...style,
      },
      // style: {
      //   ...style,
      //   fontFamily,
      //   fontSize,
      //   marginTop,
      //   marginBottom,
      // },
    };

    // return props || {};
  }


  getRenderProps() {



    const {
      dragTarget,
      activeItem,
      hoveredItem,
      inEditMode,
      classes,
    } = this.getEditorContext();


    const {
      className,
      mode,
      deletable,
      component,
      mutate,
      data: {
        object,
      },
      errorDelay,
      SaveIcon,
      ResetIcon,
      EditIcon,
      cacheKeyPrefix,
      style,
      ...other
    } = this.props;

    const {
      props: objectProps,
    } = object;

    let classNames = [
      className,
      // propsClassName,
    ];

    let componentProps = {
      ...component,
      ...other,
      ...object,
      ...objectProps,
      // ...otherProps,
      ...this.getComponentProps(this),
    };


    if (inEditMode) {

      const isDragOvered = dragTarget === this ? true : false;
      const isActive = activeItem === this ? true : false;
      const isHovered = hoveredItem === this ? true : false;

      const isDirty = this.isDirty();

      classNames = classNames.concat([
        classes.item,
        inEditMode ? classes.itemEditable : "",
        isDragOvered ? "dragOvered" : "",
        isActive ? "active" : "",
        isHovered ? "hovered" : "",
        isDirty ? "dirty" : "",
      ]);

      Object.assign(componentProps, {
        onDrop: event => this.onDrop(event),
        onDragEnter: event => this.onDragEnter(event),
        onDragOver: event => this.onDragOver(event),
        onClick: event => this.onClick(event),
        onMouseOver: event => this.onMouseOver(event),
        onMouseLeave: event => this.onMouseLeave(event),

      });
    }

    Object.assign(componentProps, {
      className: classNames.filter(n => n).join(" "),
    });

    return componentProps;
  }


  renderPanelView(content) {

    const {
      Grid,
    } = this.context;

    const {
      classes,
      hoveredItem,
      dragTarget,
    } = this.getEditorContext();

    const isActive = this.isActive();

    const isHovered = hoveredItem instanceof this.constructor && !isActive ? true : false;

    const isDragOvered = dragTarget && dragTarget instanceof this.constructor ? true : false;

    return <Grid
      item
    >
      <div
        // className={[classes.panelItem, isActive ? "active" : ""].join(" ")}
        className={[
          classes.panelItem,
          isHovered ? "hovered" : "",
          isDragOvered ? "dragOvered" : "",
        ].join(" ")}
        draggable
        onDragStart={event => this.onDragStart(event)}
        onDragEnd={event => this.onDragEnd(event)}
      >
        {content || this.constructor.Name}
      </div>
    </Grid>
  }



  renderSettingsView(content) {



    let header = this.renderHeader(true);

    const {
      Grid,
    } = this.context;

    const {
      setActiveItem,
    } = this.getEditorContext();


    let {
      props: {
        props,
        ...other
      },
    } = this;


    const deletable = this.isDeletable();


    const {
      style: allStyles,
      ...componentProps
    } = this.getComponentProps(this);


    const structure = this.getStructure(this);


    const {
      style,
    } = this.props.props || {};

    const editableStyles = {
      ...allStyles,
      ...style,
    };

    let settings = [];


    if (componentProps) {

      const names = Object.keys(componentProps);

      names.map(name => {


        let value = componentProps[name];

        const type = typeof value;


        const field = this.getEditorField({
          key: name,
          type,
          name,
          label: name,
          value,
          deletable: this.props.data.object.props && this.props.data.object.props[name] !== undefined ? true : false,
        });

        if (field) {
          settings.push(field);
        }

      })

    }


    if (editableStyles) {

      const names = Object.keys(editableStyles);

      names.map(name => {


        let value = editableStyles[name];

        const type = typeof value;


        const field = this.getEditorField({
          key: name,
          type,
          name,
          label: name,
          value,
          deletable: style && style[name] !== undefined ? true : false,
          style: style || {},
        });

        if (field) {
          settings.push(field);
        }

      })

    }


    let output = <Grid
      container
      spacing={8}
      onClick={event => {

        event.preventDefault();
        event.stopPropagation();

      }}
    >

      <Grid
        item
        xs={12}
      >

        <Grid
          container
          spacing={8}
          style={{
            flexDirection: "row-reverse",
          }}
        >

          <Grid
            item
          >
            <IconButton
              title="Завершить редактирование элемента"
              onClick={event => {

                event.preventDefault();
                event.stopPropagation();

                setActiveItem(null);

              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>

          {deletable ?
            <Grid
              item
            >
              <IconButton
                title="Удалить элемент"
                onClick={event => {

                  this.deleteItem();

                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
            : null
          }

        </Grid>

      </Grid>

      <Grid
        item
        xs={12}
      >
        {header}
      </Grid>

      {settings && settings.length ?
        <Grid
          item
          xs={12}
        >
          <Grid
            container
            spacing={8}
            style={{
              borderTop: "1px solid #ddd",
            }}
          >
            {settings.map((n, index) => <Grid
              key={index}
              item
              xs={12}
            >
              {n}
            </Grid>)}
          </Grid>
        </Grid> :
        null
      }

      {content ?
        <Grid
          item
          xs={12}
        >
          {content}
        </Grid>
        : null
      }

      {/* <Grid
        item
        xs={12}
      >
        <Template
          activeItem={activeItem}
          data={{
            object: component,
          }}
          // mutate={async () => { }}
          _dirty={!component.id ? {
            ...component,
          } : undefined}
          onSave={result => {



            const {
              data,
            } = result.data.response || {};

            const {
              id,
            } = data || {};

            if (id && !component.id) {
              this.updateComponent(component, {
                id,
              });
            }

          }}
        />
      </Grid> */}


      <Grid
        item
        xs={12}
      >
        <div
          style={{
            whiteSpace: "pre-wrap",
            overflow: "auto",
          }}
        >
          {structure ? JSON.stringify(structure, true, 2) : null}
        </div>
      </Grid>

    </Grid>;

    return output;
  }


  getStructure(item) {




    // // return component;

    // let {
    //   // name: component.constructor.Name,
    //   props: {
    //     // type,
    //     // props,
    //     // components,
    //     component,
    //   },

    // } = item;

    // return component;

    const {
      CreatedBy,
      ...other
    } = item.getObjectWithMutations();

    return other;

    // return {
    //   type,
    //   props: props,
    //   // components: components ? components.map() : [],
    //   components,
    // };
  }


  getEditorField(props) {

    let {
      key,
      type,
      name,
      value,
      deletable,
      style,
      ...other
    } = props;


    const {
      Grid,
    } = this.context;

    let field = null;

    if (type === "object") {

      if (value === null) {
        type = "string";
      }

    }

    let deleteButton;

    if (deletable) {

      deleteButton = <IconButton
        onClick={event => {

          if (style) {

            delete style[name];

            this.updateComponentProps({
              style,
            })

          }
          else {
            this.removeProps(name);
          }

        }}
      >
        <DeleteIcon />
      </IconButton>

    }

    switch (type) {

      case "boolean":


        field = <Grid
          key={key}
          container
        >
          <Grid
            item
            xs
          >

            <FormControlLabel
              control={
                <Switch
                  name={name}
                  checked={value}
                  color="primary"
                  onChange={event => this.onChangeProps(event, style)}
                  {...other}
                />
              }
              label={name}
              fullWidth
            />

          </Grid>
          {deleteButton ?
            <Grid
              item
            >
              {deleteButton}
            </Grid>
            : null
          }
        </Grid>
          ;

        break;

      case "number":
      case "string":
      case "undefined":

        field = <Grid
          key={key}
          container
        >
          <Grid
            item
            xs
          >
            <TextField
              // key={name}
              type={type}
              name={name}
              // label={name}
              value={value || ""}
              onChange={event => this.onChangeProps(event, style)}
              {...other}
              fullWidth
            />

          </Grid>
          {deleteButton ?
            <Grid
              item
            >
              {deleteButton}
            </Grid>
            : null
          }
        </Grid>
          ;

      default: ;
    }



    return field;
  }


  onChangeProps(event, style) {

    // return;

    return this.updateProps(event.target, style);
  }

  updateProps(node, style) {

    let {
      name,
      value,
      type,
      checked,
    } = node;


    switch (type) {

      case "boolean":
      case "checkbox":

        value = checked;
        break;

      case "number":

        // value = parseFloat(value);
        value = Number(value);


        break;

    }


    // this.updateComponentProperty(component, name, value);
    this.updateComponentProperty(name, value, style);

  }


  // getActiveComponent() {

  //   const activeItem = this.getActiveItem();

  //   let {
  //     props: {
  //       component,
  //     },
  //   } = activeItem;

  //   return component;
  // }


  updateComponentProperty(name, value, style) {

    // console.log("updateComponentProperty", name, value, { ...style });

    if (style) {
      return this.updateComponentProps({
        style: {
          ...style,
          [name]: value,
        },
      });
    }
    else {
      return this.updateComponentProps({
        [name]: value,
      });
    }

  }


  // updateComponentProps(data) {

  //   const activeItem = this.getActiveItem();





  //   const {
  //     props: oldProps,
  //   } = activeItem.getObjectWithMutations();

  //   let props = {
  //     ...oldProps,
  //   };

  //   if (data) {

  //     const keys = Object.keys(data);

  //     keys.map(name => {

  //       const value = data[name];

  //       if (value === undefined) {
  //         delete props[name];
  //       }
  //       else {
  //         props[name] = value;
  //       }

  //     });

  //   }



  //   // return this.updateComponent(component, {
  //   //   props,
  //   // });

  //   return this.updateComponent({
  //     props,
  //   });
  // }


  /**
   * Обновления свойств объекта.
   * Здесь важно понимать когда свойства текущего объекта надо изменить (если корневой или с id),
   * а когда родительский (с плавающей вложенностью)
   */
  updateComponentProps(data) {

    const activeItem = this.getActiveItem();

    return this.updateActiveComponentProps(activeItem, data);

  }


  /**
   * Временный хак. 
   * Я не предусмотрел обновление произвольного компонента (а это надо),
   * поэтому перенес функционал в этот отдельный метод.
   * В дальнейшем надо будет все переосмыслить
   */
  updateActiveComponentProps(activeItem, data) {

    /**
     * this - Дополнительный объект в панели управления
     * getActiveItem - Элемент из основной части редактора.
     */

    const activeParent = activeItem.getActiveParent();

    // let props = activeItem.props.props || {};
    let props = { ...activeItem.props.props } || {};

    const {
      data: {
        object,
      },
    } = activeItem.props;

    if (data) {

      const keys = Object.keys(data);

      keys.map(name => {

        const value = data[name];

        if (value === undefined) {
          delete props[name];
        }
        else {
          props[name] = value;
        }

      });

    }


    if (activeParent === activeItem) {
      activeParent.updateObject({
        props,
      });
    }
    else {

      // let {
      //   components,
      // } = activeItem.props.parent.props;

      let {
        // components,
        data: {
          object: {
            components,
          },
        },
      } = activeItem.props.parent.props;





      if (!components) {
        // components = [];

        // object.components = components;

        // throw new Error("Can not get components");
        console.error("Can not get components");

        return;

      }

      const index = components.indexOf(object);

      const component = components[index];

      if (!component) {

        console.error("Can not get component. updateComponentProps activeItem", activeItem);
        console.error("Can not get component. updateComponentProps activeParent", activeParent);

        // throw new Error("Can not get component");

        return;
      }


      Object.assign(component, {
        props,
      });

      // activeItem.props.props = props;

      activeParent.updateParentComponents();
    }



    // return this.updateComponent(component, {
    //   props,
    // });

    return;

    return this.updateComponent({
      props,
    });
  }


  // updateComponent(component, data) {
  updateComponent(data) {

    const activeItem = this.getActiveItem();

    // let {
    //   components,
    //   updateObject,
    // } = this.context;

    activeItem.updateObject(data);

  }


  // removeProps(name) {

  //   const activeItem = this.getActiveItem();

  //   const {
  //     components,
  //     updateObject,
  //   } = this.context;

  //   let {
  //     props: {
  //       component,
  //     },
  //   } = activeItem;

  //   delete component.props[name];

  //   updateObject({
  //     components,
  //   })

  // }

  removeProps(name) {


    this.updateComponentProps({
      [name]: undefined,
    })

  }


  getActiveItem() {

    const {
      activeItem,
    } = this.getEditorContext();



    return activeItem;

  }


  isActive() {

    const activeItem = this.getActiveItem();

    return activeItem && activeItem instanceof this.constructor ? true : false;

  }


  renderMainView(renderProps) {

    const object = this.getObjectWithMutations();

    if (!object) {
      return null;
    }

    const {
      activeItem,
      settingsViewContainer,
    } = this.getEditorContext();

    // return this.renderChildren();

    const RootElement = this.getRootElement();

    const {
      props,
      ...other
    } = this.getRenderProps();

    const {
      props: objectProps,
    } = object;


    let settingsView;


    if (activeItem && activeItem === this && settingsViewContainer) {

      settingsView = ReactDOM.createPortal(this.renderSettingsView(), settingsViewContainer);

    }


    return <Fragment>

      <RootElement
        // {...this.getRenderProps()}
        {...objectProps}
        {...other}
        // {...props}
        {...renderProps}
      >
        {this.renderChildren()}
      </RootElement>

      {settingsView}
    </Fragment>
  }

  getRootElement() {
    return "div";
  }


  renderChildren(components) {

    const {
      Components,
    } = this.getEditorContext();


    const object = this.getObjectWithMutations();


    const {
      props,
      components: itemComponents,
    } = object;

    components = components || itemComponents;


    let output = [];


    if (itemComponents && itemComponents.length) {

      itemComponents.map((n, index) => {

        const {
          id,
          name,
          // props,
          ...other
        } = n;


        let Component = Components.find(n => n.Name === name);

        if (Component) {

          output.push(<Component
            key={id || index}
            mode="main"
            // component={n}
            parent={this}
            // props={props}
            data={{
              object: n,
            }}
            // _dirty={n}
            {...other}
          />);

        }

      })

    }

    return output;
  }


  renderHeader(show) {

    if (!show) {
      return null;
    }

    // const {
    //   mode,
    // } = this.props;

    // if(mode !== "settings") {
    //   return null;
    // }

    // if(mode === "main") {
    //   return null;
    // }

    return super.renderHeader();

  }


  renderEditableView() {

    return this.renderDefaultView();
  }


  renderEmpty() {

    return this.renderDefaultView();
  }


  // getComponents = () => {

  //   const {
  //     Components,
  //   } = this;

  //   return Components;
  // }

  renderDefaultView() {


    return <EditorContext.Consumer>
      {context => {


        const {
          Components,
        } = context;

        Object.assign(this, {
          Components,
          getEditorContext: () => context,
        });

        const {
          id: objectId,
          mode,
          props,
          children,
          ...other
        } = this.props;

        let content = null;


        // return "Sdfdsf";



        switch (mode) {

          case "panel":

            const activeItem = this.getActiveItem();

            if (!activeItem || this.isActive()) {
              content = this.renderPanelView();
            }

            break;

          case "main":

            content = this.renderMainView();

            break;

            {/* case "settings":

            content = this.renderSettingsView();
            break; */}
        }

        if (!content) {
          return null;
        }

        return content;

      }}
    </EditorContext.Consumer>


  }

  // renderDefaultView() {

  //   // const {
  //   //   ComponentContext,
  //   // } = this;

  //   const {
  //     id: objectId,
  //     mode,
  //     props,
  //     children,
  //     ...other
  //   } = this.props;

  //   let content = null;


  //   // return "Sdfdsf";



  //   switch (mode) {

  //     case "panel":

  //       const activeItem = this.getActiveItem();

  //       if (!activeItem || this.isActive()) {
  //         content = this.renderPanelView();
  //       }

  //       break;

  //     case "main":

  //       content = this.renderMainView();

  //       break;

  //     case "settings":

  //       content = this.renderSettingsView();
  //       break;
  //   }

  //   if (!content) {
  //     return null;
  //   }

  //   return content;

  // }
}


export default EditorComponent;