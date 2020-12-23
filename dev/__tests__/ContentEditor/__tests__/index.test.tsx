import React from 'react'
import { appRender } from '../../../../dev/tests/utils'
import FrontEditor from '../../../../src'
import { Components, object } from './mock'

describe('CodeChallenge', () => {
  it('Render default', async () => {
    const tree = appRender(
      <FrontEditor
        object={object}
        Components={Components}
        className="ContentEditor"
      />
    )

    expect(tree.baseElement).toMatchSnapshot()

    const editor = tree.container.querySelector('.ContentEditor')

    expect(editor).not.toBeNull()

    expect(editor).toMatchSnapshot()
  })
})
