import EditorComponent, {
  EditorComponentProps,
  EditorComponentObject,
} from './EditorComponent'
import { EditorContextValue } from './context/EditorContext/interfaces'

type ComponentsArray = Array<typeof EditorComponent>

export interface FrontEditorProps {
  object: EditorComponentObject | undefined

  // classes?: Record<string, any>

  className?: string

  inEditMode?: boolean

  onChange?: (components: EditorComponentObject[]) => void

  // toolbar?: React.Component;

  // TODO: Fix types
  createTemplate?: (options: any) => Promise<any>
  updateTemplate?: (options: any) => Promise<any>
  deleteTemplate?: (options: any) => Promise<any>

  Components: ComponentsArray
  // CustomComponents?: ComponentsArray

  /**
   * Show items only
   */
  itemsOnly?: boolean

  // TODO: add checking for invoke only on root component
  /**
   * Handle on change components data
   */
  onChangeState?: EditorComponentProps['onChangeState']
}

export interface FrontEditorState {
  /**
   * Элемент в панели управления, который может быть перетянут на страницу
   */
  dragItem: EditorComponent | EditorComponentObject | null

  /**
   * Текущий элемент на странице, в который может быть заброшен новый элемент
   */
  dragTarget: EditorComponent | null

  /**
   * Текущий элемент на странице, свойства которого можно редактировать (выбирается по клику)
   */
  activeItem: EditorComponent | null

  /**
   * Элемент, на который наведена мышь
   */
  hoveredItem: EditorComponent | null

  /**
   * Компоненты редактора
   */
  Components: ComponentsArray

  /**
   * Открыта ли панель с каталогом шаблонов
   */
  templatesOpened: boolean

  /**
   * Основной контекст фронт-редактора
   */
  editorContext: EditorContextValue
}
