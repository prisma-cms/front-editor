import React from 'react'
import { EditorComponentObject } from '../../../../EditorComponent'

export interface ContentProxyContext {
  // updateObject: EditorComponent["updateObject"]

  newContent: EditorComponentObject['components'] | null

  // setNewContent: React.Dispatch<React.SetStateAction<EditorComponentObject["components"] | null>>
  setNewContent: (
    components: EditorComponentObject['components'] | null
  ) => void
}

/**
 * @deprecated
 */
export default React.createContext<ContentProxyContext | null>(null)
