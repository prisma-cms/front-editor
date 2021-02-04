import TagEditor from '.'
import { HtmlTagProps, HtmlTagState } from '../../Tag/HtmlTag'

export interface TagEditorProps extends HtmlTagProps {
  contentEditable?: boolean | undefined

  tag?: keyof JSX.IntrinsicElements | undefined

  editable?: boolean

  // classes?: Record<string, any>

  render_toolbar?: boolean

  updateObject: TagEditor['updateObject']
}

export interface TagEditorState extends HtmlTagState {
  // newContent?: {
  //   components: TagEditorProps["object"]["component"],
  // } | null;

  selection: Selection | null

  hasSelection: boolean
}
