import { createContext } from 'react'
import { EditableObjectContextValue } from './interfaces'
export * from './interfaces'

export const EditableObjectContext = createContext<EditableObjectContextValue>(
  {}
)

export default EditableObjectContext
