/* eslint-disable react/forbid-foreign-prop-types */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import HtmlTag from '../Tag/HtmlTag'
import EditorComponent from '../../EditorComponent'

import withStyles from 'material-ui/styles/withStyles'
import IconButton from 'material-ui/IconButton'

import FormatClearIcon from 'material-ui-icons/FormatClear'
import SelectAllIcon from 'material-ui-icons/SelectAll'
import AlignLeftIcon from 'material-ui-icons/FormatAlignLeft'
import AlignRightIcon from 'material-ui-icons/FormatAlignRight'
import AlignJustifyIcon from 'material-ui-icons/FormatAlignJustify'
import AlignCenterIcon from 'material-ui-icons/FormatAlignCenter'
import FormatBoldIcon from 'material-ui-icons/FormatBold'
import FormatItalicIcon from 'material-ui-icons/FormatItalic'
import FormatUnderlinedIcon from 'material-ui-icons/FormatUnderlined'
import FormatStrikethroughIcon from 'material-ui-icons/FormatStrikethrough'
import FormatListBulletedIcon from 'material-ui-icons/FormatListBulleted'
import FormatListNumberedIcon from 'material-ui-icons/FormatListNumbered'
import FormatIndentIncreaseIcon from 'material-ui-icons/FormatIndentIncrease'
import FormatIndentDecreaseIcon from 'material-ui-icons/FormatIndentDecrease'
import RedoIcon from 'material-ui-icons/Redo'
import UndoIcon from 'material-ui-icons/Undo'
import SaveIcon from 'material-ui-icons/Save'
import Grid from '../../common/Grid'

// TODO move to separated file
export class TagEditor extends HtmlTag {
  static propTypes = {
    ...HtmlTag.propTypes,
    editable: PropTypes.bool.isRequired,
    updateObject: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
  }

  static defaultProps = {
    ...HtmlTag.defaultProps,
    editable: false,
    render_badge: false,
    can_be_edited: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      ...this.state,

      /**
       * Deprecated. Use selection instead
       */
      hasSelection: false,

      /**
       * DOM selection object
       */
      selection: null,
    }

