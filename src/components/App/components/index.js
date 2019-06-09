
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
import CloneIcon from "material-ui-icons/ContentCopy";
import DragIcon from "material-ui-icons/DragHandle";
import ArrowUpIcon from "material-ui-icons/ArrowUpward";
import ArrowDownIcon from "material-ui-icons/ArrowDownward";
import LinkIcon from "material-ui-icons/Link";
import HelpIcon from "material-ui-icons/HelpOutline";

import { FormControlLabel } from 'material-ui';
import { Switch } from 'material-ui';




// ComponentContext = createContext();

import ObjectEditable from "apollo-cms/lib/DataView/Object/Editable";
import gql from 'graphql-tag';
import { EditorContext } from '../context';

// import SingleUploader from "@prisma-cms/uploader/lib/components/SingleUploader";
import Uploader, {
  FileInput,
} from "@prisma-cms/uploader";

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
      position: undefined,
      display: undefined,
      marginTop: undefined,
      marginBottom: undefined,
      marginLeft: undefined,
      marginRight: undefined,
      paddingTop: undefined,
      paddingBottom: undefined,
      paddingLeft: undefined,
      paddingRight: undefined,
      color: undefined,
      fontFamily: undefined,
      fontSize: undefined,
      fontWeight: undefined,
      textAlign: undefined,
      textTransform: undefined,
      verticalAlign: undefined,
      minHeight: undefined,
      height: undefined,
      width: undefined,
      maxWidth: undefined,
      border: undefined,
      borderRadius: undefined,
      background: undefined,
      backgroundImage: undefined,
      backgroundColor: undefined,
      backgroundPosition: undefined,
      backgroundClip: undefined,
      backgroundSize: undefined,
      backgroundRepeat: undefined,
      backgroundAttachment: undefined,
      opacity: undefined,
      visibility: undefined,
      zIndex: undefined,
    },
    id: undefined,
    src: undefined,
    name: undefined,
    contentEditable: false,
    className: undefined,
    lang: undefined,
  }


  constructor(props) {

    super(props);

    const {
      maxStructureLengthView = 3000,
    } = props;

    this.updateComponentProperty = this.updateComponentProperty.bind(this);
    this.updateObject = this.updateObject.bind(this);
    this.onChangeProps = this.onChangeProps.bind(this);
    this.updateProps = this.updateProps.bind(this);
    this.getActiveParent = this.getActiveParent.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.save = this.save.bind(this);

    this.state = {
      ...this.state,
      maxStructureLengthView,
    }

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


  /**
   * Редактировать можно в следующих случаях:
   * 1. Если нет родителя и нет id
   * 2. Если есть ID и пользователь является владельцем
   */
  canEdit() {

    const {
      id: objectId,
      CreatedBy,
    } = this.getObjectWithMutations();

    const {
      parent,
    } = this.props;

    const {
      id: currentUserId,
      sudo,
    } = this.getCurrentUser() || {};

    const {
      id: createdById,
    } = CreatedBy || {};


    if (objectId) {
      // return true;

      if ((createdById && createdById === currentUserId) || sudo) {
        return true;
      }

    }
    else {

      if (!parent) {
        return true;
      }

    }

    return false;
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


  onDragStart(event, item) {

    const {
      onDragStart,
    } = this.getEditorContext();



    onDragStart(event, item ? item : this.prepareDragItem());

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
      // setActiveItem,
      onDragEnd,
    } = this.getEditorContext();








    if (dragItem && dragTarget && dragTarget === this) {

      event.preventDefault();
      event.stopPropagation();


      /**
       * Здесь надо учитывать добавление или перетаскивание элемента.
       * Если вбрасываемый объект - готовый инстанс, то перемещаем его.
       * Иначе создаем новый.
       */

      if (dragItem instanceof EditorComponent) {

        const {
          parent: dragItemParent,
        } = dragItem.props;



        /**
         * Нельзя переносить элементы, у которых нет родителя
         */
        if (!dragItemParent) {
          // return false;
        }

        /**
         * Нет смысла закидывать в себя же
         */
        else if (dragItemParent === this) {
          // return false;
        }

        /**
         * Если все ОК, переносим элемент в другой блок.
         * Для этого надо найти переносимый элемент в родительском массиве элементов и перенести в новый.
         */
        else {

          const component = dragItem.getComponentInParent();



          if (component) {

            let {
              // components,
              data: {
                object: {
                  components,
                },
              },
            } = dragItem.props.parent.props;

            const index = components.indexOf(component);



            /**
             * Если компонент найден, то исключаем его из массива
             */
            if (index !== -1) {

              const movingComponent = components.splice(index, 1)[0];

              this.addComponent(movingComponent);

            }

          }

        }

      }
      else {

        const newItem = this.prepareNewItem();


        if (newItem) {

          this.addComponent(newItem);

          // return;

        }

      }


      // setActiveItem(null);
      onDragEnd();

      return true;
    }

  }


  /**
   * Двигаем блок вверх
   */
  moveBlockUp() {


    const component = this.getComponentInParent();

    if (component) {

      let {
        // components,
        data: {
          object: {
            components,
          },
        },
      } = this.props.parent.props;

      const index = components.indexOf(component);

      /**
       * Если элемент не на первом месте, двигаем его
       */
      if (index > 0) {

        components.splice(index - 1, 0, components.splice(index, 1)[0]);

        this.updateParentComponents();

      }

    }

  }

  /**
   * Двигаем блок вниз
   */
  moveBlockDown() {


    const component = this.getComponentInParent();

    if (component) {

      let {
        // components,
        data: {
          object: {
            components,
          },
        },
      } = this.props.parent.props;

      const index = components.indexOf(component);



      /**
       * Если элемент не на первом месте, двигаем его
       */
      if (index !== -1 && components.length > index + 1) {

        components.splice(index + 1, 0, components.splice(index, 1)[0]);

        this.updateParentComponents();

      }

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

    const {
      name,
      component,
    } = newItem;

    if (!component) {
      Object.assign(newItem, {
        component: name,
      });
    }

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





    if (activeItem === activeParent && !activeItem.props.parent) {

      this.addError("Can not delete root item");
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

      activeItem.props.parent.updateParentComponents();

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

    // const activeParent = activeItem.getActiveParent();

    // return deletable && activeItem !== activeParent ? true : false;

    return deletable && activeItem.props.parent ? true : false;
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

    const {
      forceUpdate,
    } = this.getEditorContext();

    const activeParent = this.getActiveParent();



    if (!activeParent) {
      // throw new Error("Can not get absParent");

      console.error("Can not get absParent");

      return;
    }

    activeParent.updateObject({
      components: activeParent.props.data.object.components.slice(0),
    });


    // forceUpdate();

    return;

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

    // if (event.target === event.currentTarget) {

    event.preventDefault();
    event.stopPropagation();

    const {
      setActiveItem,
    } = this.getEditorContext();

    setActiveItem(this);

    // }

  }


  onMouseOver(event) {

    if (event.target === event.currentTarget) {

      event.preventDefault();
      event.stopPropagation();



      const {
        setHoveredItem,
      } = this.getEditorContext();

      setHoveredItem(this);

    }

  }


  onMouseLeave(event) {

    if (event.target === event.currentTarget) {

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

  }


  // onDragEnter(event) {


  //   const {
  //     setDragTarget,
  //     dragItem,
  //   } = this.getEditorContext();

  //   if (dragItem && this.canBeChild(dragItem)) {

  //     event.preventDefault();
  //     event.stopPropagation();

  //     setDragTarget(this);

  //     return true;

  //   }


  // }


  // onDragEnter(event) {


  //   const {
  //     setDragTarget,
  //     dragItem,
  //   } = this.getEditorContext();

  //   if (dragItem && dragItem.component && this.canBeChild(dragItem) && dragItem.component.canBeParent(this)) {

  //     event.preventDefault();
  //     event.stopPropagation();

  //     setDragTarget(this);

  //     return true;

  //   }

  // }

  // onDragEnter(event) {


  //   const {
  //     setDragTarget,
  //     dragItem,
  //   } = this.getEditorContext();

  //   // if (dragItem && dragItem.component && this.canBeChild(dragItem) && dragItem.component.canBeParent(this)) {
  //   if (dragItem && this.canBeChild(dragItem)) {

  //     event.preventDefault();
  //     event.stopPropagation();

  //     setDragTarget(this);

  //     return true;

  //   }

  // }



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


  /**
   * Учитывается при наведении. 
   * Определяет может ли быть брошен сюда перетаскиваемый элемент
   */
  // canBeDropped(dragItem) {

  //   return this.canBeChild(dragItem);
  // }

  /**
   * Возможно этот метод будет оставлен (или переименован).
   * Получается следующая логика:
   * При перетаскивании, дочерний элемент смотрим, хочет ли он стать дочерним 
   * через метод canBeChild(), в котором смотрит
   * 
   */

  canBeDropped(child) {

    if (!child || child === this) {
      return false;
    }

    let item;


    /**
     * Если это перетаскивается готовый элемент на странице, проверяем, чтобы это не был родитель
     */
    if (child instanceof EditorComponent) {

      item = child;

      const {
        parent: dragItemParent,
      } = child.props;

      /**
       * Если у перетаскиваемого элемента нет родителя, то нельзя вкидывать
       */
      if (!dragItemParent) {
        return false;
      }




      let Parent = this.props.parent;

      while (Parent && (Parent = Parent.props.parent)) {

        if (Parent === dragItemParent) {
          return false;
        }

        // Parent = Parent.props.parent;



      }

      // return false;
    }
    /**
     * Иначе это новый компонент, перетаскиваемый из панели компонентов
     */
    else {

      if (child && child.component) {

        item = child.component;

      }
    }

    if (item) {

      return item.canBeParent(this);

    }

    return false;
  }


  /**
   * В новом компоненте проверяет может ли компонент на странице стать родительским для него.
   */
  canBeParent(parent) {

    /**
     * Может, если этот компонент может быть дочерним для целевого.
     */

    return parent.canBeChild(this);
  }


  /**
   * В родительском компоненте проверяет может ли новый компонент стать дочерним.
   */
  canBeChild(child) {

    return child ? true : false;
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

      createTemplate,
      updateTemplate,
      deleteTemplate,
      errorDelay,
      SaveIcon,
      ResetIcon,
      EditIcon,
      cacheKeyPrefix,
      mutate,
      // fullWidth,
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


  getRenderProps(componentProps = {}) {



    const {
      inEditMode,
      classes,
    } = this.getEditorContext();


    const {
      className: defaultClassName,
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
      props: {
        className,
        ...objectProps
      },
    } = object;

    let classNames = [
      defaultClassName,
      className,
      // propsClassName,
    ];

    Object.assign(componentProps, {
      // ...component,
      ...other,
      ...object,
      ...objectProps,
      // ...otherProps,
      ...this.getComponentProps(this),
    });


    if (inEditMode) {

      const {
        dragItem,
        dragTarget,
        activeItem,
        hoveredItem,
      } = this.getEditorContext();


      // if (dragItem && (dragItem.component && !dragItem.component.canBeParent(this))) {

      // }

      const isRoot = this.isRoot();

      classNames = classNames.concat([
        classes.item,
        inEditMode ? classes.itemEditable : "",
        isRoot ? "root" : "",
      ]);



      /**
       * Если есть перетаскиваемый элемент, проверяем, может ли компонент стать родительским для него.
       * Если нет, то убираем бордеры и события.
       */
      if (dragItem && (dragItem.component && !dragItem.component.canBeParent(this))) {
        classNames = classNames.concat([
          "disabled",
        ]);
      }
      else {
        // if (!dragItem || (!dragItem.component || dragItem.component.canBeParent(this))) {
        const isDragOvered = dragTarget === this ? true : false;
        const isActive = activeItem === this ? true : false;
        const isHovered = hoveredItem === this ? true : false;
        const isDirty = this.isDirty();

        classNames = classNames.concat([
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

    const {
      help_url,
    } = this.constructor;

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
        {content || this.constructor.Name} {help_url ? <a
          href={help_url}
          target="_blank"
          className={classes.helpLink}
        >
          <HelpIcon />
        </a> : null}
      </div>
    </Grid>
  }



  renderSettingsView(content) {


    const canEdit = this.canEdit();

    const object = this.getObjectWithMutations();

    const {
      id: objectId,
      name,
      description,
    } = object;

    const {
      maxStructureLengthView,
    } = this.state;


    let header = this.renderHeader(true);

    const {
      Grid,
      Link,
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


    const activeParent = this.getActiveParent();

    const {
      id: parentId,
    } = activeParent.getObjectWithMutations();



    const deletable = this.isDeletable();


    const {
      style: allStyles,
      ...componentProps
    } = this.getComponentProps(this);


    const isRoot = this.isRoot();

    const structure = this.getStructure(this);


    let structureView;

    if (structure) {

      try {
        structureView = JSON.stringify(structure, true, 2)

        if (structureView) {



        }

      }
      catch (error) {
        console.error(error);
      }
    }


    const structureViewLength = structureView && structureView.length || 0;

    if (maxStructureLengthView && structureViewLength > maxStructureLengthView) {

      structureView = <Button
        onClick={event => {
          this.setState({
            maxStructureLengthView: structureViewLength,
          })
        }}
      >
        Show {structureViewLength} chars
      </Button>

    }
    else {
      structureView = <div
        contentEditable={isRoot ? true : false}
        suppressContentEditableWarning={true}
        style={isRoot ? {
          border: "1px dashed #ddd",
          padding: 3,
        } : undefined}
        onInput={event => {

          const {
            innerText,
          } = event.target;

          let data;

          if (innerText) {

            try {

              data = JSON.parse(innerText);

            }
            catch (error) {

            }
          }

          if (data) {

            const {
              name,
              props,
              // component,
              components,
            } = data;

            // if (component && components && props) {
            if (components && props) {

              this.updateObject({
                name,
                props,
                // component,
                components,
              });

            }

          }

        }}
      >
        {structureView}
      </div >
    }


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
          style: editableStyles || {},
        });

        if (field) {
          settings.push(field);
        }

      })

    }


    let buttons = <Grid
      container
      spacing={8}
      alignItems="center"
    // style={{
    //   flexDirection: "row-reverse",
    // }}
    >
      <Grid
        item
        xs
      >
      </Grid>

      {/* {!isRoot && !objectId && activeParent && parentId ? */}
      {objectId ?
        <Grid
          item
        >
          <Link
            to={`/templates/${objectId}`}
          >
            <LinkIcon

            />
          </Link>
        </Grid>
        : null
      }
      {!isRoot && !objectId && activeParent ?
        <Grid
          item
        >
          <IconButton
            title="Сохранить в отдельный компонент"
            onClick={async event => {

              /**
              При сохранении, мы должны текущий элемент заменить новым
               */

              event.preventDefault();
              event.stopPropagation();





              const {
                query: {
                  createTemplateProcessor,
                },
              } = this.context;


              // const {
              //   props: {
              //     name,
              //     description,
              //     props,
              //     components,
              //   },
              // } = this;


              const {
                createdAt,
                updatedAt,
                __typename,
                ...template
              } = this.getObjectWithMutations();

              let Parent;

              if (parentId) {

                Parent = {
                  connect: {
                    id: parentId,
                  },
                };

              }

              await this.mutate({
                mutation: gql(createTemplateProcessor),
                variables: {
                  data: {
                    ...template,
                    Parent,
                  },
                },
              })
                .then(r => {



                  const {
                    success,
                    data,
                  } = r.data.response || {};

                  if (success && data) {

                    const {
                      id: newTemplateId,
                    } = data;

                    let component = this.getComponentInParent();

                    Object.assign(component, {
                      id: newTemplateId,
                      props: {},
                      components: [],
                    });


                    activeParent.updateParentComponents();

                  }

                })
                ;


            }}
          >
            <CloneIcon />
          </IconButton>
        </Grid>
        : null
      }

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

    </Grid>


    let output = <Grid
      container
      spacing={8}
      onMouseOver={event => {
        // event.preventDefault();
        event.stopPropagation();
      }}
      onMouseLeave={event => {
        // event.preventDefault();
        event.stopPropagation();
      }}
      onClick={event => {



        /**
        Важно! Хотя этот блок отрендерен через портал в другую часть HTML-документа, на него распростроняются ивенты
        из родительского компонента. https://prisma-cms.com/chat-messages/cjv791tug5qg50989k3v2tdaa
        Из-за этого при клике событие уходит в ближайший верхний элемент основной области (и устанавливает активный компонент).
        Для предотвращения вызываем event.stopPropagation().
        Если установить и event.preventDefault(), то тогда не срабатывают клики на компонентах типа @prisma-cms/uploader
        event.target === event.currentTarget вроде помогает
         */
        // event.preventDefault();
        event.stopPropagation();
      }}
    >

      <Grid
        item
        xs={12}
      >

        {buttons}

      </Grid>

      <Grid
        item
        xs={12}
      >
        {header}
      </Grid>


      {canEdit ?

        <Fragment>

          <Grid
            item
            xs={12}
          >
            <TextField
              name="name"
              label="Name"
              value={name || ""}
              onChange={event => this.onChange(event)}
              fullWidth
            />
          </Grid>

          <Grid
            item
            xs={12}
          >
            <TextField
              name="description"
              label="Description"
              value={description || ""}
              onChange={event => this.onChange(event)}
              fullWidth
            />
          </Grid>

        </Fragment>
        : null
      }

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
          {structureView}
        </div>
      </Grid>

    </Grid>;

    return output;
  }


  isRoot() {

    const activeParent = this.getActiveParent();

    return activeParent === this;
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

    let secondary;


    switch (name) {

      case "backgroundImage":


        // secondary = <Uploader
        //   onUpload={response => {

        //     const {
        //       path,
        //     } = response.data.singleUpload || {};


        //     if (path) {

        //       const {
        //         style,
        //       } = this.props.props || {};

        //       this.updateComponentProperty(name, `url(/images/big/${path})`, style || {
        //       });

        //     }
        //   }}
        // >
        // </Uploader>

        secondary = this.renderUploader(name);

        break;

    }


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

          {secondary ?
            <Grid
              item
            >
              {secondary}
            </Grid>
            :
            null
          }

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


  renderUploader(name, props = {}) {

    const {
      onUpload = path => {

        const {
          style,
        } = this.props.props || {};

        this.updateComponentProperty(name, `url(/images/big/${path})`, style || {
        });

      },
      ...other
    } = props;

    return <Uploader
      onUpload={response => {

        const {
          path,
        } = response.data.singleUpload || {};

        if (path) {


          onUpload(path);

          // this.updateComponentProperty(name, `url(/images/big/${path})`, style || {
          // });

        }
      }}
      {...other}
    >
    </Uploader>
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


      const component = activeItem.getComponentInParent();


      if (component) {

        Object.assign(component, {
          props,
        });

        // activeItem.props.props = props;

        activeParent.updateParentComponents();

      }

    }



    // return this.updateComponent(component, {
    //   props,
    // });

    return;

    // return this.updateComponent({
    //   props,
    // });
  }


  /**
   * ToDo. Сейчас при перетаскивании элементов с id возникают проблемы,
   * потому что у одного родителя может быть сразу несколько потомков с одним и тем же id.
   * По этой причине мы не можем сейчас четко определить какой же элемент двигался.
   */
  getComponentInParent() {

    // const activeItem = this;

    const {
      data: {
        object,
      },
      parent,
    } = this.props;




    // let {
    //   components,
    // } = activeItem.props.parent.props;

    if (!parent) {
      console.error("Can not get parent");
      return;
    }

    let {
      // components,
      data: {
        object: {
          components,
        },
      },
    } = this.props.parent.props;


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

      console.error("Can not get component. updateComponentProps activeItem", this);
      // console.error("Can not get component. updateComponentProps activeParent", activeParent);

      // throw new Error("Can not get component");

      return;
    }

    return component;
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

    const {
      Grid,
    } = this.context;

    const object = this.getObjectWithMutations();

    if (!object) {
      return null;
    }


    const {
      props: objectProps,
      name,
    } = object;


    const {
    } = this.props;


    const {
      activeItem,
      dragTarget,
      hoveredItem,
      settingsViewContainer,
      inEditMode,
      classes,
      onDragStart,
    } = this.getEditorContext();

    // return this.renderChildren();

    const RootElement = this.getRootElement();

    const {
      props,

      /**
       * component исключаем, так как некоторые компоненты (типа Grid)
       * принимают его как параметр
       */
      component,
      ...other
    } = this.getRenderProps();

    let settingsView;

    /**
     * Заголовок блока, чтобы можно было перетаскивать и т.п.
     */
    let badge;

    if (inEditMode) {

      const isActive = activeItem === this ? true : false;
      const isDragOvered = dragTarget === this ? true : false;
      const isHovered = hoveredItem === this ? true : false;


      if (isActive && settingsViewContainer) {

        /**
         * Важно по наследованию событий в порталы
         * https://github.com/facebook/react/issues/11387
         */
        settingsView = ReactDOM.createPortal(this.renderSettingsView(), settingsViewContainer);

      }

      if (isActive || isDragOvered || isHovered) {

        badge = <div
          className={classes.blockBadge}
          contentEditable={false}
        >
          <Grid
            container
            alignItems="center"
            style={{
              flexWrap: "nowrap",
            }}
          >

            <Grid
              item
              style={{
                cursor: "pointer",
              }}
              draggable={true}
              onDragStart={event => {



                // event.dataTransfer.setData("text/plain", "ev.target.id");

                this.onDragStart(event, this);
              }}
              onDragEnd={event => this.onDragEnd(event)}
              onClick={event => {
                event.preventDefault();
                event.stopPropagation();

              }}
            >
              <DragIcon
              />
            </Grid>

            <Grid
              item
            >
              <IconButton
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();


                  this.moveBlockUp();
                }}
                className={classes.badgeButton}
              >
                <ArrowUpIcon

                />
              </IconButton>
            </Grid>

            <Grid
              item
            >
              <IconButton
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();


                  this.moveBlockDown();
                }}
                className={classes.badgeButton}
              >
                <ArrowDownIcon

                />
              </IconButton>
            </Grid>

            <Grid
              item
              xs
            >
              {name}
            </Grid>

          </Grid>
        </div>

      }

    }



    /**
     * Для тегов типа img непозволительны дочерние элементы.
     * Если в такие элементы пытаться выводить дочерние,
     * будет возникать ошибка "must neither have `children`"
     */
    let inner = [];

    const childs = this.renderChildren();

    {/* 
      Для блоков с contentEditable (например Tag), если текст отсутствует,
      то фокус уходит в бадж и текст не доступен для редактирования.
      Пока как временный хак скрываем бадж в режиме фокуса.
    */}
    const badgeView = this.renderBadge(badge);

    if (childs) {
      inner.push(childs);
    }


    if (badgeView) {
      inner.push(badgeView);
    }




    // if (!inner.length) {
    //   inner = undefined;
    // }

    return <Fragment>

      <RootElement
        // {...this.getRenderProps()}
        // {...objectProps}
        // {...other}
        // {...props}
        // {...renderProps}
        {...this.prepareRootElementProps({
          ...objectProps,
          ...other,
          ...renderProps,
        })}
      >
        {inner && inner.length ? inner : null}
      </RootElement>

      {settingsView}
    </Fragment>
  }


  renderBadge(badge) {

    if (this.isVoidElement()) {
      return null;
    }

    return badge;
  }


  isVoidElement() {
    return false;
  }


  prepareRootElementProps(props) {

    const {
      classes,
      createTemplate,
      updateTemplate,
      deleteTemplate,
      showRoutes,
      cacheKeyPrefix,
      style: propsStyles,
      errorDelay,
      SaveIcon,
      ResetIcon,
      EditIcon,
      mutate,
      createdAt,
      updatedAt,
      externalKey,
      CreatedBy,
      orderBy,

      // ToDo render bool props as string
      visible,
      staticContext,
      ...other
    } = props;

    let style;

    if (propsStyles) {

      style = {
        ...propsStyles,
      };

      Object.keys(style).map(name => {

        if (style[name] === undefined) {
          delete style[name];
        }

      })

      // if (this.isActive()) {

      // }

    }

    return {
      ...other,
      style,
    };

  }

  getRootElement() {
    return "div";
  }


  renderChildren(components) {

    if (this.isVoidElement()) {
      return null;
    }



    const {
      // mutate,
      // createTemplate,
      // updateTemplate,
      children,
    } = this.props;


    if (children !== undefined) {
      return children;
    }


    const object = this.getObjectWithMutations();




    const {
      // props,
      components: itemComponents,
    } = object;

    components = components || itemComponents;


    let output = [];


    if (itemComponents && itemComponents.length) {

      this.getComponents(itemComponents).map((n, index) => {

        output.push(this.renderComponent(n, index));

      })

    }

    return output;
  }


  getComponents(itemComponents) {

    return itemComponents;
  }


  renderComponent(n, index) {

    const {
      Components,
      TemplateRenderer,
    } = this.getEditorContext();

    const {
      // mutate,
      createTemplate,
      updateTemplate,
      // children,
    } = this.props;

    const {
      id: templateId,
      name,
      component,
      props,
      components,
      ...other
    } = n;


    // if (templateId) {


    // }


    let Component = Components.find(n => n.Name === component);

    if (Component) {





      if (templateId) {




        return <TemplateRenderer
          key={`${templateId}--${index}`}
          Component={Component}
          mode="main"
          parent={this}
          // props={props}
          // data={{
          //   object: n,
          // }}
          // _dirty={n}
          {...other}
          where={{
            id: templateId,
          }}
          mutate={updateTemplate}
          createTemplate={createTemplate}
          updateTemplate={updateTemplate}
        // mutate={async (options) => {



        //   return mutate(options);
        // }}
        />;

      }
      else {

        return <Component
          key={index}
          mode="main"
          // component={n}
          parent={this}
          props={props}
          components={components}
          data={{
            object: n,
          }}
          // _dirty={n}
          mutate={createTemplate}
          createTemplate={createTemplate}
          updateTemplate={updateTemplate}
          {...other}
        />;

      }


    }

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

  getTitle() {

    const {
      name,
      component,
    } = this.getObjectWithMutations();

    return !name && !component ? "" : name === component ? name : `${name} (${component})`;
  }


  // getButtons (){

  //   let buttons = super.getButtons();

  //   const canEdit = this.canEdit();

  //   if(canEdit) {
  //     buttons.push(<IconButton>
  //       <CloneIcon>

  //       </CloneIcon>
  //     </IconButton>);
  //   }

  //   return buttons;
  // }


  // getComponents = () => {

  //   const {
  //     Components,
  //   } = this;

  //   return Components;
  // }

  renderEmpty() {

    return this.renderDefaultView();
  }


  renderEditableView() {

    return this.renderDefaultView();
  }


  renderDefaultView() {

    return this.renderMainView();
  }


  render() {


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

            {/* content = this.renderMainView(); */ }
            content = super.render();

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

}


export default EditorComponent;