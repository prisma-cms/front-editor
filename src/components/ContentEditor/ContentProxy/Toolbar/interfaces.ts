import EditorComponent from "../../../../EditorComponent";
import { HtmlTagProps } from '../../../Tag/HtmlTag'
import { ContentProxyEditMode } from '../interfaces'

export type ContentEditorToolbarButton = {
  name: string
  title: string
  disabled: boolean
  icon: JSX.Element
  onClick?: () => boolean
  className?: string
}

export interface ContentEditorToolbarProps {
  // selection: Selection | null;

  closestInSelection: <E extends HTMLElement>(selector: string) => E | null

  updateObject: EditorComponent["updateObject"]

  newContent: HtmlTagProps['object']['components'] | null

  saveChanges: () => boolean

  editMode: ContentProxyEditMode | null

  setEditMode: React.Dispatch<React.SetStateAction<ContentProxyEditMode | null>>

  contentEditableContainer: HTMLDivElement | null
}
