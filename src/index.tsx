/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import withStyles from 'material-ui/styles/withStyles'

// import CloseIcon from 'material-ui-icons/Close';
// import OpenTemplatesIcon from 'material-ui-icons/ArrowForward'
// import CloseTemplatesIcon from 'material-ui-icons/ArrowBack'

import Context, { PrismaCmsContext } from '@prisma-cms/context'

import { EditorContext } from './context'
import { EditorContextValue } from './context/EditorContext/interfaces'
// import { EditorComponentObject } from './components/interfaces'
import TemplateRenderer from './TemplateRenderer'
import Grid from './common/Grid'

import EditorComponent, { EditorComponentObject } from './EditorComponent'

import { FrontEditorProps, FrontEditorState } from './interfaces'
import { FrontEditorStyled } from './styles'
export * from './interfaces'

export * from './EditorComponent'
export * from './context'

// const styles = (theme: any) => {
//   const {
//     breakpoints,
//     palette: {
//       background: {
//         default: bgDefault,
//         // paper: bgPaper,
//       },
//       text: { primary: textPrimary },
//     },
//   } = theme

//   const desktop = breakpoints.up('sm')

//   const dragOveredBorderColor = '#15e408'
//   const hoveredBorderColor = '#7509da'
//   const activeBorderColor = '#b806bb'
//   const dirtyBorderColor = 'red'

//   const itemsPanelWidth = 290

//   return {
//     root: {
//       [desktop]: {
//         flex: 1,
//         display: 'flex' as 'flex',
//         // flexDirection: "row-reverse",
//       },

//       '&.fullheight': {
//         // height: '100vh',
//         height: '100%',
//       },
//     },
//     editor: {
//       position: 'relative' as 'relative',

//       [desktop]: {
//         flex: 1,
//         overflow: 'auto',
//         height: '100%',
//       },
//     },
//     panel: {
//       [desktop]: {
//         width: 'min-content',
//         height: '100%',
//         overflow: 'auto',
//         position: 'relative' as 'relative',
//         transition: 'width 0.5s',
//         '&.opened': {
//           width: itemsPanelWidth,
//         },
//       },
//     },
//     panelItems: {
//       [desktop]: {
//         height: '100%',
//         width: '100%',
//         // width: itemsPanelWidth,
//         // position: "absolute",
//         overflow: 'auto',
//       },
//     },
//     panelItem: {
//       cursor: 'grab',
//       padding: 10,
//       border: '1px solid #ddd',
//       display: 'flex',
//       flexDirection: 'row' as 'row',
//       alignItems: 'center' as 'center',
//       '&:hover': {
//         border: `1px solid ${hoveredBorderColor}`,
//       },
//       '&.active': {
//         border: `1px solid ${activeBorderColor}`,
//       },
//       '&.hovered': {
//         border: `1px solid ${hoveredBorderColor}`,
//       },
//       '&.dragOvered': {
//         border: `1px solid ${dragOveredBorderColor}`,
//       },

//       '&.add_child': {
//         cursor: 'pointer' as 'pointer',
//       },
//     },
//     items: {
//       position: 'relative' as 'relative',
//     },
//     item: {},
//     // inEditMode
//     itemEditable: {
//       position: 'relative' as 'relative',
//       minHeight: '30px',
//       border: '1px dotted #ddd',
//       padding: 7,

//       '&.dirty': {
//         border: `1px solid ${dirtyBorderColor}`,
//       },
//       '&.active': {
//         border: `1px solid ${activeBorderColor}`,
//       },
//       '&.dragOvered': {
//         border: `1px solid ${dragOveredBorderColor}`,
//       },
//       '&.hovered': {
//         border: `1px solid ${hoveredBorderColor}`,
//       },
//       '&.root': {
//         borderWidth: 2,
//       },
//       '&.disabled': {
//         borderColor: 'transparent' as 'transparent',
//       },

//       // https://habr.com/ru/post/456248/
//       '&[contenteditable=true]': {
//         '&:empty:before': {
//           content: 'unset' as 'unset',
//         },
//       },
//     },
//     blockBadge: {
//       border: '1px solid #ddd',
//       position: 'absolute' as 'absolute',
//       bottom: '100%',
//       right: 0,
//       zIndex: 2000,
//       background: bgDefault,
//       color: textPrimary,
//       padding: 3,
//     },
//     badgeButton: {
//       height: 34,
//       width: 34,
//     },
//     panelButton: {
//       display: 'flex' as 'flex',
//       flexDirection: 'row' as 'row',
//       alignItems: 'center' as 'center',
//     },
//     bordered: {
//       border: '1px solid #ddd',
//     },
//     helpLink: {
//       color: 'inherit' as 'inherit',
//       marginLeft: 3,
//     },
//     actionPanel: {
//       borderTop: '1px solid #ddd',
//       maxHeight: 250,
//       overflow: 'auto',
//     },
//   }
// }

