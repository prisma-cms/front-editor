import React from 'react'
import { render } from 'dev/tests/utils'
import styled from 'styled-components'
import theme from '..'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
    }
  },
}))

const border = '1px solid green'

const DivStyled = styled.div`
  color: ${({ theme }) => theme.colors.primary};

  border: ${border};
`

const Component: React.FC = (props) => {
  const { children } = props

  return <DivStyled>Text {children}</DivStyled>
}

describe('Theme', () => {
  it('Render Styled component', () => {
    const tree = render(<Component></Component>)

    const node = tree.container.children[0]

    expect(tree.baseElement.parentNode).toMatchSnapshot()

    expect(node).toMatchSnapshot()

    expect(node).toHaveStyleRule('color', theme.colors.primary)

    expect(node).toHaveStyleRule('border', border)
  })
})