    this.onSelectionChange = this.onSelectionChange.bind(this)
  }

  readOnly() {
    const { editable } = this.props

    return editable === true ? false : true
  }

  onSelectionChange() {
    const { container } = this

    let selection = document.getSelection()

    if (container) {
      let hasSelection = false

      if (selection.containsNode(container, true)) {
        hasSelection = true
      } else {
        selection = null
      }

      if (selection && selection === this.state.selection) {
        this.forceUpdate()
      } else {
        this.setState({
          hasSelection,
          selection,
        })
      }
    }
  }

  // componentDidMount() {

  //   this.addEventListeners();

  //   // if (!this.readOnly()) {

  //   //   this.setActiveItem(this);

  //   // }

  //   super.componentDidMount && super.componentDidMount();
  // }

  componentWillUnmount() {
    this.removeEventListeners()

    super.componentWillUnmount && super.componentWillUnmount()
  }

  addEventListeners() {
    if (!this.readOnly()) {
      const { container } = this

      if (container) {
        // container.addEventListener("DOMSubtreeModified", this.onDOMSubtreeModified);

        const config = {
          attributes: true,
          childList: true,
          subtree: true,
          characterData: true,
        }

        // Create an observer instance linked to the callback function
        // const observer = new MutationObserver(this.onDOMSubtreeModified);
        const observer = new MutationObserver((changes, observer) => {
          this.onChangeDom(container, changes, observer)
        })

        // Start observing the target node for configured mutations
        observer.observe(container, config)
      }

      document.addEventListener('selectionchange', this.onSelectionChange)
    }

    super.addEventListeners && super.addEventListeners()
  }

  removeEventListeners() {
    const { container } = this

    if (container) {
      // container.removeEventListener("DOMSubtreeModified", this.onDOMSubtreeModified);
    }

    document.removeEventListener('selectionchange', this.onSelectionChange)

    super.removeEventListeners && super.removeEventListeners()
  }

  onChangeDom(container) {
    const content = this.makeNewContent(container)

    const { components } = content

    this.onChangeContent(components)
  }

  updateObject(data) {
    const { updateObject } = this.props

    updateObject(data)
  }

  onChangeContent(components) {
    this.setState({
      newContent: {
        components,
      },
    })
  }

  /**
   * Для отлавливания изменений мы используем не событие oninput,
   * а DOMSubtreeModified,
   * поэтому перехватываем родительский обработчик
   */
  tagOnInput() {
    return false
  }

  tagOnKeyDown() {
    return false
  }

  getToolbarButtons() {
    const { selection, newContent } = this.state

    const { classes } = this.props

    const hasSelection = selection ? true : null

    const tableControls = [
      {
        key: 'insertTable',
        title: 'Вставить таблицу',
        disabled: hasSelection ? false : true,
        onClick: () =>
          this.execCommand(
            'insertHTML',
            true,
            `<table><tbody><tr><td></td></tr></tbody></table>`
          ),
        icon: (
          <svg
            className={[classes.icon, !hasSelection ? 'disabled' : ''].join(
              ' '
            )}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            style={{
              enableBackground: 'new 0 0 512 512',
            }}
            xmlSpace="preserve"
          >
            <g>
              <g>
                <g>
                  <path d="M0,0v512h256v-32h-64V352h32v-32h-32V192h128v32h32v-32h96v-32h-96V32h128v96h32V0H0z M160,480H32V352h128V480z M160,320 H32V192h128V320z M160,160H32V32h128V160z M320,160H192V32h128V160z" />
                  <path d="M384,256c-70.692,0-128,57.308-128,128s57.308,128,128,128s128-57.308,128-128C511.921,313.34,454.66,256.079,384,256z M384,480c-53.019,0-96-42.981-96-96s42.981-96,96-96s96,42.981,96,96C479.947,436.997,436.997,479.947,384,480z" />
                  <polygon points="400,336 368,336 368,368 336,368 336,400 368,400 368,432 400,432 400,400 432,400 432,368 400,368" />
                  <rect x="480" y="224" width="32" height="32" />
                  <rect x="480" y="160" width="32" height="32" />
                </g>
              </g>
            </g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
          </svg>
        ),
      },
    ]

    if (selection) {
      const table = this.closestInSelection(selection, 'table')

      if (table) {
        const tr = this.closestInSelection(selection, 'tr')

        tableControls.push({
          key: 'insertRow',
          title: 'Вставить строку',
          disabled: hasSelection ? false : true,
          // onClick: event => this.execCommand('insertHTML', true, `<table width="100%" border="1"><tbody><tr><td></td></tr></tbody></table>`),
          // onClick: event => document.execCommand('insertHTML', true, `<span>eded</span>`),
          onClick: () => {
            const index = Array.from(tr.parentElement.childNodes).indexOf(tr)

            this.insertTableRow(
              table,
              index + 1,
              tr.childElementCount,
              selection
            )
          },
          icon: (
            <svg
              className={[classes.icon, !hasSelection ? 'disabled' : ''].join(
                ' '
              )}
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 -21 512 512"
              style={{
                enableBackground: 'new 0 0 512 512',
              }}
              xmlSpace="preserve"
            >
              <path d="m102.355469 277.078125-74.664063-80c-4.480468-4.820313-11.414062-6.421875-17.558594-3.96875-6.121093 2.410156-10.132812 8.320313-10.132812 14.890625v160c0 6.570312 4.011719 12.480469 10.132812 14.871094 1.898438.765625 3.882813 1.128906 5.867188 1.128906 4.351562 0 8.597656-1.769531 11.691406-5.078125l74.664063-80c5.742187-6.144531 5.742187-15.699219 0-21.84375zm0 0" />
              <path d="m469.332031 341.332031h-320c-23.53125 0-42.664062 19.136719-42.664062 42.667969v42.667969c0 23.53125 19.132812 42.664062 42.664062 42.664062h320c23.53125 0 42.667969-19.132812 42.667969-42.664062v-42.667969c0-23.53125-19.136719-42.667969-42.667969-42.667969zm-320.019531 42.667969h138.6875v42.667969h-138.667969zm320.019531 42.667969h-138.664062v-42.667969h138.664062zm0 0" />
              <path d="m469.332031 0h-320c-23.53125 0-42.664062 19.136719-42.664062 42.667969v149.332031c0 23.53125 19.132812 42.667969 42.664062 42.667969h320c23.53125 0 42.667969-19.136719 42.667969-42.667969v-149.332031c0-23.53125-19.136719-42.667969-42.667969-42.667969zm0 96h-138.664062v-53.332031h138.664062zm-320-53.332031h138.667969v53.332031h-138.6875zm0 96h138.667969v53.332031h-138.667969zm181.335938 53.332031v-53.332031h138.664062v53.332031zm0 0" />
            </svg>
          ),
        })

        tableControls.push({
          key: 'insertCell',
          title: 'Вставить колонку',
          disabled: hasSelection ? false : true,
          onClick: () => {
            const cell = this.closestInSelection(selection, 'td,th')

            const index = Array.from(cell.parentElement.childNodes).indexOf(
              cell
            )

            this.insertTableCell(tr, index + 1, selection)
          },
          icon: (
            <svg
              className={[classes.icon, !hasSelection ? 'disabled' : ''].join(
                ' '
              )}
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="-21 0 512 512"
              style={{
                enableBackground: 'new 0 0 512 512',
              }}
              xmlSpace="preserve"
            >
              <path d="m288 106.667969c-3.925781 0-7.851562-1.429688-10.921875-4.3125l-80-74.664063c-4.800781-4.480468-6.378906-11.457031-3.96875-17.558594 2.410156-6.101562 8.320313-10.132812 14.890625-10.132812h160c6.570312 0 12.480469 4.011719 14.890625 10.132812 2.410156 6.125.832031 13.078126-3.96875 17.558594l-80 74.664063c-3.070313 2.882812-6.996094 4.3125-10.921875 4.3125zm-39.402344-74.667969 39.402344 36.777344 39.402344-36.777344zm0 0" />
              <path d="m432 512h-53.332031c-20.589844 0-37.335938-16.746094-37.335938-37.332031v-330.667969c0-20.585938 16.746094-37.332031 37.335938-37.332031h53.332031c20.585938 0 37.332031 16.746093 37.332031 37.332031v330.667969c0 20.585937-16.746093 37.332031-37.332031 37.332031zm-53.332031-373.332031c-2.945313 0-5.335938 2.386719-5.335938 5.332031v330.667969c0 2.941406 2.390625 5.332031 5.335938 5.332031h53.332031c2.945312 0 5.332031-2.390625 5.332031-5.332031v-330.667969c0-2.945312-2.386719-5.332031-5.332031-5.332031zm0 0" />
              <path d="m197.332031 512h-160c-20.585937 0-37.332031-16.746094-37.332031-37.332031v-330.667969c0-20.585938 16.746094-37.332031 37.332031-37.332031h160c20.589844 0 37.335938 16.746093 37.335938 37.332031v330.667969c0 20.585937-16.746094 37.332031-37.335938 37.332031zm-160-373.332031c-2.941406 0-5.332031 2.386719-5.332031 5.332031v330.667969c0 2.941406 2.390625 5.332031 5.332031 5.332031h160c2.945313 0 5.335938-2.390625 5.335938-5.332031v-330.667969c0-2.945312-2.390625-5.332031-5.335938-5.332031zm0 0" />
              <path d="m453.332031 325.332031h-96c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h96c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
              <path d="m218.667969 325.332031h-202.667969c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h202.667969c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
              <path d="m117.332031 512c-8.832031 0-16-7.167969-16-16v-373.332031c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v373.332031c0 8.832031-7.167969 16-16 16zm0 0" />
            </svg>
          ),
        })
      }
    }

    const buttons = [
      {
        name: 'bold',
        title: 'Жирный текст',
        disabled: hasSelection ? false : true,
        icon: <FormatBoldIcon />,
      },
      {
        name: 'italic',
        title: 'Наклонный текст',
        disabled: hasSelection ? false : true,
        icon: <FormatItalicIcon />,
      },
      {
        name: 'underline',
        title: 'Подчеркнутый текст',
        disabled: hasSelection ? false : true,
        icon: <FormatUnderlinedIcon />,
      },
      {
        name: 'strikeThrough',
        title: 'Перечеркнутый текст',
        disabled: hasSelection ? false : true,
        icon: <FormatStrikethroughIcon />,
      },
      {
        name: 'justifyLeft',
        title: 'Выровнить влево',
        disabled: hasSelection ? false : true,
        icon: <AlignLeftIcon />,
      },
      {
        name: 'justifyCenter',
        title: 'Выровнить по центру',
        disabled: hasSelection ? false : true,
        icon: <AlignCenterIcon />,
      },
      {
        name: 'justifyRight',
        title: 'Выровнить вправо',
        disabled: hasSelection ? false : true,
        icon: <AlignRightIcon />,
      },
      {
        name: 'justifyFull',
        title: 'Выровнить на всю ширину',
        disabled: hasSelection ? false : true,
        icon: <AlignJustifyIcon />,
      },
      {
        name: 'insertUnorderedList',
        title: 'Ненумерованный список',
        disabled: hasSelection ? false : true,
        icon: <FormatListBulletedIcon />,
      },
      {
        name: 'insertOrderedList',
        title: 'Нумерованный список',
        disabled: hasSelection ? false : true,
        icon: <FormatListNumberedIcon />,
      },
      {
        name: 'outdent',
        title: 'Уменьшить отступ',
        disabled: hasSelection ? false : true,
        icon: <FormatIndentDecreaseIcon />,
      },
      {
        name: 'indent',
        title: 'Увеличить отступ',
        disabled: hasSelection ? false : true,
        icon: <FormatIndentIncreaseIcon />,
      },
      {
        name: 'selectAll',
        title: 'Выделить все',
        disabled: hasSelection ? false : true,
        icon: <SelectAllIcon />,
      },
      {
        name: 'removeFormat',
        title: 'Удалить форматирование',
        disabled: hasSelection ? false : true,
        icon: <FormatClearIcon />,
      },
    ]
      .concat(tableControls)
      .concat([
        {
          name: 'undo',
          title: 'Откатить действие (Ctrl+Z)',
          disabled: hasSelection ? false : true,
          icon: <UndoIcon />,
        },
        {
          name: 'redo',
          title: 'Повторить действие (Ctrl+Y)',
          disabled: hasSelection ? false : true,
          icon: <RedoIcon />,
        },
      ])

    if (newContent) {
      buttons.push({
        name: 'save',
        title: 'Сохранить изменения',
        // disabled: hasSelection ? false : true,
        onClick: this.saveChanges,
        icon: (
          <SaveIcon
            style={{
              color: 'red',
            }}
          />
        ),
      })
    }

    return buttons
  }

  onButtonClick = (event) => {
    return document.execCommand(event.currentTarget.name)
  }

  closestInSelection(selection, selector) {
    const { focusNode } = selection

    let node = focusNode

    if (node.nodeType === Node.TEXT_NODE) {
      node = focusNode.parentNode
    }

    if (node && 'closest' in node) {
      return node.closest(selector)
    } else {
      return null
    }
  }

  /**
   * Вставляем новую строку в таблицу
   */
  insertTableRow(table, index, columnsCount = 1) {
    const tr = table.insertRow(index)

    if (tr) {
      let i = 0

      while (i < columnsCount) {
        this.insertTableCell(tr)

        i++
      }
    }
  }

  /**
   * Вставляем колонку
   */
  insertTableCell(tr, index) {
    tr.insertCell(index)
  }

  execCommand(aCommandName, aShowDefaultUI, aValueArgument) {
    return document.execCommand(aCommandName, aShowDefaultUI, aValueArgument)
  }

  renderToolbar() {
    if (this.readOnly()) {
      return null
    }

    const { classes, render_toolbar } = this.props

    const buttons = this.getToolbarButtons()

    if (!buttons.length) {
      return null
    }

    return render_toolbar ? (
      <div className={classes.toolbar}>
        <Grid container>{this.renderToolbarButtons(buttons)}</Grid>
      </div>
    ) : null
  }

  renderToolbarButtons(buttons) {
    const { classes } = this.props

    return buttons.map((n, index) => {
      const { name, icon, onClick, ...other } = n

      return (
        <Grid key={name || index} item>
          <IconButton
            className={classes.iconButton}
            name={name}
            onClick={onClick ? onClick : this.onButtonClick}
            {...other}
          >
            {icon}
          </IconButton>
        </Grid>
      )
    })
  }

  renderMainView(options = {}) {
    const { classes } = this.props

    if (!this.readOnly()) {
      options = {
        contentEditable: true,
        suppressContentEditableWarning: true,
        onFocus: (event) => this.tagOnFocus(event),
        onBlur: (event) => this.tagOnBlur(event),
        onKeyDown: (event) => this.tagOnKeyDown(event),
        ref: (el) => {
          this.container = el
        },
        ...options,
      }
    }

    // const content = super.renderMainView(options);
    const content = super.renderMainView(options)

    return this.readOnly() ? (
      content
    ) : (
      <div className={classes.root}>
        {this.renderToolbar()}
        {content}
      </div>
    )
  }

  prepareRootElementProps(props) {
    const { className, style } = this.props

    return {
      ...super.prepareRootElementProps(props),
      className,
      style,
    }
  }
}

