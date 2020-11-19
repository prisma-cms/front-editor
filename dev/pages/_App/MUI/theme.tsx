import { createMuiTheme } from 'material-ui/styles'

import pink from 'material-ui/colors/pink'
import { darken } from 'material-ui/styles/colorManipulator'
import blue from 'material-ui/colors/blue'

// const SheetsRegistry = require('react-jss').SheetsRegistry

// import { createGenerateClassName } from 'material-ui/styles'

// Так нельзя делать, так как счетчик классов щелкает. Надо на каждый запрос новый создавать
// Singleton
// import { sheetsRegistry } from 'src/pages/_App/MUI/theme';
// export const sheetsRegistry = new SheetsRegistry()

// export const sheetsManager = new Map()

export const getTheme = function (uiTheme: any) {
  const { direction, paletteType, typography, ...other } = uiTheme

  const theme = createMuiTheme({
    direction,
    nprogress: {
      color: paletteType === 'light' ? '#000' : '#fff',
    },
    palette: {
      primary: {
        ...blue,
        // main: "#ff0000",
      },
      secondary: {
        // Darken so we reach the AA contrast ratio level.
        main: darken(pink.A400, 0.08),
      },
      type: paletteType,
      // background: {
      //   default: "#fff",
      // },
    },
    typography: {
      // fontFamily: "'Open Sans', sans-serif,Tahoma, Helvetica",
      fontFamily: 'Roboto, sans-serif,Tahoma, Helvetica',
      fontSize: 14,
      display1: {
        color: '#222',
        fontSize: 30,
      },
      ...typography,
    },
    ...other,
  })

  return theme
}

// export const generateClassName = createGenerateClassName()

export const muiTheme = getTheme({})

// export default class ModxclubApp extends PrismaApp {
//   static defaultProps = {
//     ...PrismaApp.defaultProps,
//     Renderer,
//     queryFragments,
//     // lang: "ru",
//     themeOptions: {
//       direction: 'ltr',
//       paletteType: 'light',
//     },
//   }

//   getTheme() {
//     const { themeOptions } = this.state

//     return getTheme({
//       ...themeOptions,
//     })
//   }
// }
