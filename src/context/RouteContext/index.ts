import { createContext } from 'react'
import { RouteContextValue } from './interfaces'
export * from './interfaces'

// TODO Check is used
/**
 * @deprecated
 */
export const RouteContext = createContext<RouteContextValue>({})

export default RouteContext
