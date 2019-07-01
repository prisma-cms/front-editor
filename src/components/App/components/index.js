
/**
 * ToDo
 * 1. Сейчас не оптимально структура компонентов выстроена, из-за чего нарушается 
 * отзывчивость компонентов на изменения. В частности renderHeader() выполняется
 * из активного элемента, а не текущего, и после сохранения объекта не 
 * прекращается индикатор загрузки. Пришлось хакнуть принудительным обновлением через 2 сек.
 */

import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import DeleteIcon from "material-ui-icons/Delete";
import CloseIcon from "material-ui-icons/Close";
import CloneIcon from "material-ui-icons/ContentCopy";
import DragIcon from "material-ui-icons/DragHandle";
import ArrowUpIcon from "material-ui-icons/ArrowUpward";
import ArrowDownIcon from "material-ui-icons/ArrowDownward";
import LinkIcon from "material-ui-icons/Link";
import HelpIcon from "material-ui-icons/HelpOutline";

import FormControlLabel from 'material-ui/Form/FormControlLabel';
import Switch from 'material-ui/Switch';




// ComponentContext = createContext();

import ObjectEditable from "apollo-cms/lib/DataView/Object/Editable";
// import ObjectEditable from './Editable';

import gql from 'graphql-tag';
import { EditorContext } from '../context';

// import SingleUploader from "@prisma-cms/uploader/lib/components/SingleUploader";
import Uploader from "@prisma-cms/uploader";
import Typography from 'material-ui/Typography';

const emptyMutate = async () => { };


class EditorComponent extends ObjectEditable {

  // static id = module.id;

  // static contextType = Context;

  static propTypes = {
    ...ObjectEditable.propTypes,
    mode: PropTypes.oneOf(["main", "panel", "settings", "add_child"]).isRequired,

    /**
     * Родительский инстанс компонента.
     * Нужен для того, чтобы получить доступ к родительским элементам
     */
    parent: PropTypes.object,
    deletable: PropTypes.bool.isRequired,
    data: PropTypes.object,
  };


