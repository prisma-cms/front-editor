import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";
import * as Module from "@prisma-cms/context";
import { Button, IconButton, TextField } from 'material-ui';

import DeleteIcon from "material-ui-icons/Delete";
import CloseIcon from "material-ui-icons/Close";
import { FormControlLabel } from 'material-ui';
import { Switch } from 'material-ui';

import Template from "./Template";

// console.log("module", module);
// console.log("Context Module", Module);

// ComponentContext = createContext();

class EditorComponent extends Component {

  static id = module.id;

  static contextType = Context;

  static propTypes = {
    mode: PropTypes.oneOf(["main", "panel", "settings"]).isRequired,

    /**
     * Родительский инстанс компонента.
     * Нужен для того, чтобы получить доступ к родительским элементам
     */
    parent: PropTypes.object,
    deleteItem: PropTypes.func,
    deletable: PropTypes.bool.isRequired,
  };


  static defaultProps = {
    deletable: true,
  }


  constructor(props) {

    super(props);

    // this.id = module.id;

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
      components,
      updateObject,
    } = this.context;


    let {
      component,
      // container,
    } = this.props;


    if (dragItem && dragTarget && dragTarget === this) {

      event.preventDefault();
      event.stopPropagation();


      const newItem = this.prepareNewItem();



      if (newItem) {

        let {
          components: itemComponents,
        } = component;

        itemComponents = itemComponents || [];


        itemComponents.push(newItem);


        // Object.assign(component, {
        //   components: itemComponents,
        // });

        // updateObject({
        //   components,
        // });

        this.updateComponent(component, {
          components: itemComponents,
        });

      }

      return true;
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
      deleteItem,
      parent,
      components,
      component: {
        name,
        components: itemComponents,
        props: componentProps,
      },
      props,
      ...other
    } = component.props;

    // const {
    //   // mode,
    //   // deletable,
    //   // deleteItem,
    //   // parent,
    //   // components,
    //   // component: {
    //   //   type,
    //   //   components: itemComponents,
    //   //   ...props
    //   // },
    //   // ...other
    //   props,
    // } = component.props;


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
      deleteItem,
      deletable,
      component,
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


      classNames = classNames.concat([
        classes.item,
        inEditMode ? classes.itemEditable : "",
        isDragOvered ? "dragOvered" : "",
        isActive ? "active" : "",
        isHovered ? "hovered" : "",

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

    // console.log("activeItem ComponentContext", activeItem.ComponentContext);

    const {
      Grid,
      setActiveItem,
    } = this.context;


    let {
      props: {
        component,
        deleteItem,
        deletable,
        ...other
      },
      constructor: {
        propTypes,
        // defaultProps,
      },
      // ComponentContext,
    } = activeItem;


    let {
      style,
      name,
      components,
      // ...componentProps
    } = component;

    style = style || {}


    const componentProps = this.getComponentProps(activeItem);


    const structure = this.getStructure(activeItem);


    let settings = [];

    // if (propTypes) {

    //   const names = Object.keys(propTypes);



    //   names.map(name => {



    //     const propType = propTypes[name];



    //     if (propType === PropTypes.string || PropTypes.string.isRequired) {

    //       settings.push(<TextField
    //         key={name}
    //         name={name}
    //         label={name}
    //         value={component[name] || ""}
    //         fullWidth
    //         onChange={event => this.onChangeProps(event)}
    //       />);

    //     }

    //   })

    // }




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
        });

        if (field) {
          settings.push(field);
        }

        // if (type === "boolean") {

        //   settings.push(<FormControlLabel
        //     key={name}
        //     control={
        //       <Switch
        //         checked={value}
        //         // onChange={this.handleChange('checkedB')}
        //         // value="checkedB"
        //         color="primary"
        //       />
        //     }
        //     label={name}
        //   />);

        // }

        // else if (type === "string") {

        //   settings.push(<TextField
        //     key={name}
        //     name={name}
        //     label={name}
        //     value={component[name] || ""}
        //     fullWidth
        //     onChange={event => this.onChangeProps(event)}
        //   />);

        // }
        // else if (type === "number") {

