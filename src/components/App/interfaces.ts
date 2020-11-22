import EditorComponent from './components'
import { EditorComponentObject } from './components/interfaces'
import { EditorContextValue } from './context/EditorContext/interfaces'

type ComponentsArray = Array<typeof EditorComponent>

export interface FrontEditorProps {
  object: EditorComponentObject | undefined

  classes?: Record<string, any>

  className?: string

  inEditMode?: boolean

  onChange?: (components: EditorComponentObject[]) => void

  // toolbar?: React.Component;

  // TODO: Fix types
  createTemplate?: (options: any) => Promise<any>
  updateTemplate?: (options: any) => Promise<any>
  deleteTemplate?: (options: any) => Promise<any>

  Components?: ComponentsArray
  CustomComponents?: ComponentsArray
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