// TODO move to separated file
export class ContentProxy extends Component {
  state = {
    // inEditMode: false,
  }

  static propTypes = {
    updateObject: PropTypes.func.isRequired,
    editable: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    TagEditor: PropTypes.func.isRequired,
  }

  static defaultProps = {
    TagEditor,
  }

  shouldComponentUpdate() {
    const { editable } = this.props

    return editable ? false : true
  }

  render() {
    const {
      components,
      editable,
      classes,
      initialContent,
      TagEditor,
      ...other
    } = this.props

    return (
      <TagEditor
        classes={editable ? classes : {}}
        className={editable ? classes.editor : undefined}
        mode="main"
        editable={editable}
        object={{
          props: {
            tag: 'div',
          },
          components: editable
            ? components && components.length
              ? components
              : initialContent
              ? initialContent
              : []
            : components || [],
        }}
        {...other}
      />
    )
  }
}

// TODO remove withStyles
export const tagEditorStyles = {
  root: {
    '& table': {
      '& td, th': {
        border: '#d3d3d3 1px dotted',
        minWidth: 10,
      },
    },
  },
  toolbar: {
    margin: '5px 0',
    border: '1px solid #ddd',
  },
  iconButton: {
    height: 34,
    width: 34,
  },
  icon: {
    height: '1rem',
    width: '1rem',
    position: 'absolute',

    '&.disabled': {
      color: 'rgba(0, 0, 0, 0.26)',
      fill: 'rgba(0, 0, 0, 0.26)',
    },
  },
  editor: {
    resize: 'vertical',
    overflow: 'auto',
    // height: 300,
    minHeight: '1rem',
    border: '1px solid #ddd',
    padding: 3,
    // flex: 1,
  },
}

