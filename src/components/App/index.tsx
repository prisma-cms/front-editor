/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PureComponent, Fragment } from 'react'
// import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles'

// import CloseIcon from 'material-ui-icons/Close';
// import OpenTemplatesIcon from 'material-ui-icons/ArrowForward'
// import CloseTemplatesIcon from 'material-ui-icons/ArrowBack'

import Context, { PrismaCmsContext } from '@prisma-cms/context'

import Page from './components/public/Page'
import GridComponent from './components/public/Grid'
// import TextArea from './components/public/TextArea';
// import UsersGrid from './components/public/UsersGrid';
import Connector from './components/public/Connectors/Connector'
import ObjectConnector from './components/public/Connectors/ObjectConnector'
import ListView from './components/public/Connectors/Connector/ListView'
import ObjectView from './components/public/Connectors/ObjectConnector/ObjectView'
import Pagination from './components/public/Connectors/Connector/Pagination'
import UserLink from './components/public/Connectors/Connector/UserLink'
import Filters from './components/public/Connectors/Connector/Filters'
import CreatedBy from './components/public/Connectors/Connector/Fields/CreatedBy'
import NamedField from './components/public/Connectors/Connector/Fields/NamedField'
import Content from './components/public/Connectors/Connector/Fields/Content'
import Section from './components/public/Section'
import Typography from './components/public/Typography'
// import RouterSwitch from './components/public/Router/Switch'
// import Route from './components/public/Router/Route'
import PageHeader from './components/public/PageHeader'
// import RoutedObject from './components/public/Router/RoutedObject';
import Link from './components/public/Link'
import { EditorContext } from './context'
// // import DraftEditor from './components/public/DraftEditor';
// // import TextArea from './components/public/TextArea';
import Tag, { HtmlTag } from './components/public/Tag'
// import IconButton from 'material-ui/IconButton'
import ObjectImage from './components/public/Connectors/Connector/Fields/ObjectImage'
// import { graphql } from 'react-apollo'
// import gql from 'graphql-tag'
import Button from './components/public/Button'
import Query from './components/public/Connectors/Query'
import Slider from './components/public/Slider'
import Iterable from './components/public/Connectors/Connector/ListView/Iterable'
import AppBar from './components/public/AppBar'
import Login from './components/public/Login'
// import ChangeLanguage from './components/public/ChangeLanguage';
import LanguageRouter from './components/public/LanguageRouter'
import TextField from './components/public/form/TextField'
import Switch from './components/public/form/Switch'
import EditableObject from './components/public/form/EditableObject'
import EditableView from './components/public/form/EditableObject/EditableView'
import DefaultView from './components/public/form/EditableObject/DefaultView'
// import VerticalTimeline from './components/public/VerticalTimeline';
// import VerticalTimelineItem from './components/public/VerticalTimeline/VerticalTimelineItem';
import RichText from './components/public/RichText'
import Table from './components/public/Table'
import TableRow from './components/public/Table/TableRow'
import TableCell from './components/public/Table/TableCell'
import Tabs from './components/public/Tabs'
import Tab from './components/public/Tabs/Tab'
import CreateObjectLink from './components/public/Button/CreateObjectLink'
import SudoOnly from './components/public/SudoOnly'
import EditableObjectButtons from './components/public/form/EditableObject/EditableObjectButtons'
import ResetObjectContext from './components/public/ResetObjectContext'
import DefaultValue from './components/public/Connectors/Connector/Fields/NamedField/DefaultValue'
import CurrentUser from './components/public/CurrentUser'
import FileUploader from './components/public/FileUploader'
import Select from './components/public/form/Select'
import ContentEditor from './components/public/ContentEditor'
// import GalleryFiles from './components/public/Gallery/GalleryFiles'
import ResourceFields from './components/public/Resource/Fields'

import { FrontEditorProps, FrontEditorState } from './interfaces'
import { EditorContextValue } from './context/EditorContext/interfaces'
import { EditorComponentObject } from './components/interfaces'
import EditorComponent from './components'
import TemplateRenderer from './TemplateRenderer'
import Grid from '../../common/Grid'

export * from './interfaces'

