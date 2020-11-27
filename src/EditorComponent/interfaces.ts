import { EditableObjectProps, EditableObjectState } from 'apollo-cms/dist'
import EditorComponent from '.'
import { FrontEditorProps } from '..'

// export interface EditorComponentObject<
//   P extends HTMLElement = HTMLElement & {
//     text?: string
//   }
// > {

export interface EditorComponentObject<
  P extends Record<string, any> & {
    text?: string
  } = Record<string, any>
> {
  __typename?: string | undefined
  id?: string
  name: string
  description?: string
  component: string | EditorComponent
  components: EditorComponentObject[]
  // props: React.AllHTMLAttributes<P> & {
  props: P & {
    // TODO maybe replace with "content"
    text?: string | undefined | null

    tag?: string | undefined

    query?: string | undefined

    first?: number | undefined

    style?: Record<string, any> | null | undefined
  } & Record<string, any>
  createdAt?: string
  updatedAt?: string
  CreatedBy?: any
}

export interface EditorComponentProps extends EditableObjectProps {
  mode: 'main' | 'panel' | 'settings' | 'add_child'

  object: EditorComponentObject
  _dirty: Partial<EditorComponentObject>

  props?: EditorComponentObject['props']

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

  classes?: Record<string, any>

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
  onChangeState?: (data: EditorComponentProps["_dirty"]) => EditorComponentProps["_dirty"];
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
