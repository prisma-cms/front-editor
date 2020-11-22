/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-lone-blocks */

/**
 * ToDo
 * 1. Сейчас не оптимально структура компонентов выстроена, из-за чего нарушается 
 * отзывчивость компонентов на изменения. В частности renderHeader() выполняется
 * из активного элемента, а не текущего, и после сохранения объекта не 
 * прекращается индикатор загрузки. Пришлось хакнуть принудительным обновлением через 2 сек.
 * 
 * 2. Вынести методы в контекст.
      createTemplate,
      updateTemplate,
      deleteTemplate,
 */

import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
// import PropTypes from 'prop-types'

import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'

import DeleteIcon from 'material-ui-icons/Delete'
import CloseIcon from 'material-ui-icons/Close'
import CloneIcon from 'material-ui-icons/ContentCopy'
import DragIcon from 'material-ui-icons/DragHandle'
import ArrowUpIcon from 'material-ui-icons/ArrowUpward'
import ArrowDownIcon from 'material-ui-icons/ArrowDownward'
import LinkIcon from 'material-ui-icons/Link'
import HelpIcon from 'material-ui-icons/HelpOutline'

import FormControlLabel from 'material-ui/Form/FormControlLabel'
import Switch from 'material-ui/Switch'

// ComponentContext = createContext();

import { EditableObject } from 'apollo-cms'

// import gql from 'graphql-tag'
import { EditorContext, EditorContextValue } from '../context'

import Context, { PrismaCmsContext } from '@prisma-cms/context'

// import SingleUploader from "@prisma-cms/uploader/lib/components/SingleUploader";
import Uploader from '@prisma-cms/uploader'
import Typography from 'material-ui/Typography'
import {
  EditorComponentObject,
  EditorComponentProps,
  EditorComponentState,
  EditorComponentInterface,
} from './interfaces'
import Grid from '../../../common/Grid'
import Link from '../../../common/Link'

export * from './interfaces'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyMutate = async () => {}

