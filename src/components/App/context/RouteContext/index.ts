import { createContext } from 'react'
import { RouteContextValue } from './interfaces'
export * from './interfaces'

const RouteContext = createContext<RouteContextValue>({})

export default RouteContext
