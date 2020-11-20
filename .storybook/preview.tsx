import React from 'react'
import { addDecorator, Parameters } from '@storybook/react'
import theme from '../dev/theme'
import { ThemeProvider } from 'styled-components'
import { makeDecorator } from '@storybook/addons'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`

  body, html {
    padding: 0;
    margin: 0;
    height: 100%;
  }

  body {
    &.sb-show-main {

      &, #root {
        height: 100%;
      }
    }
  }
`

export const parameters: Parameters = {
  layout: 'fullscreen',
  options: {
    storySort: (a: any, b: any) => {
      // We want the Welcome story at the top
      if (b[1].kind === 'Welcome') {
        return 1
      }

      // Sort the other stories by ID
      // https://github.com/storybookjs/storybook/issues/548#issuecomment-530305279
      return a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, { numeric: true })
    },
  },
}

addDecorator(
  makeDecorator({
    name: 'withSomething',
    parameterName: 'something',
    wrapper: (storyFn, context) => {
      return (
        <>
          <GlobalStyle />
          <ThemeProvider theme={theme}>{storyFn(context)}</ThemeProvider>
        </>
      )
    },
  })
)
