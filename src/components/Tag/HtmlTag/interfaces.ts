import {
  EditorComponentProps,
  EditorComponentState,
} from '../../../EditorComponent'

export interface HtmlTagProps extends EditorComponentProps {
  tag?: keyof JSX.IntrinsicElements | undefined
}

export interface HtmlTagState extends EditorComponentState {
  // newContent?: Partial<EditorComponentProps['object']> | null

  newContent?: {
    components: HtmlTagProps['object']['components']
  } | null
}