// TODO move to separated file
export const ContentProxyStyled = withStyles(tagEditorStyles)(ContentProxy)

export class ContentEditor extends EditorComponent {
  static Name = 'ContentEditor'

  static propTypes = {
    read_only: PropTypes.bool.isRequired,
    initialContent: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        component: PropTypes.string.isRequired,
        props: PropTypes.object.isRequired,
        components: PropTypes.array.isRequired,
      })
    ),
    TagEditor: PropTypes.func.isRequired,
    render_toolbar: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    ...EditorComponent.defaultProps,

    /**
     * Если да, то нельзя редактировать содержимое никаким образом.
     */
    read_only: false,

    /**
     * Этот контент по-умолчанию только в режиме редактирования и когда
     * еще нет установленного значения
     */
    // "initialContent": [],
    initialContent: [
      {
        name: 'HtmlTag',
        component: 'HtmlTag',
        props: {
          tag: 'p',
        },
        components: [
          {
            name: 'HtmlTag',
            component: 'HtmlTag',
            props: {
              tag: 'br',
            },
            components: [],
          },
        ],
      },
    ],

    TagEditor,
    hide_wrapper_in_default_mode: true,
    render_toolbar: true,
  }

  renderPanelView(content) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">ContentEditor</div>
      )
    )
  }

  getRootElement() {
    return super.getRootElement()
  }

  canBeChild() {
    return false
  }

  prepareRootElementProps(props) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      initialContent,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      read_only,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updateObject,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      editable,
      ...other
    } = super.prepareRootElementProps(props)

    return other
  }

  renderChildren() {
    const inEditMode = this.inEditorMode()

    const {
      initialContent,
      read_only,
      TagEditor,
      render_toolbar,
    } = this.getComponentProps(this)

    const { components } = this.getObjectWithMutations()

    const editable = inEditMode && !read_only ? true : false
    // const editable = true;

    return editable ? (
      <ContentProxyStyled
        key={editable.toString()}
        updateObject={this.updateObject}
        components={components}
        editable={editable}
        initialContent={initialContent}
        TagEditor={TagEditor}
        render_toolbar={render_toolbar}
      />
    ) : (
      super.renderChildren()
    )
  }
}

export default ContentEditor
