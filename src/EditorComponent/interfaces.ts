import { EditableObjectProps, EditableObjectState } from 'apollo-cms'
import EditorComponent from '.'
import { FrontEditorProps } from '..'

// export interface EditorComponentObject<
//   P extends HTMLElement = HTMLElement & {
//     text?: string
//   }
// > {

export interface ElementWithReactComponent extends Element {
  reactComponent?: EditorComponent

  /**
   * Используется при вставке новых компонентов в текущий HTML
   */
  editorComponentObject?: EditorComponentObject
}

export interface EditorComponentObject<
  P extends Record<string, any> & {
    text?: string
  } = Record<string, any>
> {
  __typename?: string | undefined
  id?: string
  name: string
  description?: string | null
  component: string | EditorComponent
  components: Array<EditorComponentObject<P>>
  // props: React.AllHTMLAttributes<P> & {
  props: P & {
    // TODO maybe replace with "content"
    text?: string | undefined | null

    tag?: keyof JSX.IntrinsicElements | undefined

    query?: string | undefined

    first?: number | undefined

    style?: React.CSSProperties
  } & Record<string, any>
  createdAt?: string
  updatedAt?: string
  CreatedBy?: any
}

export interface EditorComponentProps extends EditableObjectProps {
  mode: 'main' | 'panel' | 'settings' | 'add_child'

  object: EditorComponentObject
  _dirty?: Partial<EditorComponentProps['object']>

  props?: EditorComponentProps['object']['props']

  /**
   * Родительский инстанс компонента.
   * Нужен для того, чтобы получить доступ к родительским элементам
   */
  parent?: EditorComponent | null
  deletable?: boolean
  delete_component?: Function

  /**
   * Used for delete()
   */
  index?: number
  // data: PropTypes.object,

  /**
   * Не рендерить враппер в основном режиме
   */
  hide_wrapper_in_default_mode?: boolean

  /**
   * Рендерить ли бейджик
   */
  render_badge?: boolean

  /**
   * Может ли быть редактируемым во фронт-редакторе
   */
  can_be_edited?: boolean

  /**
   * @deprecated
   * Устанавливает заголовок для страницы
   */
  page_title?: string

  /**
   * @deprecated
   */
  page_status?: number

  maxStructureLengthView?: number

  className?: string

  // classes?: Record<string, any>

  createTemplate?: FrontEditorProps['createTemplate']
  updateTemplate?: FrontEditorProps['updateTemplate']
  deleteTemplate?: FrontEditorProps['deleteTemplate']

  /**
   * @deprecated
   */
  component?: string

  /**
   * @deprecated
   */
  style?: any

  /**
   * Handler on change component data
   */
  onChangeState?: EditorComponent['prepareDirty']

  /**
   * Show button in add children panel
   */
  render_add_button?: boolean

  updateObject?: EditorComponent['updateObject']

  contentEditable?: boolean | undefined
}

export interface EditorComponentState extends EditableObjectState {
  active: boolean
  hovered: boolean
  maxStructureLengthView: EditorComponentProps['maxStructureLengthView']

  /**
   * For HTMLTag
   */
  focused?: boolean
  components?: EditorComponentObject['components']
  //
}
