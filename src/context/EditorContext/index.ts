import { createContext } from 'react'
import { EditorContextValue } from './interfaces'
export * from './interfaces'

export const EditorContext = createContext<EditorContextValue | null>(null)

export default EditorContext