abstract class EditorComponent<
    P extends EditorComponentProps = EditorComponentProps,
    S extends EditorComponentState = EditorComponentState
  >
  extends EditableObject<P, S>
  implements EditorComponentInterface {
  // static id = module.id;

  context!: PrismaCmsContext

  static Name = 'EditorComponent'

  static contextType = Context

  static saveable = true

  static help_url = ''

  static defaultProps = {
    ...EditableObject.defaultProps,
    deletable: true,
    mutate: emptyMutate,
    data: {},
    object: {
      props: {},
      components: [],
    },
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
    page_title: undefined,
    contentEditable: false,
    className: undefined,
    lang: undefined,
    tag: undefined,
    hide_wrapper_in_default_mode: false,
    render_badge: true,
    can_be_edited: true,
  }

  public component: EditorComponent | undefined

  constructor(props: P) {
    super(props)

    const { maxStructureLengthView = 3000 } = props

    this.updateComponentProperty = this.updateComponentProperty.bind(this)
    this.updateObject = this.updateObject.bind(this)
    this.onChangeProps = this.onChangeProps.bind(this)
    this.updateProps = this.updateProps.bind(this)
    this.getActiveParent = this.getActiveParent.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.save = this.save.bind(this)
    this.moveBlockUp = this.moveBlockUp.bind(this)
    this.moveBlockDown = this.moveBlockDown.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onMouseOver = this.onMouseOver.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)

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

  // TODO: check types
  // container: Element | Text | null = null;
  container: EditorComponent | null = null
  reactComponent: EditorComponent | null = null

  componentDidMount() {
    const { registerMountedComponent } = this.getEditorContext()

    if (!this.container) {
      // eslint-disable-next-line react/no-find-dom-node
      const container = ReactDOM.findDOMNode(this)

      if (container instanceof EditorComponent) {
        this.container = container
      }
    }

    // TODO check instanceof extended components
    // if (this.container && this.container instanceof EditorComponent) {
    if (this.container) {
      this.container.reactComponent = this
    }

    registerMountedComponent && registerMountedComponent(this)

    const { mode } = this.props

    if (mode === 'main') {
      this.addEventListeners()
    }

    super.componentDidMount && super.componentDidMount()
  }

  addEventListeners() {
    return
  }

  componentWillUnmount() {
    const { activeItem, setActiveItem } = this.getEditorContext()

    if (activeItem && activeItem === this) {
      setActiveItem && setActiveItem(null)
    }

    const { unregisterMountedComponent } = this.getEditorContext()

    unregisterMountedComponent && unregisterMountedComponent(this)

    super.componentWillUnmount && super.componentWillUnmount()
  }

  // componentDidUpdate(prevProps, prevState) {
  //   super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState)
  // }

  /**
   * @deprecated
   */
  processMeta(_meta = {}) {
    // const { inEditMode, setPageMeta } = this.getEditorContext()
    // const { page_title, page_status } = this.getComponentProps(this)
    // if (!inEditMode && this.inMainMode()) {
    //   if (page_title) {
    //     meta = {
    //       ...meta,
    //       title: page_title,
    //     }
    //   }
    //   if (page_status) {
    //     meta = {
    //       ...meta,
    //       status: page_status,
    //     }
    //   }
    //   meta && setPageMeta(meta)
    // }
  }

  /**
   * Редактировать можно в следующих случаях:
   * 1. Если нет родителя и нет id
   * 2. Если есть ID и пользователь является владельцем
   */
  // canEdit__() {
  //   const { id: objectId, CreatedBy } = this.getObjectWithMutations()

  //   const { parent } = this.props

  //   const { id: currentUserId, sudo } = this.getCurrentUser() || {}

  //   const { id: createdById } = CreatedBy || {}

  //   if (objectId) {
  //     // return true;

  //     if ((createdById && createdById === currentUserId) || sudo) {
  //       return true
  //     }
  //   } else {
  //     if (!parent) {
  //       return true
  //     }
  //   }

  //   return false
  // }

  /**
   * Обновление данных объекта.
   * Так как компоненты рендерятся на основании передаваемых свойств,
   * надо обновить данные абсолютного родителя, а не просто текущего элемента
   */
  updateObject(data: Partial<EditorComponentObject>) {
    const object = this.getObjectWithMutations()

    const activeParent = this.getActiveParent()

    /**
     * Если это текущий компонент, обновляем его
     */
    if (activeParent === this) {
      return super.updateObject(data)
    } else {
      /**
       * Иначе находим свои данные в родительском компоненте и обновляем их
       */

      const { parent } = this.props

      if (!parent) {
        console.error('Can not get parent')
        return
      }

      const parentData = parent?.getObjectWithMutations()

      const components = parentData?.components

      const current = components?.find((n) => n === object)

      if (current && components) {
        const index = components.indexOf(current)

        const newComponents = components.slice(0)

        newComponents[index] = Object.assign({ ...current }, data)

        parent.updateObject({
          components: newComponents,
        })
      } else {
        console.error('Can not get current element data in parent')
      }
    }
  }

  // onDragStart = (event: React.DragEvent, item: EditorComponent | null) => {

  onDragStart = (event: React.DragEvent) => {
    const { onDragStart } = this.getEditorContext()

    onDragStart && onDragStart(event, this.prepareDragItem())
  }

  /**
   * Создаем новый элемент, который будет добавлен в схему при перетаскивании
   */
  prepareDragItem(): EditorComponentObject {
    return {
      component: this,
      name: (this.constructor as typeof EditorComponent).Name,
      props: this.prepareDragItemProps(),
      components: this.prepareDragItemComponents(),
    }
  }

  prepareDragItemProps() {
    return {}
  }

  prepareDragItemComponents() {
    return []
  }

  onDragEnd = () => {
    const { onDragEnd } = this.getEditorContext()

    onDragEnd && onDragEnd()
  }

  onDrop(event: React.DragEvent) {
    const {
      dragItem,
      dragTarget,
      // setActiveItem,
      onDragEnd,
    } = this.getEditorContext()

    if (dragItem && dragTarget && dragTarget === this) {
      event.preventDefault()
      event.stopPropagation()

      /**
       * Здесь надо учитывать добавление или перетаскивание элемента.
       * Если вбрасываемый объект - готовый инстанс, то перемещаем его.
       * Иначе создаем новый.
       */

      // TODO Restore block logic
      if (dragItem instanceof EditorComponent) {
        // let { parent: dragItemParent, index } = dragItem.props
        // /**
        //  * Нельзя переносить элементы, у которых нет родителя
        //  */
        // if (!dragItemParent) {
        //   // return false;
        // } else if (dragItemParent === this) {
        //   /**
        //    * Нет смысла закидывать в себя же
        //    */
        //   // return false;
        // } else {
        //   /**
        //    * Если все ОК, переносим элемент в другой блок.
        //    * Для этого надо найти переносимый элемент в родительском массиве элементов и перенести в новый.
        //    */
        //   const dragItemActiveParent = dragItem.getActiveParent()
        //   const dragTargetActiveParent = dragTarget.getActiveParent()
        //   const {
        //     // components,
        //     // data: {
        //     //   object: {
        //     //     components,
        //     //   },
        //     // },
        //     components,
        //   } = dragItemParent.getObjectWithMutations()
        //   if (index === undefined) {
        //     const object = dragItem.getObject()
        //     index = components.indexOf(object)
        //   }
        //   /**
        //    * Если компонент найден, то исключаем его из массива
        //    */
        //   if (index !== -1) {
        //     let newComponents = components
        //     /**
        //      * Если абсолютный родители у обоих элементов одни,
        //      * то нельзя дважды обновить массив компонентов, иначе
        //      * второй элемент не найдет родителя.
        //      * По этой причине нам надо менять массив напрямую.
        //      * Здесь проблема возникает в том, что при отмене редактирования исключенный элемент
        //      * не будет восстановлен, так как редактирование происходит в исходной массиве
        //      */
        //     if (dragItemActiveParent !== dragTargetActiveParent) {
        //       newComponents = newComponents.slice(0)
        //     }
        //     const movingComponent = newComponents.splice(index, 1)[0]
        //     if (dragItemActiveParent !== dragTargetActiveParent) {
        //       dragItemParent.updateObject({
        //         components: newComponents,
        //       })
        //     }
        //     this.addComponent(movingComponent)
        //   }
        // }
      } else {
        const { dragItem } = this.getEditorContext()

        const newItem = this.prepareNewItem(dragItem)

        if (newItem) {
          this.addComponent(newItem)

          // return;
        }
      }

      // setActiveItem(null);
      onDragEnd && onDragEnd()

      return true
    }
  }

  prepareNewItem(item: EditorContextValue['dragItem']) {
    if (!item) {
      return
    }

    // TODO: Check logic
    if (item instanceof EditorComponent) {
      return
    }

    const { component: componentProto, ...newItem } = item

    /**
     * Return only typeof P["object"]
     */
    return {
      ...newItem,
      component: (componentProto.constructor as typeof EditorComponent).Name,
    }
  }

  /**
   * Двигаем блок вверх
   */
  moveBlockUp(event?: React.MouseEvent) {
    event?.preventDefault()
    event?.stopPropagation()

    const { parent } = this.props

    if (!parent) {
      console.error('Can not get parent')

      return
    }

    const component = this.getComponentInParent()

    if (component) {
      // let {
      //   // components,
      //   data: {
      //     object: {
      //       components,
      //     },
      //   },
      // } = this.props.parent.props;

      const components = parent.getObjectWithMutations()?.components

      if (!components) {
        console.error('Can not get components')
        return
      }

      const index = components.indexOf(component)

      /**
       * Если элемент не на первом месте, двигаем его
       */
      if (index === -1) {
        console.error('Can not find component in parent')
      } else if (index > 0) {
        const newComponents = components.slice(0)

        newComponents.splice(index - 1, 0, newComponents.splice(index, 1)[0])

        parent.updateObject({
          components: newComponents,
        })

        // this.updateParentComponents();
      }
    }
  }

  /**
   * Двигаем блок вниз
   */
  moveBlockDown(event?: React.MouseEvent) {
    event?.preventDefault()
    event?.stopPropagation()

    const { parent } = this.props

    if (!parent) {
      console.error('Can not get parent')

      return
    }

    const component = this.getComponentInParent()

    if (component) {
      // let {
      //   // components,
      //   data: {
      //     object: {
      //       components,
      //     },
      //   },
      // } = this.props.parent.props;

      const components = parent?.getObjectWithMutations()?.components

      const index = components ? components.indexOf(component) : -1

      /**
       * Если элемент не на первом месте, двигаем его
       */
      if (components && index !== -1 && components.length > index + 1) {
        // components.splice(index + 1, 0, components.splice(index, 1)[0]);

        // this.updateParentComponents();

        const newComponents = components.slice(0)

        newComponents.splice(index + 1, 0, newComponents.splice(index, 1)[0])

        parent.updateObject({
          components: newComponents,
        })
      }
    }
  }

  /**
   * Обновить мы должны текущий элемент или предка
   */

  addComponent(newItem: P['object']) {
    const components = this.getObjectWithMutations()?.components

    const { name, component } = newItem

    if (!component) {
      Object.assign(newItem, {
        component: name,
      })
    }

    const newComponents = (components || []).slice(0)

    newComponents.push(newItem)

    this.updateObject({
      components: newComponents,
    })
  }

  /**
   * Перетираем компоненты текущего объекта
   */
  setComponents(components: P['object']['components']) {
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
    })
  }

  /**
   * Удаление элемента.
   * Если это корневой элемент, удаляем его.
   * Если нет, то удаляем из родительского
   */
  // TODO Fix delete from list
  delete = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    const { setActiveItem } = this.getEditorContext()

    // const activeItem = this.getActiveItem();

    const { parent, delete_component, index } = this.props

    if (!parent) {
      console.error('Can not get parent')

      return false
    }

    if (delete_component) {
      delete_component(index)

      // return;
    } else {
      const parentObject = parent.getObjectWithMutations()

      if (parentObject) {
        const { components } = parentObject

        const object = this.getObjectWithMutations()

        const index = object ? components.indexOf(object) : -1

        if (index === -1) {
          console.error('Can not find component in parent')

          return false
        }

        const newComponents = components.slice(0)

        newComponents.splice(index, 1)

        parent.updateObject({
          components: newComponents,
        })
      }
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

    setActiveItem && setActiveItem(null)
  }

  isDeletable() {
    const { deletable } = this.props

    // const activeItem = this.getActiveItem();

    // if (!activeItem) {
    //   return false;
    // }

    // const activeParent = activeItem.getActiveParent();

    // return deletable && activeItem !== activeParent ? true : false;

    // return deletable && activeItem.props.parent ? true : false;
    return deletable && this.props.parent ? true : false
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
  getActiveParent(): EditorComponent {
    const {
      parent,
      // data: {
      //   object,
      // },
    } = this.props

    const object = this.getObjectWithMutations()

    if (object && object.id) {
      return this
    } else if (parent) {
      return parent.getActiveParent()
    } else {
      return this
    }
  }

  /**
   * При клике по активному элементу в документе,
   * отмечаем его, чтобы можно было редактировать его свойства
   */
  onClick(event: React.MouseEvent) {
    // if (event.target === event.currentTarget) {

    event.preventDefault()
    event.stopPropagation()

    // const {
    //   setActiveItem,
    // } = this.getEditorContext();

    // setActiveItem(this);

    // }

    this.setActiveItem(this)
  }

  setActiveItem = (component: EditorContextValue['activeItem']) => {
    const { setActiveItem } = this.getEditorContext()

    setActiveItem && setActiveItem(component)
  }

  inMainMode = () => {
    const { mode } = this.props

    return mode === 'main'
  }

  onMouseOver(event: React.MouseEvent) {
    if (event.target === event.currentTarget) {
      event.preventDefault()
      event.stopPropagation()

      const { setHoveredItem } = this.getEditorContext()

      setHoveredItem && setHoveredItem(this)
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

  onMouseLeave(event: React.MouseEvent) {
    if (event.target === event.currentTarget) {
      event.preventDefault()
      event.stopPropagation()

      const {
        setHoveredItem,
        // hoveredItem,
      } = this.getEditorContext()

      // if (hoveredItem && hoveredItem === this) {

      //   setHoveredItem(null);

      // }

      if (this.isHovered()) {
        setHoveredItem && setHoveredItem(null)

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
    return this.state.hovered
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

  onDragEnter(event: React.DragEvent) {
    const { setDragTarget, dragItem } = this.getEditorContext()

    if (dragItem && this.canBeDropped(dragItem)) {
      event.preventDefault()
      event.stopPropagation()

      setDragTarget && setDragTarget(this)

      return true
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

  canBeDropped(child: EditorContextValue['dragItem']): boolean {
    if (!child || child === this) {
      return false
    }

    let item

    /**
     * Если это перетаскивается готовый элемент на странице, проверяем, чтобы это не был родитель
     */
    if (child instanceof EditorComponent) {
      item = child

      const { parent: dragItemParent } = child.props

      /**
       * Если у перетаскиваемого элемента нет родителя, то нельзя вкидывать
       */
      if (!dragItemParent) {
        return false
      }

      let Parent = this.props.parent

      while (Parent && (Parent = Parent.props.parent)) {
        if (Parent === dragItemParent) {
          return false
        }

        // Parent = Parent.props.parent;
      }

      // return false;
    } else {
      /**
       * Иначе это новый компонент, перетаскиваемый из панели компонентов
       */
      if (child && child.component) {
        item = child.component
      }
    }

    if (item && item instanceof EditorComponent) {
      return item.canBeParent(this)
    }

    return false
  }

  /**
   * В новом компоненте проверяет может ли компонент на странице стать родительским для него.
   */
  canBeParent(parent: P['parent']): boolean {
    /**
     * Может, если этот компонент может быть дочерним для целевого.
     */

    return parent?.canBeChild(this) ?? false
  }

  /**
   * В родительском компоненте проверяет может ли новый компонент стать дочерним.
   */
  canBeChild(child: EditorComponent): boolean {
    return child ? true : false
  }

  /**
   * Note: If using in canBeParent, should pass parent instead this
   */
  findInParent(
    parent: EditorComponent,
    condition: (parent: EditorComponent) => EditorComponent | null
  ): EditorComponent | null {
    if (!parent) {
      return null
    }

    if (condition(parent)) {
      return parent
    }

    // else
    return parent.props.parent
      ? this.findInParent(parent.props.parent, condition)
      : null
  }

  /**
   * Поиск реакт-объекта в дочерних
   * this.findReactChild(editableObject._reactInternalFiber.child, stateNode => stateNode instanceof Editable);
   */
  // findReactChild(child: EditorComponent, condition: (child: EditorComponent) => EditorComponent | null) : EditorComponent | null {
  //   if (!child) {
  //     return null
  //   }

  //   if (condition(child.stateNode)) {
  //     return child.stateNode
  //   }

  //   // else
  //   return this.findReactChild(child.child, condition)
  // }

  onDragOver(event: React.DragEvent) {
    const { dragTarget } = this.getEditorContext()

    if (dragTarget === this) {
      event.preventDefault()
      event.stopPropagation()

      return true
    }
  }

  getComponentProps(component: EditorComponent): P['object']['props'] {
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
    } = component.props

    // const {
    //   // name,
    //   // components,
    //   props: objectProps,
    // } = component.getObjectWithMutations()

    const { style, ...componentProps } =
      component.getObjectWithMutations()?.props || {}

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
    }

    // return props || {};
  }

  getRenderProps(componentProps = {}): any {
    const {
      // inEditMode,
      classes,
    } = this.getEditorContext()

    const inEditMode = this.inEditorMode()

    const {
      className: defaultClassName,
      mode,
      deletable,
      component,
      mutate,
      // data,
      // data: {
      //   object,
      // },
      object: objectNull,
      errorDelay,
      SaveIcon,
      ResetIcon,
      EditIcon,
      cacheKeyPrefix,
      hide_wrapper_in_default_mode,
      // style,
      ...other
    } = this.props

    const object = this.getObjectWithMutations()

    // const {
    //   props: { className, ...objectProps },
    // } = object

    const { className, ...objectProps } = object?.props ?? {}

    let classNames = [
      defaultClassName,
      className,
      // propsClassName,
    ]

    Object.assign(componentProps, {
      // ...component,
      ...other,
      ...object,
      ...objectProps,
      // ...otherProps,
      ...this.getComponentProps(this),
    })

    if (inEditMode) {
      const {
        dragItem,
        dragTarget,
        // activeItem,
        // hoveredItem,
      } = this.getEditorContext()

      // if (dragItem && (dragItem.component && !dragItem.component.canBeParent(this))) {

      // }

      const isRoot = this.isRoot()

      classNames = classNames.concat([
        classes?.item,
        inEditMode ? classes?.itemEditable : '',
        isRoot ? 'root' : '',
      ])

      /**
       * Если есть перетаскиваемый элемент, проверяем, может ли компонент стать родительским для него.
       * Если нет, то убираем бордеры и события.
       */
      if (
        dragItem &&
        dragItem instanceof EditorComponent &&
        dragItem.component &&
        !dragItem.component.canBeParent(this)
      ) {
        classNames = classNames.concat(['disabled'])
      } else {
        // if (!dragItem || (!dragItem.component || dragItem.component.canBeParent(this))) {
        const isDragOvered = dragTarget === this ? true : false
        // const isActive = activeItem === this ? true : false;
        const isActive = this.isActive()
        // const isHovered = hoveredItem === this ? true : false;
        const isHovered = this.isHovered()
        const isDirty = this.isDirty()

        classNames = classNames.concat([
          isDragOvered ? 'dragOvered' : '',
          isActive ? 'active' : '',
          isHovered ? 'hovered' : '',
          isDirty ? 'dirty' : '',
        ])

        Object.assign(componentProps, {
          onDrop: this.onDrop,
          onDragEnter: this.onDragEnter,
          onDragOver: this.onDragOver,
          onClick: this.onClick,
          onMouseOver: this.onMouseOver,
          onMouseLeave: this.onMouseLeave,
        })
      }
    }

    Object.assign(componentProps, {
      className: classNames.filter((n) => n).join(' '),
    })

    return componentProps
  }

  renderPanelView(content?: React.ReactNode): React.ReactNode {
    const { classes, hoveredItem, dragTarget } = this.getEditorContext()

    const isActive = this.isActive()

    const isHovered =
      hoveredItem instanceof this.constructor && !isActive ? true : false

    const isDragOvered =
      dragTarget && dragTarget instanceof this.constructor ? true : false

    const { help_url } = this.constructor as typeof EditorComponent

    return (
      <Grid
        item
        // className={[classes?.panelItem, isActive ? "active" : ""].join(" ")}
        className={[
          classes?.panelItem,
          isHovered ? 'hovered' : '',
          isDragOvered ? 'dragOvered' : '',
        ].join(' ')}
        draggable
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        {content || (this.constructor as typeof EditorComponent).Name}{' '}
        {help_url ? (
          <a
            href={help_url}
            target="_blank"
            rel="noopener noreferrer"
            className={classes?.helpLink}
          >
            <HelpIcon />
          </a>
        ) : null}
      </Grid>
    )
  }

  onAddButtonClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const { parent } = this.props

    if (parent) {
      const newItem = parent.prepareNewItem(this.prepareDragItem())

      if (newItem) {
        parent.addComponent(newItem)
      }
    }
  }

  renderAddButton(content?: React.ReactNode): React.ReactNode {
    const {
      classes,
      // setActiveItem,
    } = this.getEditorContext()

    const help_url = (this.constructor as typeof EditorComponent).help_url

    const {
      className,
      style,
      // ...other
    } = this.props

    return (
      <Grid item>
        <div
          // className={[classes?.panelItem, isActive ? "active" : ""].join(" ")}
          className={[classes?.panelItem, className].join(' ')}
          onClick={this.onAddButtonClick}
          style={style}
          // {...other}
        >
          {content || (this.constructor as typeof EditorComponent).Name}{' '}
          {help_url ? (
            <a
              href={help_url}
              target="_blank"
              rel="noopener noreferrer"
              className={classes?.helpLink}
            >
              <HelpIcon />
            </a>
          ) : null}
        </div>
      </Grid>
    )
  }

  unsetActiveItem = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const { setActiveItem } = this.getEditorContext()

    setActiveItem && setActiveItem(null)
  }

  onInputSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { innerText } = event.target

    let data

    if (innerText) {
      try {
        data = JSON.parse(innerText)
      } catch (error) {
        console.warn(error)
      }
    }

    if (data) {
      const {
        name,
        props,
        // component,
        components,
      } = data

      // if (component && components && props) {
      if (components && props) {
        this.updateObject({
          name,
          props,
          // component,
          components,
        })
      }
    }
  }

  expandStructure = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const structureViewLength = event.currentTarget.value

    this.setState({
      maxStructureLengthView: parseInt(structureViewLength),
    })
  }

  renderSettingsView(content?: React.ReactNode) {
    const canEdit = this.canEdit()

    const object = this.getObjectWithMutations()

    if (!object) {
      return null
    }

    const { id: objectId, name, description } = object

    const { maxStructureLengthView } = this.state

    const header = this.renderHeader(true)

    // let {
    //   props: {
    //     props,
    //     ...other
    //   },
    // } = this;

    const saveable = (this.constructor as typeof EditorComponent).saveable

    const activeParent = this.getActiveParent()

    const parentId = activeParent.getObjectWithMutations()?.id

    const deletable = this.isDeletable()

    const { style: allStyles, ...componentProps } = this.getComponentProps(this)

    const isRoot = this.isRoot()

    const structure = this.getStructure(this)

    let structureView

    if (structure) {
      try {
        structureView = JSON.stringify(structure, undefined, 2)

        // if (structureView) {
        // }
      } catch (error) {
        console.error(error)
      }
    }

    const structureViewLength = structureView ? structureView.length : 0

    if (
      maxStructureLengthView &&
      structureViewLength > maxStructureLengthView
    ) {
      structureView = (
        <Button onClick={this.expandStructure} value={structureViewLength}>
          Show {structureViewLength} chars
        </Button>
      )
    } else {
      structureView = (
        <div
          contentEditable={canEdit ? true : false}
          suppressContentEditableWarning={true}
          style={
            canEdit
              ? {
                  border: '1px dashed #ddd',
                  padding: 3,
                }
              : undefined
          }
          onInput={this.onInputSettings}
        >
          {structureView}
        </div>
      )
    }

    const style = this.props.props?.style

    const editableStyles = {
      ...allStyles,
      ...style,
    }

    const settings: JSX.Element[] = []

    if (componentProps) {
      const names = Object.keys(componentProps)

      names.map((name) => {
        // @ts-ignore
        const value = componentProps[name]

        const type = typeof value

        const field = this.getEditorField({
          key: name,
          type,
          name,
          label: name,
          value,
          // deletable: this.props.data.object.props && this.props.data.object.props[name] !== undefined ? true : false,
          deletable: this.isDeletable(),
        })

        if (field) {
          settings.push(field)
        }

        return null
      })
    }

    if (editableStyles) {
      const names = Object.keys(editableStyles)

      names.map((name) => {
        // @ts-ignore
        const value = editableStyles[name]

        const type = typeof value

        const field = this.getEditorField({
          key: name,
          type,
          name,
          label: name,
          value,
          deletable: style && (style as any)[name] !== undefined ? true : false,
          style: editableStyles || {},
        })

        if (field) {
          settings.push(field)
        }

        return null
      })
    }

    const buttons = (
      <Grid
        container
        spacing={8}
        alignItems="center"
        // style={{
        //   flexDirection: "row-reverse",
        // }}
      >
        <Grid item xs></Grid>

        {/* {!isRoot && !objectId && activeParent && parentId ? */}
        {objectId ? (
          <Grid item>
            <Link href={`/templates/${objectId}`}>
              <LinkIcon />
            </Link>
          </Grid>
        ) : null}
        {!isRoot && !objectId && activeParent && saveable ? (
          <Grid item>
            <IconButton
              title="Сохранить в отдельный компонент"
              /**
               * При сохранении, мы должны текущий элемент заменить новым
               */
              // eslint-disable-next-line react/jsx-no-bind
              onClick={async (event) => {
                event.preventDefault()
                event.stopPropagation()

                this.saveSeparatedComponent(parentId)
              }}
            >
              <CloneIcon />
            </IconButton>
          </Grid>
        ) : null}

        {deletable ? (
          <Grid item>
            <IconButton title="Удалить элемент" onClick={this.delete}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        ) : null}

        <Grid item>
          <IconButton
            title="Завершить редактирование элемента"
            onClick={this.unsetActiveItem}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
    )

    const output = (
      <Grid
        container
        spacing={8}
        onMouseOver={this.stopPropagation}
        onMouseLeave={this.stopPropagation}
        /**
        Важно! Хотя этот блок отрендерен через портал в другую часть HTML-документа, на него распростроняются ивенты
        из родительского компонента. https://prisma-cms.com/chat-messages/cjv791tug5qg50989k3v2tdaa
        Из-за этого при клике событие уходит в ближайший верхний элемент основной области (и устанавливает активный компонент).
        Для предотвращения вызываем event.stopPropagation().
        Если установить и event.preventDefault(), то тогда не срабатывают клики на компонентах типа @prisma-cms/uploader
        event.target === event.currentTarget вроде помогает
        */
        onClick={this.stopPropagation}
      >
        <Grid item xs={12}>
          {buttons}
        </Grid>

        <Grid item xs={12}>
          {header}
        </Grid>

        {canEdit ? (
          <Fragment>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                value={name || ''}
                onChange={this.onChangeBind}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={description || ''}
                onChange={this.onChangeBind}
                fullWidth
              />
            </Grid>
          </Fragment>
        ) : null}

        {settings && settings.length ? (
          <Grid item xs={12}>
            <Grid
              container
              spacing={8}
              style={{
                borderTop: '1px solid #ddd',
              }}
            >
              {settings.map((n, index) => (
                <Grid key={index} item xs={12}>
                  {n}
                </Grid>
              ))}
            </Grid>
          </Grid>
        ) : null}

        {content ? (
          <Grid item xs={12}>
            {content}
          </Grid>
        ) : null}

        <Grid item xs={12}>
          <div
            style={{
              whiteSpace: 'pre-wrap',
              overflow: 'auto',
            }}
          >
            {structureView}
          </div>
        </Grid>
      </Grid>
    )

    return output
  }

  /**
   * Сохраняем в самостоятельный компонент
   */
  async saveSeparatedComponent(parentId: P['object']['id']) {
    const saveable = (this.constructor as typeof EditorComponent).saveable

    if (!saveable) {
      this.addError('This component can not be saved as separated')
      return
    }

    // const { createTemplateProcessor } = this.context.query || {}

    const { createTemplate } = this.props

    if (!createTemplate) {
      return
    }

    const object = this.getObjectWithMutations()

    if (!object) {
      return
    }

    // const {
    //   props: {
    //     name,
    //     description,
    //     props,
    //     components,
    //   },
    // } = this;

    const { createdAt, updatedAt, __typename, ...template } = object

    let Parent

    if (parentId) {
      Parent = {
        connect: {
          id: parentId,
        },
      }
    }

    const { parent } = this.props

    if (!parent) {
      console.error('Can not get parent')

      return false
    }

    const parentObject = parent.getObjectWithMutations()

    if (!parentObject) {
      return
    }

    const { components } = parentObject

    const index = components.indexOf(object)

    if (index === -1) {
      console.error('Can not find current component in parent')
    }

    // return;

    await createTemplate({
      variables: {
        data: {
          ...template,
          Parent,
        },
      },
    }).then((r) => {
      const { success, data } = r.data.response || {}

      if (success && data) {
        const { id: newTemplateId, name, component } = data

        const newComponents = components.slice(0)

        newComponents[index] = {
          id: newTemplateId,
          name,
          component,
          props: {},
          components: [],
        }

        parent.updateObject({
          components: newComponents,
        })

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
  }

  isRoot(): boolean {
    const activeParent = this.getActiveParent()

    return activeParent === this
  }

  getStructure(item: EditorComponent) {
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

    const { CreatedBy, ...other } = item.getObjectWithMutations() ?? {}

    return other

    // return {
    //   type,
    //   props: props,
    //   // components: components ? components.map() : [],
    //   components,
    // };
  }

  getEditorField(props: any) {
    // eslint-disable-next-line prefer-const
    let { key, type, name, value, deletable, style, ...other } = props

    let field = null

    if (type === 'object') {
      if (value === null) {
        type = 'string'
      }
    }

    let deleteButton

    let secondary

    switch (name) {
      case 'backgroundImage':
        secondary = this.renderUploader({
          onUpload: ({ path }: { path: string }) => {
            const style = this.props.props?.style

            this.updateComponentProperty(
              name,
              `url(/images/big/${path})`,
              style || {}
            )
          },
        })

        break

      default:
    }

    if (deletable) {
      deleteButton = (
        <IconButton
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => {
            if (style) {
              delete style[name]

              this.updateComponentProps({
                style,
              })
            } else {
              this.removeProps(name)
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      )
    }

    switch (type) {
      case 'boolean':
        field = (
          <Grid key={key} container>
            <Grid item xs>
              <FormControlLabel
                control={
                  <Switch
                    name={name}
                    checked={value}
                    color="primary"
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange={(event) => this.onChangeProps(event, style)}
                    {...other}
                  />
                }
                label={name}
                // fullWidth
              />
            </Grid>
            {deleteButton ? <Grid item>{deleteButton}</Grid> : null}
          </Grid>
        )

        break

      case 'number':
      case 'string':
      case 'undefined':
        field = (
          <Grid key={key} container>
            <Grid item xs>
              <TextField
                // key={name}
                type={type}
                name={name}
                // label={name}
                value={value || ''}
                // eslint-disable-next-line react/jsx-no-bind
                onChange={(event) => this.onChangeProps(event, style)}
                {...other}
                fullWidth
              />
            </Grid>

            {secondary ? <Grid item>{secondary}</Grid> : null}

            {deleteButton ? <Grid item>{deleteButton}</Grid> : null}
          </Grid>
        )

        break

      default:
    }

    return field
  }

  renderUploader(props: Record<string, any> = {}) {
    const { onUpload, ...other } = props

    return (
      <Uploader
        name="file"
        helperText="Можно перетащить файл"
        // eslint-disable-next-line react/jsx-no-bind
        onUpload={(response) => {
          const { singleUpload, multipleUpload } = response.data
          // const multipleUpload = response.data?.multipleUpload;

          const result = multipleUpload || singleUpload

          if (!result) {
            throw new Error('Error while uploading')
          }

          return onUpload ? onUpload(result) : onUpload
        }}
        {...other}
      ></Uploader>
    )
  }

  onChangeProps(event: React.ChangeEvent, style: any) {
    // return;

    return this.updateProps(event.target, style)
  }

  updateProps(node: any, style: any) {
    // eslint-disable-next-line prefer-const
    let { name, value, type, checked } = node

    switch (type) {
      case 'boolean':
      case 'checkbox':
        value = checked
        break

      case 'number':
        // value = parseFloat(value);
        value = Number(value)

        break

      default:
    }

    // this.updateComponentProperty(component, name, value);
    this.updateComponentProperty(name, value, style)
  }

  updateComponentProperty(
    name: keyof P['object']['props'],
    value: any,
    style: any
  ) {
    if (style) {
      return this.updateComponentProps({
        style: {
          ...style,
          [name]: value,
        },
      })
    } else {
      // @ts-ignore
      return this.updateComponentProps({
        [name]: value,
      })
    }
  }

  /**
   * Обновления свойств объекта.
   * Здесь важно понимать когда свойства текущего объекта надо изменить (если корневой или с id),
   * а когда родительский (с плавающей вложенностью)
   */
  updateComponentProps(data: Partial<P['object']['props']>) {
    const object = this.getObjectWithMutations()

    if (!object) {
      return
    }

    const {
      props: { ...props },
    } = object

    if (data) {
      const keys = Object.keys(data)

      keys.map((name) => {
        const value = data[name]

        if (value === undefined) {
          delete props[name]
        } else {
          props[name] = value
        }

        return null
      })
    }

    this.updateObject({
      props,
    })
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
    } = this.props

    // let {
    //   components,
    // } = activeItem.props.parent.props;

    if (!parent) {
      console.error('Can not get parent')
      return
    }

    const object = this.getObjectWithMutations()

    if (!object) {
      return null
    }

    // let {
    //   // components,
    //   data: {
    //     object: {
    //       components,
    //     },
    //   },
    // } = this.props.parent.props;

    const components = parent.getObjectWithMutations()?.components

    if (!components) {
      // components = [];

      // object.components = components;

      // throw new Error("Can not get components");
      console.error('Can not get components')

      return
    }

    const index = components.indexOf(object)

    const component = components[index]

    if (!component) {
      console.error(
        'Can not get component. updateComponentProps activeItem',
        this
      )
      // console.error("Can not get component. updateComponentProps activeParent", activeParent);

      // throw new Error("Can not get component");

      return
    }

    return component
  }

  // updateComponent__(data) {
  //   const activeItem = this.getActiveItem()

  //   activeItem.updateObject(data)
  // }

  removeProps(name: keyof P['object']['props']) {
    // @ts-ignore
    this.updateComponentProps({
      [name]: undefined,
    })
  }

  getActiveItem() {
    const { activeItem } = this.getEditorContext()

    return activeItem
  }

  isActive = () => {
    const { active } = this.state

    return active ? true : false
  }

  // isActive() {
  //   const activeItem = this.getActiveItem()

  //   return activeItem && activeItem instanceof this.constructor ? true : false
  // }

  stopPropagation = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  renderMainView(renderProps?: Record<string, any>): React.ReactNode {
    const object = this.getObjectWithMutations()

    if (!object) {
      return null
    }

    const {
      id: objectId,
      props: { style: objectStyle, className, ...objectProps },
      components,
      component,
      ...other
    } = object

    const {
      // activeItem,
      dragTarget,
      // hoveredItem,
      // settingsViewContainer,
      getSettingsViewContainer,
      // inEditMode,
      classes,
      // onDragStart,
      Components,
    } = this.getEditorContext()

    const inEditMode = this.inEditorMode()

    const settingsViewContainer = getSettingsViewContainer
      ? getSettingsViewContainer()
      : null

    const RootElement = this.getRootElement()

    let settingsView

    /**
     * Заголовок блока, чтобы можно было перетаскивать и т.п.
     */
    let badge

    /**
     * Для тегов типа img непозволительны дочерние элементы.
     * Если в такие элементы пытаться выводить дочерние,
     * будет возникать ошибка "must neither have `children`"
     */
    const inner = []

    const childs = this.renderChildren()

    if (childs) {
      inner.push(childs)
    }

    if (inEditMode) {
      const isActive = this.isActive()
      const isDragOvered = dragTarget === this ? true : false
      const isHovered = this.isHovered()
      const deletable = this.isDeletable()

      if (isActive && settingsViewContainer) {
        /**
         * Важно по наследованию событий в порталы
         * https://github.com/facebook/react/issues/11387
         */
        settingsView = ReactDOM.createPortal(
          this.renderSettingsView(),
          settingsViewContainer
        )
      }

      if (isActive || isDragOvered || isHovered) {
        badge = (
          <div
            key="badge"
            className={classes?.blockBadge}
            contentEditable={false}
          >
            <Grid
              container
              alignItems="center"
              style={{
                flexWrap: 'nowrap',
              }}
            >
              <Grid item xs>
                {this.renderBadgeTitle(component)}
              </Grid>

              <Grid item>
                <IconButton
                  onClick={this.moveBlockUp}
                  className={classes?.badgeButton}
                >
                  <ArrowUpIcon />
                </IconButton>
              </Grid>

              <Grid item>
                <IconButton
                  onClick={this.moveBlockDown}
                  className={classes?.badgeButton}
                >
                  <ArrowDownIcon />
                </IconButton>
              </Grid>

              {/* {deletable && activeItem && activeItem === this ? */}
              {deletable && isActive ? (
                <Grid item>
                  <IconButton
                    title="Удалить элемент"
                    onClick={this.delete}
                    className={classes?.badgeButton}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              ) : null}

              <Grid
                item
                style={{
                  cursor: 'pointer',
                }}
                draggable={true}
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
                onClick={this.stopPropagation}
              >
                <DragIcon />
              </Grid>
            </Grid>
          </div>
        )
      }

      {
        /* 
        Для блоков с contentEditable (например Tag), если текст отсутствует,
        то фокус уходит в бадж и текст не доступен для редактирования.
        Пока как временный хак скрываем бадж в режиме фокуса.
      */
      }
      const badgeView = this.renderBadge(badge)

      if (badgeView) {
        inner.push(badgeView)
      }

      if (isActive && !this.isVoidElement()) {
        const addBlocks = this.renderAddButtons(
          <Grid key="add_buttons" container spacing={8}>
            {Components?.map((Component, index) => {
              const name = Component.Name

              return (
                <Component
                  key={`${name}-${index}`}
                  mode="add_child"
                  className={'add_child'}
                  parent={this}
                />
              )
            })}
          </Grid>
        )

        if (addBlocks) {
          // inner.push(addBlocks);

          inner.push(this.renderActionPanel(addBlocks))
        }
      }
    }

    // if (!inner.length) {
    //   inner = undefined;
    // }

    const { style: renderStyles } = renderProps || {}

    const {
      style: otherRenderStyles,
      hide_wrapper_in_default_mode,
      ...otherRenderProps
    } = this.getRenderProps()

    /**
     * Возможно надо будет переделать
     */
    // this.processMeta()

    if (hide_wrapper_in_default_mode && !inEditMode) {
      return this.renderChildren()
    }

    return (
      <>
        {/* @ts-ignore */}
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
      </>
    )
  }

  renderBadgeTitle(title: React.ReactNode) {
    return title
  }

  renderBadge(badge: React.ReactNode) {
    const { render_badge } = this.props

    if (this.isVoidElement() || !render_badge) {
      return null
    }

    return badge
  }

  renderAddButtons(content: React.ReactNode) {
    return content
  }

  renderActionPanel(content: React.ReactNode) {
    const {
      // actionPanel,
      getActionPanel,
    } = this.getEditorContext()

    const actionPanel = getActionPanel ? getActionPanel() : null

    if (actionPanel) {
      return ReactDOM.createPortal(content, actionPanel)
      // return ReactDOM.createPortal(<div>dfsdfsdf</div>, actionPanel);
    } else {
      return content
    }
  }

  isVoidElement() {
    return false
  }

  // prepareRootElementProps(props: P & React.AllHTMLAttributes<HTMLElement>) {
  prepareRootElementProps(props: P & Record<string, any>) {
    // for (var i in props) {

    //   let value = props[i];

    /**
     * Нельзя вычищать булевы, потому что некоторые компоненты
     * принимают именно булевы значения, а не строчные
     */
    //   if (typeof value === "boolean") {
    //     props[i] = value.toString();
    //   }

    // }

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
      hide_wrapper_in_default_mode,
      createTemplateResult,
      updateTemplateResult,
      PrismaProject,
      component,
      query,
      components,
      parent,
      on_create_redirect_url,
      on_delete_redirect_url,
      updateObject,
      TagEditor,
      fullWidth,
      render_badge,
      can_be_edited,
      delete_component,
      // contentEditable,
      ...other
    } = props

    let style: any | undefined

    if (propsStyles) {
      style = {
        ...propsStyles,
      }

      Object.keys(style).map((name) => {
        if (style[name] === undefined) {
          delete style[name]
        }

        return null
      })

      // if (this.isActive()) {

      // }
    }

    return {
      ...other,
      // contentEditable,
      // render_badge: render_badge !== undefined ? render_badge.toString() : undefined,
      style,
    }
  }

  getRootElement() {
    const { tag } = this.getComponentProps(this)

    return tag || 'div'
  }

  renderChildren() {
    if (this.isVoidElement()) {
      return null
    }

    const {
      // mutate,
      // createTemplate,
      // updateTemplate,
      children,
    } = this.props

    if (children !== undefined) {
      return children
    }

    const object = this.getObjectWithMutations()

    if (!object) {
      return null
    }

    const {
      // props,
      components: itemComponents,
    } = object

    const output: React.ReactNode[] = []

    // if (itemComponents && itemComponents.length) {
    if (itemComponents) {
      this.getComponents(itemComponents).map((n, index) => {
        output.push(this.renderComponent(n, index))

        return null
      })
    }

    return output
  }

  getComponents(itemComponents: P['object']['components']) {
    return itemComponents || []
  }

  renderComponent(objectComponent: P['object'], index: number) {
    const {
      Components,
      TemplateRenderer,
      // inEditMode,
    } = this.getEditorContext()

    if (!Components) {
      return null
    }

    const inEditMode = this.inEditorMode()

    const {
      // mutate,
      createTemplate,
      updateTemplate,
      // children,
    } = this.props

    const {
      id: templateId,
      name,
      component,
      props,
      components,
      ...other
    } = objectComponent

    const Component = Components.find((n) => n.Name === component)

    if (Component) {
      if (templateId) {
        if (!TemplateRenderer) {
          return null
        }

        // TODO: restore
        return (
          <TemplateRenderer
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
          />
        )
      } else {
        return (
          // @ts-ignore
          <Component
            key={index}
            mode="main"
            parent={this}
            props={props}
            components={components}
            object={objectComponent}
            mutate={createTemplate}
            createTemplate={createTemplate}
            updateTemplate={updateTemplate}
            {...other}
          />
        )
      }
    } else {
      if (inEditMode) {
        return (
          <Typography
            // size="small"
            // variant="raised"
            color="error"
          >
            Missed component {component}
          </Typography>
        )
      }
    }
  }

  deleteComponentByIndex = (index: number) => {
    const components = this.getObjectWithMutations()?.components

    if (index === -1) {
      return
    } else if (components && components.length) {
      const newComponents = components.slice(0)

      newComponents.splice(index, 1)

      this.updateObject({
        components: newComponents,
      })
    }
  }

  inEditorMode() {
    const { inEditMode } = this.getEditorContext()

    const { can_be_edited } = this.props

    return inEditMode && can_be_edited ? true : false
  }

  // @ts-ignore
  renderHeader(show: boolean) {
    if (!show) {
      return null
    }
    return super.renderHeader()
  }

  getTitle() {
    const { name, component } = this.getObjectWithMutations() ?? {}

    return !name && !component
      ? ''
      : name === component
      ? name
      : `${name} (${component})`
  }

  renderEmpty() {
    return this.renderDefaultView()
  }

  renderEditableView() {
    return this.renderDefaultView()
  }

  renderDefaultView() {
    return this.renderMainView()
  }

  editorContext!: EditorContextValue

  getEditorContext = (): EditorContextValue => {
    return this.editorContext
  }

  render() {
    return (
      <EditorContext.Consumer>
        {(context) => {
          const { Components } = context

          Object.assign(this, {
            Components,
            // getEditorContext: () => context,
            editorContext: context,
          })

          const {
            // id: objectId,
            mode,
            // props,
            // children,
            // ...other
          } = this.props

          let content = null

          switch (mode) {
            case 'main':
              content = super.render()

              break

            case 'panel':
              {
                const activeItem = this.getActiveItem()

                if (
                  !activeItem ||
                  (activeItem && activeItem instanceof this.constructor)
                ) {
                  content = this.renderPanelView()
                }
              }
              break

            case 'add_child':
              {
                const { parent: activeItem } = this.props

                if (activeItem && this.canBeParent(activeItem)) {
                  content = this.renderAddButton()
                }
              }

              break

            default:
          }

          if (!content) {
            return null
          }

          return content
        }}
      </EditorContext.Consumer>
    )
  }
}

export default EditorComponent