        //   settings.push(this.getEditorField({
        //     key: name,
        //     type: "number",
        //     name: name,
        //     label: name,
        //     value: value || "",
        //     fullWidth: true,
        //   }));

        //   // settings.push(<TextField
        //   //   key={name}
        //   //   type="number"
        //   //   name={name}
        //   //   label={name}
        //   //   value={component[name] || ""}
        //   //   fullWidth
        //   //   onChange={event => this.onChangeProps(event)}
        //   // />);
        // }


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

          {deleteItem && deletable ?
            <Grid
              item
            >
              <IconButton
                title="Удалить элемент"
                onClick={event => {

                  deleteItem();
                  setActiveItem(null);

                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
            : null
          }

        </Grid>

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
            {settings}
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

      <Grid
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
      </Grid>


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
    console.log("getStructure component", item);

    // return component;

    let {
      // name: component.constructor.Name,
      props: {
        // type,
        // props,
        // components,
        component,
      },

    } = item;

    return component;

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
            {/* <TextField
              // key={name}
              // type="number"
              // name={name}
              // label={name}
              // value={component[name] || ""}
              // fullWidth
              onChange={event => this.onChangeProps(event)}
              {...props}
            /> */}

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
        </Grid>
          ;

      default: ;
    }



    return field;
  }


  onChangeProps(event) {


    return this.updateProps(event.target);
  }

  updateProps(node) {

    let {
      name,
      value,
      type,
      checked,
    } = node;



    // const activeItem = this.getActiveItem();

    // const {
    //   components,
    //   updateObject,
    // } = this.context;

    // let {
    //   props: {
    //     component,
    //   },
    // } = activeItem;

    const component = this.getActiveComponent();

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


    this.updateComponentProperty(component, name, value);

  }


  getActiveComponent() {

    const activeItem = this.getActiveItem();

    let {
      props: {
        component,
      },
    } = activeItem;

    return component;
  }


  updateComponentProperty(component, name, value) {


    console.log("updateComponentProperty component", component);
    console.log("updateComponentProperty name", name);
    console.log("updateComponentProperty value", value);

    // return;

    // let props = component.props || {};

    // Object.assign(props, {
    //   [name]: value,
    // });

    return this.updateComponentProps(component, {
      [name]: value,
    });
  }


  updateComponentProps(component, data) {

    console.log("updateComponentProps component", component);
    console.log("updateComponentProps data", data);

    let props = component.props || {};

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


    return this.updateComponent(component, {
      props,
    });
  }


  updateComponent(component, data) {

    let {
      components,
      updateObject,
    } = this.context;

    // Object.assign(component, data);

    console.log("updateComponent", component, { ...data });

    if (data) {

      const keys = Object.keys(data);

      keys.map(name => {

        const value = data[name];

        if (value === undefined) {
          delete component[name];
        }
        else {
          component[name] = value;
        }

      });

    }

    updateObject({
      components,
    });

  }


  removeProps(name) {

    const activeItem = this.getActiveItem();

    const {
      components,
      updateObject,
    } = this.context;

    let {
      props: {
        component,
      },
    } = activeItem;

    delete component.props[name];

    updateObject({
      components,
    })

  }


  getActiveItem() {

    const {
      activeItem,
    } = this.context;

    return activeItem;

  }


  isActive() {

    const activeItem = this.getActiveItem();

    return activeItem && activeItem instanceof this.constructor ? true : false;

  }


  renderMainView() {

    return this.renderChildren();
  }


  renderChildren() {


    const {
      Components,
      components,
      updateObject,
    } = this.context;

    const {
      component: {
        components: itemComponents,
      },
    } = this.props;


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
            component={n}
            parent={this}
            // props={props}
            deleteItem={() => {

              itemComponents.splice(index, 1);

              updateObject({
                components,
              });

            }}
            {...other}
          />);

        }



      })



    }


    return output;
  }


  render() {

    const {
      ComponentContext,
    } = this;

    const {
      id: objectId,
      mode,
      props,
      children,
      ...other
    } = this.props;

    let content = null;

    // console.log("ComponentContext", this);

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