const styles = (theme: any) => {
  const {
    breakpoints,
    palette: {
      background: {
        default: bgDefault,
        // paper: bgPaper,
      },
      text: { primary: textPrimary },
    },
  } = theme

  const desktop = breakpoints.up('sm')

  const dragOveredBorderColor = '#15e408'
  const hoveredBorderColor = '#7509da'
  const activeBorderColor = '#b806bb'
  const dirtyBorderColor = 'red'

  const itemsPanelWidth = 290

  return {
    root: {
      [desktop]: {
        flex: 1,
        display: 'flex' as 'flex',
        // flexDirection: "row-reverse",
      },

      '&.fullheight': {
        // height: '100vh',
        height: '100%',
      },
    },
    editor: {
      position: 'relative' as 'relative',

      [desktop]: {
        flex: 1,
        overflow: 'auto',
        height: '100%',
      },
    },
    panel: {
      [desktop]: {
        width: 'min-content',
        height: '100%',
        overflow: 'auto',
        position: 'relative' as 'relative',
        transition: 'width 0.5s',
        '&.opened': {
          width: itemsPanelWidth,
        },
      },
    },
    panelItems: {
      [desktop]: {
        height: '100%',
        width: '100%',
        // width: itemsPanelWidth,
        // position: "absolute",
        overflow: 'auto',
      },
    },
    panelItem: {
      cursor: 'grab',
      padding: 10,
      border: '1px solid #ddd',
      display: 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      '&:hover': {
        border: `1px solid ${hoveredBorderColor}`,
      },
      '&.active': {
        border: `1px solid ${activeBorderColor}`,
      },
      '&.hovered': {
        border: `1px solid ${hoveredBorderColor}`,
      },
      '&.dragOvered': {
        border: `1px solid ${dragOveredBorderColor}`,
      },

      '&.add_child': {
        cursor: 'pointer' as 'pointer',
      },
    },
    items: {
      position: 'relative' as 'relative',
    },
    item: {},
    // inEditMode
    itemEditable: {
      position: 'relative' as 'relative',
      minHeight: '30px',
      border: '1px dotted #ddd',
      padding: 7,

      '&.dirty': {
        border: `1px solid ${dirtyBorderColor}`,
      },
      '&.active': {
        border: `1px solid ${activeBorderColor}`,
      },
      '&.dragOvered': {
        border: `1px solid ${dragOveredBorderColor}`,
      },
      '&.hovered': {
        border: `1px solid ${hoveredBorderColor}`,
      },
      '&.root': {
        borderWidth: 2,
      },
      '&.disabled': {
        borderColor: 'transparent' as 'transparent',
      },

      // https://habr.com/ru/post/456248/
      '&[contenteditable=true]': {
        '&:empty:before': {
          content: 'unset' as 'unset',
        },
      },
    },
    blockBadge: {
      border: '1px solid #ddd',
      position: 'absolute' as 'absolute',
      bottom: '100%',
      right: 0,
      zIndex: 2000,
      background: bgDefault,
      color: textPrimary,
      padding: 3,
    },
    badgeButton: {
      height: 34,
      width: 34,
    },
    panelButton: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
    },
    bordered: {
      border: '1px solid #ddd',
    },
    helpLink: {
      color: 'inherit' as 'inherit',
      marginLeft: 3,
    },
    actionPanel: {
      borderTop: '1px solid #ddd',
      maxHeight: 250,
      overflow: 'auto',
    },
  }
}

export class FrontEditor<
  P extends FrontEditorProps = FrontEditorProps,
  S extends FrontEditorState = FrontEditorState
