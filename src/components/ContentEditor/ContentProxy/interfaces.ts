import { EditorComponentObject } from '../../..'
import EditorComponent from '../../../EditorComponent'
import { TagEditorProps } from '../TagEditor/interfaces'
// import TagEditor from "../TagEditor";
// import { TagEditorProps } from "../TagEditor/interfaces";

export type ContentProxyProps = {
  experimental: boolean

  editable?: boolean

  components?: EditorComponentObject['components']

  initialContent?: EditorComponentObject[]

  updateObject?: EditorComponent['updateObject']

  mode?: TagEditorProps['mode']
} & Omit<TagEditorProps, 'object' | 'mode'>

/**
 * Edit mode
 */
export enum ContentProxyEditMode {
  // React,
  HTML = 'HTML',
}
