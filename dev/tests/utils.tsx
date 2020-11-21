import React, { ReactElement, useEffect, useMemo } from 'react'
import ReactDOMServer from 'react-dom/server'
import { render as baseRender, RenderResult } from '@testing-library/react'
import App from '../pages/_App'
import theme from '../theme'
import { ThemeProvider } from 'styled-components'

// For handle css
import 'jest-styled-components'

import { HeadManagerContext } from 'next/dist/next-server/lib/head-manager-context'

/**
 * Base renderer from @testing-library/react
 */
export { baseRender }

// re-export everything
export * from '@testing-library/react'

/**
 * Collect tags from next/head
 * https://github.com/vercel/next.js/discussions/11060
 */
const HeadProvider: React.FC = ({ children }) => {
  let head: JSX.Element[]

  useEffect(() => {
    global.document.head.insertAdjacentHTML(
      'afterbegin',
      ReactDOMServer.renderToString(<>{head}</>) || ''
    )
  })

  return (
    <HeadManagerContext.Provider
      value={{
        updateHead: (state) => {
          head = state
        },
        mountedInstances: new Set(),
      }}
    >
      {children}
    </HeadManagerContext.Provider>
  )
}

/**
 * Renderer with main App
 */
const AppProvider: React.FC = ({ children }: any, pageProps: any) => {
  const Component = useMemo(() => {
    return () => children
  }, [children])

  return (
    <HeadProvider>
      {/* @ts-ignore */}
      <App Component={Component} pageProps={pageProps} />
    </HeadProvider>
  )
}
export const appRender = (ui: ReactElement) => {
  return baseRender(ui, { wrapper: AppProvider }) as RenderResult
}

/**
 * Renderer with Theme
 */
const WithThemeProvider: React.FC = ({ children }: any) => {
  return (
    <HeadProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </HeadProvider>
  )
}

export const render = (ui: ReactElement) => {
  return baseRender(ui, { wrapper: WithThemeProvider }) as RenderResult
}