> extends PureComponent<P, S> {
  context!: PrismaCmsContext

  static contextType = Context

  // static propTypes = {
  //   debug: PropTypes.bool.isRequired,
  //   classes: PropTypes.object.isRequired,
  //   // onDrop: PropTypes.func.isRequired,
  //   onChange: PropTypes.func,
  //   components: PropTypes.array,
  //   Components: PropTypes.arrayOf(PropTypes.func).isRequired,
  //   CustomComponents: PropTypes.arrayOf(PropTypes.func).isRequired,
  //   className: PropTypes.string,
  //   templates: PropTypes.array,
  // };

  static defaultProps = {
    debug: false,
    Components: [
      Page,
      GridComponent,
      Section,
      Typography,
      Tag,
      HtmlTag,
      Query,
      Connector,
      ObjectConnector,
      ListView,
      Iterable,
      ObjectView,
      Pagination,
      NamedField,
      DefaultValue,
      EditableObject,
      EditableView,
      DefaultView,
      EditableObjectButtons,
      ResetObjectContext,
      RichText,
      ObjectImage,
      FileUploader,
      UserLink,
      CurrentUser,
      Filters,
      CreateObjectLink,
      SudoOnly,
      CreatedBy,
      ResourceFields,
      Content,
      ContentEditor,
      Link,
      Button,
      PageHeader,
      AppBar,
      Login,
      LanguageRouter,
      Slider,
      TextField,
      Switch,
      Select,
      Table,
      TableRow,
      TableCell,
      Tabs,
      Tab,
      // TODO Restore
      // GalleryFiles,
      // RouterSwitch,
      // Route,
      // VerticalTimeline,
      // VerticalTimelineItem,
    ],
    CustomComponents: [],
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
    const { classes, inEditMode } = this.props

    const Components = this.getComponents()

    const editorContext: EditorContextValue = {
      inEditMode,
      classes,
      // components,
      Components,
      updateObject: this.updateObject,
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
    const CustomComponents = this.props.CustomComponents

    const baseComponents: P['Components'] = []

    if (CustomComponents) {
      CustomComponents.map((n) => {
        baseComponents.push(n)
      })
    }

    const Components: P['Components'] = this.props.Components ?? []

    const components = Components.reduce((curr, next) => {
      if (next) {
        /**
         * Check if component with same name exists
         */
        if (curr && curr.findIndex((n) => n.Name === next.Name) === -1) {
          curr.push(next)
        }
      }

      return curr
    }, baseComponents)

    return components
  }

  settingsViewContainerRef = (el: HTMLDivElement) => {
    this.settingsViewContainer = el
  }

  renderPanels() {
    const { classes } = this.props

    const Components = this.getComponents()

    return (
      <div className={classes?.panelItems}>
        <Grid container spacing={8}>
          {Components.map((Component) => {
            const name = Component.Name

            return (
              <Component
                key={name}
                mode="panel"
                className={classes?.panelItem}
              />
            )
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
      // debug,
      // components,
      // data,
      // setPageMeta,
      // Components,
      // CustomComponents,
      object,
      // ...other
    } = this.props

    const {
      // name,
      component,
    } = object || {}

    if (!component) {
      return null
    }

    const RenderComponents = this.getComponents()

    // RenderComponents[0]?.

    const Component = RenderComponents.find((n) => n.Name === component)

    if (!Component) {
      return null
    }

    return <Component mode="main" object={object} />
  }

  updateObject = (data: EditorComponentObject) => {
    const { components } = data

    const { onChange } = this.props

    if (onChange && components !== undefined) {
      return onChange(components)
    }
  }

  getComponents() {
    const { Components } = this.state

    return Components
  }

  actionPanelRef = (el: HTMLDivElement) => {
    this.actionPanel = el
  }

  render() {
    const { classes, inEditMode, className } = this.props

    const { editorContext } = this.state

    const items = this.renderItems()

    return (
      <EditorContext.Provider value={editorContext}>
        {inEditMode ? (
          <Fragment>
            <div
              id="prisma-cms-front-editor--wrapper"
              className={[classes?.root, className].join(' ')}
            >
              <div
                id="prisma-cms-front-editor--content"
                className={[classes?.editor, classes?.bordered].join(' ')}
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column' as 'column',
                }}
              >
                <div
                  id="prisma-cms-front-editor--items"
                  className={[classes?.items].join(' ')}
                  style={{
                    flex: 1,
                    overflow: 'auto',
                  }}
                >
                  {items}
                </div>

                <div
                  ref={this.actionPanelRef}
                  className={[
                    classes?.actionPanel,
                    'front-editor--action-panel',
                  ].join(' ')}
                ></div>
              </div>

              <div
                id="prisma-cms-front-editor--panel"
                className={[classes?.panel, classes?.bordered, 'opened'].join(
                  ' '
                )}
              >
                {this.renderPanels()}
              </div>
            </div>
          </Fragment>
        ) : (
          items
        )}
      </EditorContext.Provider>
    )
  }
}

const FrontEditorRenderer = withStyles(styles)((props: FrontEditorProps) => (
  <FrontEditor {...props} />
))

export default FrontEditorRenderer