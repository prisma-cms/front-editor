/* eslint-disable react/forbid-foreign-prop-types */
import React, { Component } from 'react';
import PropTypes from "prop-types";

import Typography from 'material-ui/Typography';

import Tag from '../../Tag';
import EditorComponent from '../../..';
import EditableObject from '../EditableObject';
import { EditableObjectContext } from '../../../../context';

import withStyles from 'material-ui/styles/withStyles';
import IconButton from 'material-ui/IconButton';

import FormatClearIcon from "material-ui-icons/FormatClear";
import SelectAllIcon from "material-ui-icons/SelectAll";
import AlignLeftIcon from "material-ui-icons/FormatAlignLeft";
import AlignRightIcon from "material-ui-icons/FormatAlignRight";
import AlignJustifyIcon from "material-ui-icons/FormatAlignJustify";
import AlignCenterIcon from "material-ui-icons/FormatAlignCenter";
import FormatBoldIcon from "material-ui-icons/FormatBold";
import FormatItalicIcon from "material-ui-icons/FormatItalic";
import FormatUnderlinedIcon from "material-ui-icons/FormatUnderlined";
import FormatStrikethroughIcon from "material-ui-icons/FormatStrikethrough";
import FormatListBulletedIcon from "material-ui-icons/FormatListBulleted";
import FormatListNumberedIcon from "material-ui-icons/FormatListNumbered";
import FormatIndentIncreaseIcon from "material-ui-icons/FormatIndentIncrease";
import FormatIndentDecreaseIcon from "material-ui-icons/FormatIndentDecrease";
import RedoIcon from "material-ui-icons/Redo";
import UndoIcon from "material-ui-icons/Undo";

// const allMethods = [
//   "backColor",
//   "bold",
//   "contentReadOnly",
//   "copy",
//   "createLink",
//   "cut",
//   "decreaseFontSize",
//   "delete",
//   "enableInlineTableEditing",
//   "enableObjectResizing",
//   "fontName",
//   "fontSize",
//   "foreColor",
//   "formatBlock",
//   "forwardDelete",
//   "heading",
//   "hiliteColor",
//   "increaseFontSize",
//   "indent",
//   "insertBrOnReturn",
//   "insertHorizontalRule",
//   "insertHTML",
//   "insertImage",
//   "insertOrderedList",
//   "insertUnorderedList",
//   "insertParagraph",
//   "insertText",
//   "italic",
//   "justifyCenter",
//   "justifyFull",
//   "justifyLeft",
//   "justifyRight",
//   "outdent",
//   "paste",
//   "redo",
//   "removeFormat",
//   "selectAll",
//   "strikeThrough",
//   "subscript",
//   "superscript",
//   "underline",
//   "undo",
//   "unlink",
//   "useCSS ",
//   "styleWithCSS"
// ];

// document.queryCommandSupported(method)

// backColor,
// bold,
// copy,
// createLink,
// cut,
// delete,
// fontName,
// fontSize,
// foreColor,
// formatBlock,
// forwardDelete,
// hiliteColor,
// indent,
// insertHorizontalRule,
// insertHTML,
// insertImage,
// insertOrderedList,
// insertUnorderedList,
// insertParagraph,
// insertText,
// italic,
// justifyCenter,
// justifyFull,
// justifyLeft,
// justifyRight,
// outdent,
// redo,
// removeFormat,
// selectAll,
// strikeThrough,
// subscript,
// superscript,
// underline,
// undo,
// unlink,
// styleWithCSS"



class TagEditor extends Tag {

  static propTypes = {
    ...Tag.propTypes,
    editable: PropTypes.bool.isRequired,
    updateObject: PropTypes.func.isRequired,
    onEditStart: PropTypes.func.isRequired,
    onEditEnd: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
  }


  static defaultProps = {
    ...Tag.defaultProps,
    editable: false,
  }


  constructor(props) {

    super(props);

    this.state = {
      ...this.state,
      hasSelection: false,
    }

  }


  readOnly() {

    const {
      editable,
    } = this.props;

    return editable === true ? false : true;
  }



  tagOnFocus(event) {

    if (!this.readOnly()) {

      // this.editingStart();

      this.setActiveItem(this);

    }

    super.tagOnFocus();
  }


