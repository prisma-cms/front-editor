/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PureComponent } from 'react'

import Context, { PrismaCmsContext } from '@prisma-cms/context'

import { EditorContext } from './context'
import { EditorContextValue } from './context/EditorContext/interfaces'
// import { EditorComponentObject } from './components/interfaces'
// import TemplateRenderer from './TemplateRenderer'
import Grid from './common/Grid'

import EditorComponent, { EditorComponentObject } from './EditorComponent'

import { FrontEditorProps, FrontEditorState } from './interfaces'
import { FrontEditorStyled } from './styles'
export * from './interfaces'

export * from './EditorComponent'
export * from './context'

export function registerComponents<T extends typeof EditorComponent>(
  _keys: T[]
): (
  p: EditorComponentObject & {
    component: typeof _keys[number]['Name']
    // I make eslint crazy)))
    // eslint-disable-next-line no-undef
    components: Array<typeof p>
  }
) => EditorComponentObject {
  return (n) => n
}

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
      // TemplateRenderer,
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
        <FrontEditorStyled
          // id="prisma-cms-front-editor--wrapper"
          // className={['root', className].join(' ')}
          className={[className, !itemsOnly ? 'flex' : ''].join(' ')}
        >
          {inEditMode && !itemsOnly ? (
            <>
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
            </>
          ) : (
            items
          )}
        </FrontEditorStyled>
      </EditorContext.Provider>
    )
  }
}

export default FrontEditor
