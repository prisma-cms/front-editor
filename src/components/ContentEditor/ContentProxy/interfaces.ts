import { EditorComponentObject } from '../../..'
import EditorComponent from '../../../EditorComponent'
import { TagEditorProps } from '../TagEditor/interfaces'
// import TagEditor from "../TagEditor";
// import { TagEditorProps } from "../TagEditor/interfaces";

export type ContentProxyProps = {
  editable?: boolean

  components?: EditorComponentObject['components']

  initialContent?: EditorComponentObject[]

  updateObject?: EditorComponent['updateObject']

  mode?: TagEditorProps['mode']
} & Omit<TagEditorProps, 'object' | 'mode'>