export class FrontEditor<
  P extends FrontEditorProps = FrontEditorProps,
  S extends FrontEditorState = FrontEditorState
> extends PureComponent<P, S> {
  context!: PrismaCmsContext

  static contextType = Context

  static defaultProps: Pick<
    FrontEditorProps,
    'itemsOnly' | 'inEditMode' | 'Components' | 'className'
  > = {
    itemsOnly: false,
    inEditMode: false,
    Components: [],
    className: 'fullheight',
  }

  /**
   * Этот массив используется для быстрого поиска всех отрендеренных компонентов
   */
  // TODO: Maybe need to remove. Too many setStates
  mountedComponents: EditorComponent[] = []

  actionPanel: HTMLDivElement | undefined

  settingsViewContainer: HTMLDivElement | undefined

  constructor(props: P) {
    super(props)

    this.state = {
      ...this.state,

      Components: this.prepareComponents(),

      /**
       * Элемент в панели управления, который может быть перетянут на страницу
       */
      dragItem: null,

      /**
       * Текущий элемент на странице, в который может быть заброшен новый элемент
       */
      dragTarget: null,

      /**
       * Текущий элемент на странице, свойства которого можно редактировать (выбирается по клику)
       */
      activeItem: null,

      /**
       * Элемент, на который наведена мышь
       */
      hoveredItem: null,

      /**
       * Открыта ли панель с каталогом шаблонов
       */
      templatesOpened: false,
    }

    Object.assign(this.state, {
      editorContext: this.initContext(),
    })

    this.forceUpdate = this.forceUpdate.bind(this)
  }

  registerMountedComponent = (component: EditorComponent) => {
    const { mode } = component.props

    if (mode === 'main') {
      this.mountedComponents.push(component)
    }

    // }
  }

  setActiveItem = (component: EditorContextValue['activeItem']) => {
    if (component) {
      component.setState({
        active: true,
      })
    }

    const components = this.mountedComponents.filter(
      (n) => n.state?.active && (!component || n !== component)
    )

    components.map((n) =>
      n.setState({
        active: false,
      })
    )

    this.updateContext({
      activeItem: component,
    })
  }

  getDragItem = () => {
    const { dragItem } = this.state

    return dragItem
  }

  getDragTarget = () => {
    const { dragTarget } = this.state

    return dragTarget
  }

  getActiveItem = () => {
    const { activeItem } = this.state

    return activeItem
  }

  getHoveredItem = () => {
    const { hoveredItem } = this.state

    return hoveredItem
  }

  getSettingsViewContainer = () => {
    return this.settingsViewContainer
  }

  onDragStart = (_event: React.DragEvent, item: EditorComponentObject) => {
    this.updateContext({
      dragItem: item,
    })
  }

  onDragEnd = () => {
    this.updateContext({
      dragItem: null,
      dragTarget: null,
      activeItem: null,
      hoveredItem: null,
    })
  }

  setDragTarget = (component: EditorComponent) => {
    this.setState({
      dragTarget: component,
    })

    this.updateContext({
      dragTarget: component,
    })
  }

  setHoveredItem = (component: EditorComponent | null) => {
    if (component) {
      component.setState({
        hovered: true,
      })
    }

    const components = this.mountedComponents.filter(
      (n) => n.state.hovered && (!component || n !== component)
    )

    components.map((n) =>
      n.setState({
        hovered: false,
      })
    )
  }

  getActionPanel = () => {
    return this.actionPanel
  }

  unregisterMountedComponent = (component: EditorComponent) => {
    const index = this.mountedComponents.indexOf(component)

    if (index !== -1) {
      this.mountedComponents.splice(index, 1)
    }
  }

  initContext() {
    const { inEditMode } = this.props

    const Components = this.getComponents()

    const editorContext: EditorContextValue = {
      inEditMode,
      // components,
      Components,
      // updateObject: this.updateObject,
      // dragItem,
      getDragItem: this.getDragItem,
      // dragTarget,
      getDragTarget: this.getDragTarget,
      // activeItem,
      getActiveItem: this.getActiveItem,
      getHoveredItem: this.getHoveredItem,
      getSettingsViewContainer: this.getSettingsViewContainer,
      onDragStart: this.onDragStart,
      onDragEnd: this.onDragEnd,
      setDragTarget: this.setDragTarget,
      setActiveItem: this.setActiveItem,
      setHoveredItem: this.setHoveredItem,
      forceUpdate: this.forceUpdate,
      TemplateRenderer,
      getActionPanel: this.getActionPanel,

      registerMountedComponent: this.registerMountedComponent,

      unregisterMountedComponent: this.unregisterMountedComponent,

      setPageMeta: this.setPageMeta,
    }

    // eslint-disable-next-line react/no-direct-mutation-state
    // this.state.editorContext = editorContext

    return editorContext
  }

  updateContext(data: Partial<EditorContextValue>) {
    const { editorContext } = this.state

    this.setState({
      editorContext: {
        ...editorContext,
        ...data,
      },
    })
  }

  // TODO Maybe remove
  /**
   * @deprecated
   */
  getContextValue(name: keyof S['editorContext']) {
    const { [name]: value } = this.state.editorContext

    return value
  }

  /**
   * @deprecated use next/head instead
   */
  setPageMeta(_meta = {}) {
    return
  }

  componentDidUpdate(prevProps: P, prevState: S) {
    const { inEditMode } = this.props

    if (inEditMode !== undefined && inEditMode !== prevProps.inEditMode) {
      const { editorContext } = this.state

      this.setState({
        editorContext: {
          ...editorContext,
          inEditMode,
        },
      })
    }

    super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState)
  }

  prepareComponents(): P['Components'] {
    return this.props.Components ?? []
  }

  settingsViewContainerRef = (el: HTMLDivElement) => {
    this.settingsViewContainer = el
  }

  renderPanels() {
    const Components = this.getComponents()

    return (
      <div className="panelItems">
        <Grid container spacing={8}>
          {Components.map((Component) => {
            const name = Component.Name

            return <Component key={name} mode="panel" className="panelItem" />
          })}

          <Grid item xs={12}>
            {/* 
            Сюда будут выводиться настройки активного компонента
           */}
            <div ref={this.settingsViewContainerRef}></div>
          </Grid>
        </Grid>
      </div>
    )
  }

  renderItems() {
    const {
      // staticContext,
      // inEditMode,
      // components,
      // data,
      // setPageMeta,
      // Components,
      // CustomComponents,
      object,
      // ...other
      onChangeState,
    } = this.props

    const component = object?.component ?? null

    if (!component) {
      return null
    }

    const RenderComponents = this.getComponents()

    // RenderComponents[0]?.

    const Component = RenderComponents.find((n) => n.Name === component)

    if (!Component) {
      return null
    }

    return (
      <Component mode="main" object={object} onChangeState={onChangeState} />
    )
  }

  // updateObject = (data: EditorComponentObject) => {
  //   const { components } = data

  //   const { onChange } = this.props

  //   if (onChange && components !== undefined) {
  //     return onChange(components)
  //   }
  // }

  getComponents() {
    const { Components } = this.state

    return Components
  }

  actionPanelRef = (el: HTMLDivElement) => {
    this.actionPanel = el
  }

  onWindowClick = () => {
    /**
     * Unset all active items
     */
    this.setActiveItem(null)
  }

  componentDidMount() {
    this.addEvents()

    super.componentDidMount && super.componentDidMount()
  }

  componentWillUnmount() {
    this.removeEvents()

    super.componentWillUnmount && super.componentWillUnmount()
  }

  addEvents() {
    if (typeof window !== 'undefined') {
      window.addEventListener('click', this.onWindowClick)
    }
  }

  removeEvents() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('click', this.onWindowClick)
    }
  }

  stopPropagation = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  render() {
    const { inEditMode, className, itemsOnly } = this.props

    const { editorContext } = this.state

    const items = this.renderItems()

    return (
      <EditorContext.Provider value={editorContext}>
        {inEditMode && !itemsOnly ? (
          <FrontEditorStyled
            id="prisma-cms-front-editor--wrapper"
            className={['root', className].join(' ')}
          >
            <div
              id="prisma-cms-front-editor--content"
              className="editor bordered"
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column' as 'column',
              }}
            >
              <div
                id="prisma-cms-front-editor--items"
                className="items"
                style={{
                  flex: 1,
                  overflow: 'auto',
                }}
              >
                {items}
              </div>

              <div
                ref={this.actionPanelRef}
                className="front-editor--action-panel actionPanel"
                onClick={this.stopPropagation}
              ></div>
            </div>

            <div
              id="prisma-cms-front-editor--panel"
              className="panel bordered opened"
              onClick={this.stopPropagation}
            >
              {this.renderPanels()}
            </div>
          </FrontEditorStyled>
        ) : (
          items
        )}
      </EditorContext.Provider>
    )
  }
}

export default FrontEditor

// const FrontEditorRenderer = withStyles(styles)((props: FrontEditorProps) => (
//   <FrontEditor {...props} />
// ))

// export default FrontEditorRenderer