  static defaultProps = {
    ...ObjectEditable.defaultProps,
    deletable: true,
    mutate: emptyMutate,
    // data: {},
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
      hovered: false,
      active: false,
    }

  }


  /**
   * Пока что имеются коллизии с обновляемыми объектами, взятыми из кеша,
   * так что пока кеш отключаем
   */
  // getCacheKey() {

  //   return null;
  // }


  componentDidMount() {

    const {
      registerMountedComponent,
    } = this.getEditorContext()

    // console.log("componentDidMount registerMountedComponent", registerMountedComponent);

    registerMountedComponent(this);

    super.componentDidMount && super.componentDidMount();

  }


  componentWillUnmount() {

    const {
      activeItem,
      setActiveItem,
    } = this.getEditorContext();

    if (activeItem && activeItem === this) {
      setActiveItem(null);
    }


    const {
      unregisterMountedComponent,
    } = this.getEditorContext()

    // console.log("componentDidMount registerMountedComponent", registerMountedComponent);

    unregisterMountedComponent(this);


    super.componentWillUnmount && super.componentWillUnmount();
  }


  componentDidUpdate(prevProps, prevState) {

    // console.log("Test componentDidUpdate", prevProps);

    // const keys = Object.keys(prevProps);

    // keys.map(key => {

    //   const prev = prevProps[key];
    //   const current = this.props[key];

    //   if (prev !== current) {

    //     console.log("componentDidUpdate this", this);
    //     // console.log("componentDidUpdate prev", key, prev);
    //     // console.log("componentDidUpdate current", key, current);
    //     console.log("componentDidUpdate prev", key, { ...prev });
    //     console.log("componentDidUpdate current", key, { ...current });

    //   }

    // });

    super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState);

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



  /**
   * Обновление данных объекта.
   * Так как компоненты рендерятся на основании передаваемых свойств,
   * надо обновить данные абсолютного родителя, а не просто текущего элемента
   */
  updateObject(data) {

    // console.log("updateObject data", { ...data });

    const object = this.getObjectWithMutations();

    // console.log("updateObject object", { ...object });

    // super.updateObject(data);

    // const {
    //   forceUpdate,
    // } = this.getEditorContext();


    // /**
    //  * Обновляем рутовый компонент, чтобы применить изменения ко всем элементам
    //  */
    // forceUpdate();

    const activeParent = this.getActiveParent();

    // console.log("activeParent", { ...activeParent }, activeParent === this);


    /**
     * Если это текущий компонент, обновляем его
     */
    if (activeParent === this) {
      return super.updateObject(data);
    }
    else {

      /**
       * Иначе находим свои данные в родительском компоненте и обновляем их
       */

      const {
        parent,
      } = this.props;

      const parentData = parent.getObjectWithMutations();

      // console.log("activeParent object", { ...parentData });

      const {
        components,
      } = parentData;

      const current = components.find(n => n === object);

      // console.log("activeParent current", current);

      if (current) {

        const index = components.indexOf(current);

        // console.log("activeParent components", components);

        let newComponents = components.slice(0);

        // console.log("activeParent newComponents", newComponents);

        newComponents[index] = Object.assign({ ...current }, data);

        // console.log("activeParent newComponents 2", newComponents);


        parent.updateObject({
          components: newComponents,
        });

      }
      else {
        console.error("Can not get current element data in parent");
      }

    }

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

      // console.log("onDrop dragItem", dragItem);
      // console.log("onDrop dragTarget", dragTarget);

      /**
       * Здесь надо учитывать добавление или перетаскивание элемента.
       * Если вбрасываемый объект - готовый инстанс, то перемещаем его.
       * Иначе создаем новый.
       */

      if (dragItem instanceof EditorComponent) {

        let {
          parent: dragItemParent,
          index,
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

          const dragItemActiveParent = dragItem.getActiveParent();
          const dragTargetActiveParent = dragTarget.getActiveParent();


          const {
            // components,
            // data: {
            //   object: {
            //     components,
            //   },
            // },
            components,
          } = dragItemParent.getObjectWithMutations();


          if (index === undefined) {

            const object = dragItem.getObject();

            index = components.indexOf(object);
          }


          // console.log("onDrop index", index);

          /**
           * Если компонент найден, то исключаем его из массива
           */
          if (index !== -1) {

            let newComponents = components;

            /**
             * Если абсолютный родители у обоих элементов одни,
             * то нельзя дважды обновить массив компонентов, иначе
             * второй элемент не найдет родителя.
             * По этой причине нам надо менять массив напрямую. 
             * Здесь проблема возникает в том, что при отмене редактирования исключенный элемент 
             * не будет восстановлен, так как редактирование происходит в исходной массиве
             */
            if (dragItemActiveParent !== dragTargetActiveParent) {
              newComponents = newComponents.slice(0);
            }

            const movingComponent = newComponents.splice(index, 1)[0];


            if (dragItemActiveParent !== dragTargetActiveParent) {
              dragItemParent.updateObject({
                components: newComponents,
              });
            }

            this.addComponent(movingComponent);

          }

        }

      }
      else {

        const {
          dragItem,
        } = this.getEditorContext();

        const newItem = this.prepareNewItem(dragItem);


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


  prepareNewItem(item) {


    let {
      component: componentProto,
      ...newItem
    } = item;


    return {
      ...newItem,
      component: componentProto.constructor.Name,
    };

  }


  /**
   * Двигаем блок вверх
   */
  moveBlockUp() {

    const {
      parent,
    } = this.props;

    if (!parent) {

      console.error("Can not get parent");

      return;
    }

    const component = this.getComponentInParent();

    if (component) {

      // let {
      //   // components,
      //   data: {
      //     object: {
      //       components,
      //     },
      //   },
      // } = this.props.parent.props;

      const {
        components,
      } = parent.getObjectWithMutations();

      const index = components.indexOf(component);

      /**
       * Если элемент не на первом месте, двигаем его
       */
      if (index === -1) {
        console.error("Can not find component in parent");
      }
      else if (index > 0) {

        let newComponents = components.slice(0);

        newComponents.splice(index - 1, 0, newComponents.splice(index, 1)[0]);

        parent.updateObject({
          components: newComponents,
        });

        // this.updateParentComponents();

      }

    }

  }

  /**
   * Двигаем блок вниз
   */
  moveBlockDown() {

    const {
      parent,
    } = this.props;

    if (!parent) {

      console.error("Can not get parent");

      return;
    }


    const component = this.getComponentInParent();

    if (component) {

      // let {
      //   // components,
      //   data: {
      //     object: {
      //       components,
      //     },
      //   },
      // } = this.props.parent.props;

      const {
        components,
      } = parent.getObjectWithMutations();

      const index = components.indexOf(component);



      /**
       * Если элемент не на первом месте, двигаем его
       */
      if (index !== -1 && components.length > index + 1) {

        // components.splice(index + 1, 0, components.splice(index, 1)[0]);

        // this.updateParentComponents();


        let newComponents = components.slice(0);

        newComponents.splice(index + 1, 0, newComponents.splice(index, 1)[0]);

        parent.updateObject({
          components: newComponents,
        });

      }

    }

  }


  /**
   * Обновить мы должны текущий элемент или предка
   */

  // addComponent(newItem) {


  //   let {
  //     data: {
  //       object,
  //     },
  //   } = this.props;


  //   let components = object.components || [];

  //   const {
  //     name,
  //     component,
  //   } = newItem;

  //   if (!component) {
  //     Object.assign(newItem, {
  //       component: name,
  //     });
  //   }

  //   if (components) {
  //     components.push(newItem);
  //   }

  //   this.updateParentComponents();

  // }

  addComponent(newItem) {


    // console.log("addComponent newItem", newItem);

    // return;

    // let {
    //   data: {
    //     object,
    //   },
    // } = this.props;


    // let components = object.components || [];

    const {
      components,
    } = this.getObjectWithMutations();

    const {
      name,
      component,
    } = newItem;

    if (!component) {
      Object.assign(newItem, {
        component: name,
      });
    }

    // if (components) {
    //   components.push(newItem);
    // }

    // this.updateParentComponents();

    let newComponents = (components || []).slice(0);

    newComponents.push(newItem);

    this.updateObject({
      components: newComponents,
    });

  }


  /**
   * Перетираем компоненты текущего объекта
   */
  setComponents(components) {


    // let {
    //   data: {
    //     object,
    //   },
    // } = this.props;

    // Object.assign(object, {
    //   components,
    // });

    // this.updateParentComponents();

    this.updateObject({
      components,
    });

  }


  /**
   * Удаление элемента.
   * Если это корневой элемент, удаляем его.
   * Если нет, то удаляем из родительского
   */
  delete() {

    const {
      setActiveItem,
    } = this.getEditorContext();

    // const activeItem = this.getActiveItem();

    const {
      parent,
      delete_component,
      index,
    } = this.props;

    // console.log("delete this", this);
    // console.log("delete parent", parent);

    // const activeParent = activeItem.getActiveParent();

    if (!parent) {

      console.error("Can not get parent");

      return false;
    }



    // console.log("delete index", index);

    if (delete_component) {

      delete_component(index);

      // return;
    }

    else {

      const {
        components,
      } = parent.getObjectWithMutations();

      const object = this.getObjectWithMutations();

      const index = components.indexOf(object);

      if (index === -1) {

        console.error("Can not find component in parent");

        return false;

      }

      let newComponents = components.slice(0);

      newComponents.splice(index, 1);

      parent.updateObject({
        components: newComponents,
      });

    }




    // if (activeItem === activeParent && !activeItem.props.parent) {

    //   this.addError("Can not delete root item");
    //   return;
    // }
    // else {


    //   let {
    //     data: {
    //       object,
    //     },
    //     parent: {
    //       props: {
    //         data: {
    //           object: {
    //             components,
    //           },
    //         },
    //       },
    //     },
    //   } = activeItem.props;


    //   const index = components.indexOf(object);

    //   components.splice(index, 1);


    //   // if (components) {
    //   //   components.push(newItem);
    //   // }

    //   activeItem.props.parent.updateParentComponents();

    // }

    // return;

    setActiveItem(null);

  }


  isDeletable() {

    const {
      deletable,
    } = this.props;


    // const activeItem = this.getActiveItem();

    // if (!activeItem) {
    //   return false;
    // }

    // const activeParent = activeItem.getActiveParent();

    // return deletable && activeItem !== activeParent ? true : false;

    // return deletable && activeItem.props.parent ? true : false;
    return deletable && this.props.parent ? true : false;
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
  //  */
  // updateParentComponents() {

  //   const {
  //     forceUpdate,
  //   } = this.getEditorContext();

  //   const activeParent = this.getActiveParent();



  //   if (!activeParent) {
  //     // throw new Error("Can not get absParent");

  //     console.error("Can not get absParent");

  //     return;
  //   }

  //   activeParent.updateObject({
  //     components: activeParent.props.data.object.components.slice(0),
  //   });


  //   // forceUpdate();

  //   return;

  // }


  /**
   * Проходимся вверх до тех пор, пока не найдем родителя с id
   */
  getActiveParent() {



    const {
      parent,
      // data: {
      //   object,
      // },
    } = this.props;

    const object = this.getObjectWithMutations();

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

  /**
   * При клике по активному элементу в документе,
   * отмечаем его, чтобы можно было редактировать его свойства
   */
  onClick(event) {

    // if (event.target === event.currentTarget) {

    event.preventDefault();
    event.stopPropagation();

    // const {
    //   setActiveItem,
    // } = this.getEditorContext();

    // setActiveItem(this);

    // }

    this.setActiveItem(this);

  }


  setActiveItem = (component) => {

    const {
      setActiveItem,
    } = this.getEditorContext();

    setActiveItem(component);

    // this.setState({
    //   active: true,
    // });

  }


  isActive = () => {

    const {
      active,
    } = this.state;

    return active ? true : false;

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


  // onMouseOver(event) {

  //   if (event.target === event.currentTarget) {

  //     event.preventDefault();
  //     event.stopPropagation();

  //     this.setState({
  //       hovered: true,
  //     });

  //   }

  // }


  onMouseLeave(event) {

    if (event.target === event.currentTarget) {

      event.preventDefault();
      event.stopPropagation();

      const {
        setHoveredItem,
        // hoveredItem,
      } = this.getEditorContext();

      // if (hoveredItem && hoveredItem === this) {

      //   setHoveredItem(null);

      // }

      if (this.isHovered()) {

        setHoveredItem(null);

        // this.setState({
        //   hovered: false,
        // });

      }

    }

  }


  // onMouseLeave(event) {

  //   if (event.target === event.currentTarget) {

  //     event.preventDefault();
  //     event.stopPropagation();

  //     if (this.isHovered()) {

  //       this.setState({
  //         hovered: false,
  //       });

  //     }

  //   }

  // }


  isHovered() {

    const {
      hovered,
    } = this.state;

    return hovered ? true : false;

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


    let {
      className: defaultClassName,
      mode,
      deletable,
      component,
      mutate,
      // data: {
      //   object,
      // },
      object: objectNull,
      data,
      errorDelay,
      SaveIcon,
      ResetIcon,
      EditIcon,
      cacheKeyPrefix,
      // style,
      ...other
    } = this.props;


    const object = this.getObjectWithMutations();

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
        // const isActive = activeItem === this ? true : false;
        const isActive = this.isActive();
        // const isHovered = hoveredItem === this ? true : false;
        const isHovered = this.isHovered();
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


  renderAddButton(content) {

    const {
      Grid,
    } = this.context;

    const {
      classes,
      setActiveItem,
    } = this.getEditorContext();


    const {
      help_url,
    } = this.constructor;

    const {
      className,
      ...other
    } = this.props;



    return <Grid
      item
    >
      <div
        // className={[classes.panelItem, isActive ? "active" : ""].join(" ")}
        className={[
          classes.panelItem,
          className,
        ].join(" ")}
        onClick={event => {

          event.preventDefault();
          event.stopPropagation();

          // alert("dsfsdf");

          // const {}


          // this.addChildOnClick();

          const {
            parent,
          } = this.props;


          if (parent) {




            // if (newItem) {

            //   parent.addComponent(newItem);

            //   // return;

            // }



            const newItem = parent.prepareNewItem(this.prepareDragItem());
            // const newItem = parent.prepareDragItem();
            // const newItem = parent.prepareNewItem(this);

            // console.log("newItem", newItem);




            // const newItem = this.prepareNewItem(dragItem);


            if (newItem) {

              parent.addComponent(newItem);

              // setActiveItem(null);

              // return;

            }

          }




          // if (newItem) {

          //   this.addComponent(newItem);

          //   // return;

          // }

        }}
        {...other}
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


  // addChildOnClick() {

  //   console.log("onClick prepareDragItem", this.prepareDragItem());

  // }



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
          // deletable: this.props.data.object.props && this.props.data.object.props[name] !== undefined ? true : false,
          deletable: this.isDeletable(),
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


              const {
                parent,
              } = this.props;


              if (!parent) {

                console.error("Can not get parent");

                return false;
              }

              const {
                components,
              } = parent.getObjectWithMutations();


              // console.log("Save new template parent components", components);

              const index = components.indexOf(object);

              if (index === -1) {
                console.error("Can not find current component in parent");
              }

              // console.log("Save new template current index", index);


              // return;

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
                      name,
                      component,
                    } = data;

                    const newComponents = components.slice(0);

                    newComponents[index] = {
                      id: newTemplateId,
                      name,
                      component,
                      props: {},
                      components: [],
                    };

                    parent.updateObject({
                      components: newComponents,
                    });

                    // return;

                    // let component = this.getComponentInParent();

                    // Object.assign(component, {
                    //   id: newTemplateId,
                    //   props: {},
                    //   components: [],
                    // });


                    // activeParent.updateParentComponents();

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

              // console.log("Удалить элемент this", { ...this });

              this.delete();

              // const activeItem = this.getActiveItem();

              // if (activeItem) {
              //   this.delete(activeItem);
              // }

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

    // console.log("updateComponentProperty name", name);
    // console.log("updateComponentProperty value", value);
    // console.log("updateComponentProperty style", style);

    // const {
    //   props,
    // } = this.getObjectWithMutations();

    // this.updateObject({
    //   props: {
    //     ...props,
    //     [name]: value,
    //   },
    // });

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


  /**
   * Обновления свойств объекта.
   * Здесь важно понимать когда свойства текущего объекта надо изменить (если корневой или с id),
   * а когда родительский (с плавающей вложенностью)
   */
  updateComponentProps(data) {

    // const activeItem = this.getActiveItem();

    // return this.updateActiveComponentProps(this, data);


    let {
      props: {
        ...props
      },
    } = this.getObjectWithMutations();


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


    this.updateObject({
      props,
    });

  }


  /**
   * Временный хак. 
   * Я не предусмотрел обновление произвольного компонента (а это надо),
   * поэтому перенес функционал в этот отдельный метод.
   * В дальнейшем надо будет все переосмыслить
   */
  updateActiveComponentProps__(activeItem, data) {

    /**
     * this - Дополнительный объект в панели управления
     * getActiveItem - Элемент из основной части редактора.
     */



    if (activeItem !== this) {

      console.error("activeItem !== this");

      return null;
    }

    // console.log("updateActiveComponentProps data", data);

    const {
      props,
    } = this.getObjectWithMutations();


    // if (data) {

    //   const keys = Object.keys(data);

    //   keys.map(name => {

    //     const value = data[name];

    //     if (value === undefined) {
    //       delete props[name];
    //     }
    //     else {
    //       props[name] = value;
    //     }

    //   });

    // }


    this.updateObject({
      props: {
        ...props,
        ...data,
      },
    });

    return;

    const activeParent = activeItem.getActiveParent();

    // let props = activeItem.props.props || {};
    let props__ = { ...activeItem.props.props } || {};


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

        // activeParent.updateParentComponents();

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
      // data: {
      //   object,
      // },
      parent,
    } = this.props;


    // let {
    //   components,
    // } = activeItem.props.parent.props;

    if (!parent) {
      console.error("Can not get parent");
      return;
    }


    const object = this.getObjectWithMutations();


    // let {
    //   // components,
    //   data: {
    //     object: {
    //       components,
    //     },
    //   },
    // } = this.props.parent.props;

    const {
      components,
    } = parent.getObjectWithMutations();


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

  updateComponent__(data) {

    const activeItem = this.getActiveItem();

    activeItem.updateObject(data);

  }


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


  renderMainView__(renderProps) {

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
      // settingsViewContainer,
      getSettingsViewContainer,
      inEditMode,
      classes,
      onDragStart,
      Components,
    } = this.getEditorContext();

    const settingsViewContainer = getSettingsViewContainer();

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


    /**
     * Для тегов типа img непозволительны дочерние элементы.
     * Если в такие элементы пытаться выводить дочерние,
     * будет возникать ошибка "must neither have `children`"
     */
    let inner = [];


    const childs = this.renderChildren();

    if (childs) {
      inner.push(childs);
    }


    if (inEditMode) {

      const isActive = activeItem === this ? true : false;
      const isDragOvered = dragTarget === this ? true : false;
      const isHovered = hoveredItem === this ? true : false;
      const deletable = this.isDeletable();


      if (isActive && settingsViewContainer) {

        /**
         * Важно по наследованию событий в порталы
         * https://github.com/facebook/react/issues/11387
         */
        settingsView = ReactDOM.createPortal(this.renderSettingsView(), settingsViewContainer);



      }

      if (isActive || isDragOvered || isHovered) {

        badge = <div
          key="badge"
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
              xs
            >
              {this.renderBadgeTitle(component)}
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

            {deletable && activeItem && activeItem === this ?
              <Grid
                item
              >
                <IconButton
                  title="Удалить элемент"
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();

                    this.delete();
                  }}
                  className={classes.badgeButton}
                >
                  <DeleteIcon

                  />
                </IconButton>
              </Grid>
              : null
            }

            <Grid
              item
              style={{
                cursor: "pointer",
              }}
              draggable={true}
              onDragStart={event => {

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

          </Grid>
        </div>

      }

      {/* 
                Для блоков с contentEditable (например Tag), если текст отсутствует,
                то фокус уходит в бадж и текст не доступен для редактирования.
                Пока как временный хак скрываем бадж в режиме фокуса.
              */}
      const badgeView = this.renderBadge(badge);


      if (badgeView) {
        inner.push(badgeView);
      }


      if (isActive && !this.isVoidElement()) {

        let addBlocks;

        // console.log("Components", Components);

        // const components = Components.filter(n => n.canBeParent(this));

        // console.log("components", components);

        addBlocks = this.renderAddButtons(<Grid
          key="add_buttons"
          container
          spacing={8}
        >

          {Components.map((Component, index) => {

            const name = Component.Name;

            return <Component
              key={`${name}-${index}`}
              mode="add_child"
              className={"add_child"}
              parent={this}
            />
          })}

        </Grid>);

        if (addBlocks) {
          // inner.push(addBlocks);

          inner.push(this.renderActionPanel(addBlocks));

        }


      }

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


  renderMainView(renderProps = {}) {

    const {
      Grid,
    } = this.context;

    const object = this.getObjectWithMutations();

    // console.log("renderMainView object", this, object);

    if (!object) {
      return null;
    }


    const {
      props: {
        style: objectStyle,
        ...objectProps
      },
      components,
      component,
      ...other
    } = object;



    const {
      // activeItem,
      dragTarget,
      hoveredItem,
      // settingsViewContainer,
      getSettingsViewContainer,
      inEditMode,
      classes,
      onDragStart,
      Components,
    } = this.getEditorContext();

    const settingsViewContainer = getSettingsViewContainer();


    const RootElement = this.getRootElement();

    let settingsView;

    /**
     * Заголовок блока, чтобы можно было перетаскивать и т.п.
     */
    let badge;


    /**
     * Для тегов типа img непозволительны дочерние элементы.
     * Если в такие элементы пытаться выводить дочерние,
     * будет возникать ошибка "must neither have `children`"
     */
    let inner = [];


    const childs = this.renderChildren();

    // console.log("childs", childs);

    if (childs) {
      inner.push(childs);
    }


    if (inEditMode) {

      // const isActive = activeItem === this ? true : false;
      const isActive = this.isActive();
      const isDragOvered = dragTarget === this ? true : false;
      // const isHovered = hoveredItem === this ? true : false;
      const isHovered = this.isHovered();
      const deletable = this.isDeletable();


      if (isActive && settingsViewContainer) {

        /**
         * Важно по наследованию событий в порталы
         * https://github.com/facebook/react/issues/11387
         */
        settingsView = ReactDOM.createPortal(this.renderSettingsView(), settingsViewContainer);



      }

      if (isActive || isDragOvered || isHovered) {

        badge = <div
          key="badge"
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
              xs
            >
              {this.renderBadgeTitle(component)}
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

            {/* {deletable && activeItem && activeItem === this ? */}
            {deletable && isActive ?
              <Grid
                item
              >
                <IconButton
                  title="Удалить элемент"
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();

                    this.delete();
                  }}
                  className={classes.badgeButton}
                >
                  <DeleteIcon

                  />
                </IconButton>
              </Grid>
              : null
            }

            <Grid
              item
              style={{
                cursor: "pointer",
              }}
              draggable={true}
              onDragStart={event => {

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

          </Grid>
        </div>

      }

      {/* 
                Для блоков с contentEditable (например Tag), если текст отсутствует,
                то фокус уходит в бадж и текст не доступен для редактирования.
                Пока как временный хак скрываем бадж в режиме фокуса.
              */}
      const badgeView = this.renderBadge(badge);


      if (badgeView) {
        inner.push(badgeView);
      }


      if (isActive && !this.isVoidElement()) {

        let addBlocks;

        // console.log("Components", Components);

        // const components = Components.filter(n => n.canBeParent(this));

        // console.log("components", components);

        addBlocks = this.renderAddButtons(<Grid
          key="add_buttons"
          container
          spacing={8}
        >

          {Components.map((Component, index) => {

            const name = Component.Name;

            return <Component
              key={`${name}-${index}`}
              mode="add_child"
              className={"add_child"}
              parent={this}
            />
          })}

        </Grid>);

        if (addBlocks) {
          // inner.push(addBlocks);

          inner.push(this.renderActionPanel(addBlocks));

        }


      }

    }





    // if (!inner.length) {
    //   inner = undefined;
    // }

    const {
      style: renderStyles,
    } = renderProps || {};

    const {
      style: otherRenderStyles,
      ...otherRenderProps
    } = this.getRenderProps();

    return <Fragment>

      <RootElement
        // {...objectProps}
        // {...other}
        // {...props}
        // {...renderProps}
        {...this.prepareRootElementProps({
          ...renderProps,
          ...otherRenderProps,
          ...objectProps,
          style: {
            ...renderStyles,
            ...otherRenderStyles,
            ...objectStyle,
          },
          // props,
          components,
          ...other,
          ...renderProps,
        })}
      >
        {inner && inner.length ? inner : null}
      </RootElement>

      {settingsView}
    </Fragment>
  }


  renderBadgeTitle(title) {

    return title;
  }


  renderBadge(badge) {

    if (this.isVoidElement()) {
      return null;
    }

    return badge;
  }


  renderAddButtons(content) {

    return content;
  }


  renderActionPanel(content) {

    const {
      // actionPanel,
      getActionPanel,
    } = this.getEditorContext();

    const actionPanel = getActionPanel();

    // console.log("renderActionPanel actionPanel", actionPanel);
    // console.log("renderActionPanel content", content);
    // console.log("renderActionPanel context", { ...this.getEditorContext() });

    if (actionPanel) {
      return ReactDOM.createPortal(content, actionPanel);
      // return ReactDOM.createPortal(<div>dfsdfsdf</div>, actionPanel);
    }
    else {
      return content;
    }

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


  renderChildren() {

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


    // console.log("object", { ...object });

    const {
      // props,
      components: itemComponents,
    } = object;

    // components = components || itemComponents;


    let output = [];


    // if (itemComponents && itemComponents.length) {
    if (itemComponents) {

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
      inEditMode,
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

    // console.log("renderComponent n", { ...n });


    let Component = Components.find(n => n.Name === component);

    if (Component) {





      if (templateId) {


        // console.log("TemplateRenderer", TemplateRenderer);

        // return null;

        return <TemplateRenderer
          key={`${templateId}--${index}`}
          Component={Component}
          mode="main"
          parent={this}
          {...other}
          where={{
            id: templateId,
          }}
          mutate={updateTemplate}
          createTemplate={createTemplate}
          updateTemplate={updateTemplate}
          index={index}
          delete_component={this.deleteComponentByIndex}
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
          // data={{
          //   object: n,
          // }}
          object={n}
          // _dirty={n}
          mutate={createTemplate}
          createTemplate={createTemplate}
          updateTemplate={updateTemplate}
          {...other}
        />;

      }


    }
    else {

      if (inEditMode) {
        return <Typography
          // size="small"
          // variant="raised"
          color="error"
        >
          Missed component {component}
        </Typography>
      }

    }

  }


  deleteComponentByIndex = index => {

    // console.log("delete", { ...n });

    const {
      components,
    } = this.getObjectWithMutations();

    // const index = components.indexOf(n);


    // console.log("delete index", index);

    if (index === -1) {

      // console.error("Can not find component");

      return;
    }
    else {

      let newComponents = components.slice(0);

      newComponents.splice(index, 1);

      this.updateObject({
        components: newComponents,
      });

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


        {/* console.log("render this", this);

        console.log("render this object", this.getObjectWithMutations()); */}



        switch (mode) {

          case "main":

            {/* content = this.renderMainView(); */ }
            content = super.render();

            break;

          case "panel":
            {
              const activeItem = this.getActiveItem();
              {/* 
            if (!activeItem || (activeItem && activeItem.canBeChild(this)) || this.isActive()) {
              content = this.renderPanelView();
            } */}

              if (!activeItem || (activeItem && activeItem instanceof this.constructor)) {
                content = this.renderPanelView();
              }
            }
            break;

          case "add_child":


            {

              {/* const activeItem = this.getActiveItem(); */ }

              const {
                parent: activeItem,
              } = this.props;

              if (activeItem && this.canBeParent(activeItem)) {
                content = this.renderAddButton();
              }

            }

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