  // tagOnBlur(event) {

  //   return super.tagOnBlur(event);
  // }


  onSelectionChange = event => {

    const {
      container,
    } = this;

    const selection = document.getSelection();

    if (container) {

      let hasSelection = false;

      if (selection.containsNode(container, true)) {
        hasSelection = true;
      }

      this.setState({
        hasSelection,
      });
    }

  }


  componentDidMount() {

    if (!this.readOnly()) {

      document.addEventListener("selectionchange", this.onSelectionChange);

    }

    super.componentDidMount && super.componentDidMount();
  }


  componentWillUnmount() {

    document.removeEventListener("selectionchange", this.onSelectionChange);

    super.componentWillUnmount && super.componentWillUnmount();
  }


  updateObject(data) {

    const {
      updateObject,
    } = this.props;

    updateObject(data);

  }



  tagOnKeyDown(event) {

  }


  getToolbarButtons() {

    const {
      hasSelection,
    } = this.state;

    return [
      {
        key: "bold",
        title: "Жирный текст",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('bold'),
        icon: <FormatBoldIcon />,
      },
      {
        key: "italic",
        title: "Наклонный текст",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('italic'),
        icon: <FormatItalicIcon />,
      },
      {
        key: "underline",
        title: "Подчеркнутый текст",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('underline'),
        icon: <FormatUnderlinedIcon />,
      },
      {
        key: "strikeThrough",
        title: "Перечеркнутый текст",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('strikeThrough'),
        icon: <FormatStrikethroughIcon />,
      },
      {
        key: "justifyLeft",
        title: "Выровнить влево",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('justifyLeft'),
        icon: <AlignLeftIcon />,
      },
      {
        key: "justifyCenter",
        title: "Выровнить по центру",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('justifyCenter'),
        icon: <AlignCenterIcon />,
      },
      {
        key: "justifyRight",
        title: "Выровнить вправо",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('justifyRight'),
        icon: <AlignRightIcon />,
      },
      {
        key: "justifyFull",
        title: "Выровнить на всю ширину",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('justifyFull'),
        icon: <AlignJustifyIcon />,
      },
      {
        key: "insertUnorderedList",
        title: "Ненумерованный список",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('insertUnorderedList'),
        icon: <FormatListBulletedIcon />,
      },
      {
        key: "insertOrderedList",
        title: "Нумерованный список",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('insertOrderedList'),
        icon: <FormatListNumberedIcon />,
      },
      {
        key: "outdent",
        title: "Уменьшить отступ",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('outdent'),
        icon: <FormatIndentDecreaseIcon />,
      },
      {
        key: "indent",
        title: "Увеличить отступ",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('indent'),
        icon: <FormatIndentIncreaseIcon />,
      },
      {
        key: "selectAll",
        title: "Выделить все",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('selectAll'),
        icon: <SelectAllIcon />,
      },
      {
        key: "removeFormat",
        title: "Удалить форматирование",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('removeFormat'),
        icon: <FormatClearIcon />,
      },
      {
        key: "undo",
        title: "Откатить действие (Ctrl+Z)",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('undo'),
        icon: <UndoIcon />,
      },
      {
        key: "redo",
        title: "Повторить действие (Ctrl+Y)",
        disabled: hasSelection ? false : true,
        onClick: event => document.execCommand('redo'),
        icon: <RedoIcon />,
      },

    ];

  }


  renderToolbar() {

    if (this.readOnly()) {
      return null;
    }

    const {
      Grid,
    } = this.context;

    const {
      classes,
    } = this.props;

    const buttons = this.getToolbarButtons();

    if (!buttons.length) {
      return null;
    }

    return <div
      className={classes.toolbar}
    >
      <Grid
        container
        spacing={8}
      >

        {buttons.map((n, index) => {

          const {
            key,
            icon,
            ...other
          } = n;

          return <Grid
            key={key || index}
            item
          >
            <IconButton
              className={classes.iconButton}
              {...other}
            >
              {icon}
            </IconButton>
          </Grid>;
        })}

      </Grid>
    </div>

  }


