import { EditorComponentProps, EditorComponentState } from "../../..";

export interface HtmlTagProps extends EditorComponentProps {

  contentEditable?: boolean | undefined;

  tag: string;

}

export interface HtmlTagState extends EditorComponentState {

  newContent: Partial<EditorComponentProps["object"]> | null;

}