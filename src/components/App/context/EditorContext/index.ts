import { createContext } from 'react'
import { EditorContextValue } from './interfaces'
export * from './interfaces'

const EditorContext = createContext<EditorContextValue>({})

export default EditorContext
