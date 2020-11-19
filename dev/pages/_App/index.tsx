import React, { useMemo } from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import theme from '../../theme'
import { useApollo } from '../../lib/apolloClient'
import Context, { PrismaCmsContext } from '@prisma-cms/context'
import Editor from '@prisma-cms/editor'
import { ApolloProvider } from '@apollo/client'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import URI from 'urijs'
import { muiTheme } from './MUI/theme'
import Pagination from '../../../src/common/Pagination'
import UserLink from '../../../src/common/Link/User'

export const GlobalStyle = createGlobalStyle`

  * {
    box-sizing: border-box;
    /* border: none !important; */
  }

  body, html {
    padding: 0;
    margin: 0;
    height: 100%;
  }

  body {

    #__next {
      height: 100%;
    }

    &.sb-show-main {

      &, #root {
        height: 100%;
      }
    }
  }
`

const App = ({ Component, pageProps }: AppProps) => {
  const apolloClient = useApollo(pageProps.initialApolloState)

  const contextValue = useMemo(() => {
    const context: PrismaCmsContext = {
      uri: new URI(),
      client: apolloClient,
      // router,
      // logout,
      // openLoginForm,
      lang: 'ru',
      // theme: muiTheme,
      localStorage: global.localStorage,
      // apiClientResetStore: async function () {
      //   if (!apolloClient['queryManager'].fetchCancelFns.size) {
      //     return apolloClient.resetStore().catch(console.error)
      //   }
      // },
      Pagination,
      UserLink,
      Editor,
    }

    return context
  }, [apolloClient])

  contextValue.Editor

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>

      <MuiThemeProvider
        theme={muiTheme}
        // For SSR only
        sheetsManager={
          typeof global.window === 'undefined' ? new Map() : undefined
        }
      >
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <ApolloProvider client={apolloClient}>
            <Context.Provider value={contextValue}>
              <Component {...pageProps} />
            </Context.Provider>
          </ApolloProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </>
  )
}

export default App
