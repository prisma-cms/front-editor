import React from 'react'
import { AppProps } from './interfaces'

export * from './interfaces'

const App: React.FC<AppProps> = (props) => {
  return <h2 {...props}>My awesome component</h2>
}

export default App
