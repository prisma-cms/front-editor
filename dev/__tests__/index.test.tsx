import React from 'react'
import styled from 'styled-components'
import Component, { FrontEditorProps } from '../../src'

import { appRender } from '../tests/utils'

import object from '../pages/MainPage/object'

const border = '1px solid green'

const ComponentStyled = styled(Component)`
  color: ${({ theme }) => theme.colors.primary};

  border: ${border};
`

const props: FrontEditorProps = {
  inEditMode: true,
  object,
}

describe('Component', () => {
  it('Render default', () => {
    const tree = appRender(<Component {...props} />)
    expect(tree.container).toMatchSnapshot()
  })

  it('Render styled', () => {
    const tree = appRender(<ComponentStyled {...props} />)
    const node = tree.container.children[0]
    // expect(tree.container).toMatchSnapshot()
    expect(node).toMatchSnapshot()
    expect(node).toHaveStyleRule('border', border)
  })
})
