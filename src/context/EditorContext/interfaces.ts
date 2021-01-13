import { FrontEditor, FrontEditorProps, FrontEditorState } from '../..'
// import TemplateRenderer from '../../TemplateRenderer'

export interface EditorContextValue {
  Components: FrontEditorProps['Components']

  // classes?: FrontEditorProps['classes']

  inEditMode: FrontEditorProps['inEditMode']

  /**
   * @deprecated
   */
  activeItem?: FrontEditorState['activeItem']
  /**
   * @deprecated
   */
  dragItem?: FrontEditorState['dragItem']
  /**
   * @deprecated
   */
  dragTarget?: FrontEditorState['dragTarget']
  /**
   * @deprecated
   */
  hoveredItem?: FrontEditorState['hoveredItem']

  registerMountedComponent?: FrontEditor['registerMountedComponent']
  unregisterMountedComponent?: FrontEditor['unregisterMountedComponent']
  setActiveItem: FrontEditor['setActiveItem']
  // updateObject?: FrontEditor['updateObject']
  getDragItem: FrontEditor['getDragItem']
  getDragTarget: FrontEditor['getDragTarget']
  getActiveItem: FrontEditor['getActiveItem']
  getHoveredItem: FrontEditor['getHoveredItem']
  getSettingsViewContainer: FrontEditor['getSettingsViewContainer']
  onDragStart: FrontEditor['onDragStart']
  onDragEnd: FrontEditor['onDragEnd']
  setDragTarget: FrontEditor['setDragTarget']
  setHoveredItem: FrontEditor['setHoveredItem']
  forceUpdate?: FrontEditor['forceUpdate']
  getActionPanel: FrontEditor['getActionPanel']

  /**
   * @deprecated use next/head instead
   */
  setPageMeta?: FrontEditor['setPageMeta']

  // TemplateRenderer?: typeof TemplateRenderer

  /**
   * Danger! If true, can user <script> in HtmlTag component
   */
  allowScriptTags: boolean
}