  renderMainView(options = {}) {

    const {
      classes,
    } = this.props;


    if (!this.readOnly()) {

      options = {
        contentEditable: true,
        suppressContentEditableWarning: true,
        // style: {
        //   minHeignt: "1rem",
        //   border: "1px dotted #ddd",
        //   ...options.style,
        // },
        onInput: event => this.tagOnInput(event),
        onFocus: event => this.tagOnFocus(event),
        onBlur: event => this.tagOnBlur(event),
        onKeyDown: event => this.tagOnKeyDown(event),
        ref: el => this.container = el,
        ...options,
      }

    }

    const content = super.renderMainView(options);

    return this.readOnly() ?
      content :
      <div
        className={classes.root}
      >
        {this.renderToolbar()}
        {content}
      </div>

  }

}


export class ContentProxy extends Component {

  state = {
    inEditMode: false,
  }

  static propTypes = {
    updateObject: PropTypes.func.isRequired,
    editable: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
  }


  shouldComponentUpdate() {

    const {
      editable,
    } = this.props;

    return editable ? false : true;
  }


  render() {

    const {
      components,
      editable,
      classes,
      initialContent,
      ...other
    } = this.props;

    return <TagEditor
      classes={editable ? classes : {}}
      className={editable ? classes.editor : undefined}
      mode="main"
      editable={editable}
      object={{
        props: {
          tag: "div",
        },
        components: editable ?
          (components && components.length ? components : initialContent ? initialContent : []) :
          components || [],
      }}
      {...other}
    />

  }

}


const ContentProxyStyled = withStyles({
  root: {
    // resize: "vertical",
    // height: 300,
    // display: "flex",
    // flexDirection: "column",
  },
  toolbar: {
    margin: "5px 0",
    border: "1px solid #ddd",
  },
  iconButton: {
    height: 34,
    width: 34,
  },
  editor: {
    resize: "vertical",
    overflow: "auto",
    // height: 300,
    // minHeight: "1rem",
    border: "1px solid #ddd",
    padding: 3,
    // flex: 1,
  },
})(ContentProxy);


export class ContentEditor extends EditorComponent {

  static Name = 'ContentEditor';


  static propTypes = {
    read_only: PropTypes.bool.isRequired,
    initialContent: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      component: PropTypes.string.isRequired,
      props: PropTypes.object.isRequired,
      components: PropTypes.array.isRequired,
    }))
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
    "initialContent": [{
      "name": "Tag",
      "component": "Tag",
      "props": {
        "tag": "p"
      },
      "components": [{
        "name": "Tag",
        "component": "Tag",
        "props": {
          "tag": "br"
        },
        "components": []
      }]
    }],
  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        ContentEditor
      </div>
    );
  }


  getRootElement() {

    return super.getRootElement();
  }


  canBeParent(parent) {

    return super.canBeParent(parent) && this.findInParent(parent, parent => parent instanceof EditableObject);
  }


  canBeChild(child) {

    return false;
  }


  renderChildren() {

    // const {
    // } = this.context;

    const {
      inEditMode,
    } = this.getEditorContext();

    const {
      name,
      initialContent,
      read_only,
      // ...other
    } = this.getComponentProps(this);


    if (!name) {

      if (inEditMode) {
        return <Typography
          color="error"
        >
          Property "name" required
        </Typography>
      }
      else {
        return null;
      }

    }


    return <EditableObjectContext.Consumer>
      {editableObjectContext => {

        const {
          getObjectWithMutations,
          updateObject,
          inEditMode: objectInEditMode,
        } = editableObjectContext;


        if (!getObjectWithMutations) {

          if (inEditMode) {

            return <Typography
              color="error"
            >
              getObjectWithMutations undefined
            </Typography>

          }
          else {
            return null;
          }

        }


        const object = getObjectWithMutations();


        if (!object) {

          if (inEditMode) {

            return <Typography
              color="error"
            >
              Не был получен объект
            </Typography>

          }
          else {
            return null;
          }

        }


        const {
          [name]: components,
        } = object;

        const editable = objectInEditMode && !read_only ? true : false;

        return <ContentProxyStyled
          key={editable.toString()}
          updateObject={({ components }) => {

            // console.log("components", components);

            updateObject({
              [name]: components,
            });

          }}
          components={components}
          editable={editable}
          initialContent={initialContent}
        />;


      }}
    </EditableObjectContext.Consumer>
  }

}

export default ContentEditor;