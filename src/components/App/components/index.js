
/**
 * ToDo
 * 1. Сейчас не оптимально структура компонентов выстроена, из-за чего нарушается 
 * отзывчивость компонентов на изменения. В частности renderHeader() выполняется
 * из активного элемента, а не текущего, и после сохранения объекта не 
 * прекращается индикатор загрузки. Пришлось хакнуть принудительным обновлением через 2 сек.
 */

import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";
import * as Module from "@prisma-cms/context";
import { Button, IconButton, TextField } from 'material-ui';

import DeleteIcon from "material-ui-icons/Delete";
import CloseIcon from "material-ui-icons/Close";
import { FormControlLabel } from 'material-ui';
import { Switch } from 'material-ui';

// console.log("module", module);
// console.log("Context Module", Module);

// ComponentContext = createContext();

import ObjectEditable from "apollo-cms/lib/DataView/Object/Editable";
import gql from 'graphql-tag';


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


  canEdit() {

    return true;
  }



  // async saveObject(data) {


  //   const {
  //     mutate,
  //   } = this.props;

  //   // console.log("result saveObject", data, mutate);
  //   // console.log("result saveObject this._dirty", { ...this.state._dirty });
  //   // console.log("result saveObject this", this);


  //   if (mutate && mutate !== emptyMutate) {
  //     return super.saveObject(data);
  //   }

  //   const mutation = this.getMutation(data);

  //   const result = await this.mutate(mutation).then(r => r).catch(e => {

  //     // throw (e);
  //     return e;
  //   });

  //   console.log("result 333", result);

  //   return result;

  // }


  // async mutate(props) {


  //   // console.log("mutate props", props);

  //   // return;

  //   const {
  //     query: {
  //       createTemplateProcessor,
  //       updateTemplateProcessor,
  //     },
  //   } = this.context;

  //   const {
  //     id,
  //   } = this.getObjectWithMutations();

  //   const mutation = gql(id ? updateTemplateProcessor : createTemplateProcessor);

  //   return super.mutate({
  //     mutation,
  //     ...props
  //   })
  // }


  // async mutate(props) {

  //   const result = await super.mutate(props)
  //     .catch(r => r);

  //   const {
  //     forceUpdate,
  //   } = this.context;

  //   forceUpdate();

  //   return result;
  // }


  async saveObject(data) {

    const result = await super.saveObject(data)
      .catch(r => r);

    // console.log("saveObject result", result);

    setTimeout(() => {

      const {
        forceUpdate,
      } = this.context;

      forceUpdate()
    }, 1000);

    return result;

  }


  updateObject(data) {

    super.updateObject(data);

    const {
      forceUpdate,
    } = this.context;


    /**
     * Обновляем рутовый компонент, чтобы применить изменения ко всем элементам
     */
    forceUpdate();

  }


  onDragStart() {

    const {
      onDragStart,
    } = this.context;



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
    } = this.context;

    onDragEnd(event);

  }


  onDrop(event) {

    const {
      dragItem,
      dragTarget,
    } = this.context;


    console.log("onDrop dragItem", dragItem);
    console.log("onDrop dragTarget", dragTarget);


    if (dragItem && dragTarget && dragTarget === this) {

      event.preventDefault();
      event.stopPropagation();


      const newItem = this.prepareNewItem();

      console.log("onDrop newItem", newItem);

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
   * Удаление элемента.
   * Если это корневой элемент, удаляем его.
   * Если нет, то удаляем из родительского
   */
  deleteItem() {

    const {
      setActiveItem,
    } = this.context;

    const activeItem = this.getActiveItem();

    const activeParent = activeItem.getActiveParent();

    console.log("deleteItem activeItem", activeItem);
    console.log("deleteItem activeParent", activeParent);
    console.log("deleteItem activeItem === activeParent", activeItem === activeParent);

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

      // console.log("deleteItem index", index);


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

    const activeParent = activeItem.getActiveParent();

    return deletable && activeItem !== activeParent ? true : false;
  }


  /**
   * Надо обновить components, чтобы в объекте было актуальное свойство
   */
  updateParentComponents() {

    const activeParent = this.getActiveParent();

    console.log("onDrop activeParent", activeParent);

    if (!activeParent) {
      throw new Error("Can not get absParent");
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
    } = this.context;


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
    } = this.context;

    setActiveItem(this);

  }


  onMouseOver(event) {



    event.preventDefault();
    event.stopPropagation();

    const {
      setHoveredItem,
    } = this.context;

    setHoveredItem(this);

  }


  onMouseLeave(event) {



    event.preventDefault();
    event.stopPropagation();

    const {
      setHoveredItem,
      hoveredItem,
    } = this.context;

    if (hoveredItem && hoveredItem === this) {

      setHoveredItem(null);

    }

  }


  canBeDropped(dragItem) {

    return true;
  }


  onDragEnter(event) {


    const {
      setDragTarget,
      dragItem,
    } = this.context;

    if (dragItem && this.canBeDropped(dragItem.component)) {

      event.preventDefault();
      event.stopPropagation();

      setDragTarget(this);

      return true;

    }


  }

  onDragOver(event) {

    const {
      dragTarget,
    } = this.context;

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
      ...other
    } = component.props;

    const {
      name,
      components,
      props: componentProps,

    } = component.getObjectWithMutations();


    return {
      ...other,
      ...componentProps,
    };

    // return props || {};
  }


  getRenderProps() {

    // console.log("getRenderProps", { ...this.props });

    const {
      dragTarget,
      activeItem,
      hoveredItem,
      inEditMode,
      classes,
    } = this.context;


    const {
      className,
      mode,
      deletable,
      component,
      mutate,
      data,
      errorDelay,
      SaveIcon,
      ResetIcon,
      EditIcon,
      cacheKeyPrefix,
      ...other
    } = this.props;


    let classNames = [
      className,
      // propsClassName,
    ];

    let componentProps = {
      ...component,
      ...other,
      // ...otherProps,
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
      classes,
      Grid,
      hoveredItem,
      dragTarget,
    } = this.context;

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


    const activeItem = this.getActiveItem();

    if (!activeItem) {
      return null;
    }

    // console.log("renderSettingsView activeItem ", activeItem);

    const {
      name,
      components,

    } = activeItem.getObjectWithMutations();

    // return activeItem.renderHeader();
    // return activeItem.getButtons();

    // return null;

    let header = activeItem.renderHeader();

    const {
      Grid,
      setActiveItem,
    } = this.context;


    let {
      props: {
        // component,
        // deletable,
        props,
        ...other
      },
      constructor: {
        propTypes,
        // defaultProps,
      },
      // ComponentContext,
    } = activeItem;


    const deletable = activeItem.isDeletable();


    // let {
    //   style,
    //   // ...componentProps
    // } = component;

    let style = {}


    const componentProps = this.getComponentProps(activeItem);

    // console.log("renderSettingsView componentProps ", componentProps);

    const structure = this.getStructure(activeItem);


    let settings = [];



    if (componentProps) {

      const names = Object.keys(componentProps);


      names.map(name => {


        // const propType = propTypes[name];

        let value = componentProps[name];

        const type = typeof value;


        const field = this.getEditorField({
          key: name,
          type,
          name,
          label: name,
          value,
          deletable: activeItem.props.data.object.props[name] !== undefined,
          // deletable: true,
        });

        if (field) {
          settings.push(field);
        }

      })

    }



    let output = <Grid
      container
      spacing={8}
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

            console.log("onSave result", result);

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

    // console.log("getStructure component", component, JSON.stringify(component));
    // console.log("getStructure component", item);

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
                  onChange={event => this.onChangeProps(event)}
                  {...other}
                />
              }
              label={name}
              fullWidth
            />

          </Grid>
          {deletable ?
            <Grid
              item
            >
              <IconButton
                onClick={event => {
                  this.removeProps(name);
                }}
              >
                <DeleteIcon />
              </IconButton>
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
              onChange={event => this.onChangeProps(event)}
              {...other}
              fullWidth
            />

          </Grid>
          {deletable ?
            <Grid
              item
            >
              <IconButton
                onClick={event => {
                  this.removeProps(name);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
            : null
          }
        </Grid>
          ;

      default: ;
    }



    return field;
  }


  onChangeProps(event) {

    // console.log("onChangeProps this", this);
    console.log("onChangeProps this.getActiveItem", this.getActiveItem());

    // return;

    return this.updateProps(event.target);
  }

  updateProps(node) {

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
    this.updateComponentProperty(name, value);

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


  updateComponentProperty(name, value) {

    const activeItem = this.getActiveItem();

    console.log("updateComponentProperty activeItem", activeItem);
    console.log("updateComponentProperty name", name);
    console.log("updateComponentProperty value", value);

    return this.updateComponentProps({
      [name]: value,
    });
  }


  // updateComponentProps(data) {

  //   const activeItem = this.getActiveItem();

  //   console.log("updateComponentProps activeItem", activeItem);
  //   console.log("updateComponentProps data", data);
  //   console.log("updateComponentProps this", this);

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

  //   console.log("updateComponentProps new props", props);

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

    /**
     * this - Дополнительный объект в панели управления
     * getActiveItem - Элемент из основной части редактора.
     */
    const activeItem = this.getActiveItem();

    const activeParent = activeItem.getActiveParent();

    console.log("updateComponentProps activeParent", activeParent);

    console.log("updateComponentProps activeParent compare", activeParent === activeItem);

    console.log("updateComponentProps activeItem", activeItem);
    console.log("updateComponentProps data", data);
    console.log("updateComponentProps this", this);

    let props = activeItem.props.props || {};

    console.log("updateComponentProps props", props);

    // return;

    // let props = {
    //   ...oldProps,
    // };

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

    console.log("updateComponentProps new props", props);

    if (activeParent === activeItem) {
      activeParent.updateObject({
        props,
      });
    }
    else {

      let {
        components,
      } = activeItem.props.parent.props;

      console.log("updateComponentProps props parent", activeItem.props.parent);
      console.log("updateComponentProps props parent components", components);
      console.log("updateComponentProps props parent components object", object);

      const index = components.indexOf(object);

      const component = components[index];

      console.log("updateComponentProps props parent components object index", index);
      console.log("updateComponentProps props parent components object component", component);

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
    } = this.context;

    // console.log("getActiveItem", activeItem);
    // console.log("getActiveItem this", this);

    return activeItem;

  }


  isActive() {

    const activeItem = this.getActiveItem();

    return activeItem && activeItem instanceof this.constructor ? true : false;

  }


  renderMainView() {

    const object = this.getObjectWithMutations();

    if (!object) {
      return null;
    }

    // return this.renderChildren();

    const RootElement = this.getRootElement();

    // console.log("getRenderProps", this.getRenderProps());

    const {
      props,
      ...other
    } = this.getRenderProps();

    const {
      props: objectProps,
    } = object;

    return <RootElement
      // {...this.getRenderProps()}
      {...other}
      // {...props}
      {...objectProps}
    >
      {this.renderChildren()}
    </RootElement>;
  }

  getRootElement() {
    return "div";
  }


  renderChildren() {

    const object = this.getObjectWithMutations();

    const {
      Components,
      // components,
      updateObject,
    } = this.context;

    // const {
    //   component: {
    //     components: itemComponents,
    //   },
    // } = this.props;


    const {
      props,
      components: itemComponents,
    } = object;


    let output = [];



    if (itemComponents && itemComponents.length) {

      itemComponents.map((n, index) => {

        const {
          name,
          // props,
          ...other
        } = n;


        let Component = Components.find(n => n.Name === name);

        if (Component) {

          output.push(<Component
            key={index}
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



  render() {

    // const {
    //   ComponentContext,
    // } = this;

    const {
      id: objectId,
      mode,
      props,
      children,
      ...other
    } = this.props;

    let content = null;

    // console.log("ComponentContext", this);
    // console.log("Component render", this);

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

      case "settings":

        content = this.renderSettingsView();
        break;
    }

    if (!content) {
      return null;
    }


    // console.log("activeItem context id", objectId);

    return content;

  }
}


export default EditorComponent;