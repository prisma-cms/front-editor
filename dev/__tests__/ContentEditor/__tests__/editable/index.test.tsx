import React from 'react'
import { appRender } from '../../../../tests/utils'
import FrontEditor from '../../../../../src'
import { Components, object } from '../mock'

describe('CodeChallenge', () => {
  it('Render editable items only', async () => {
    const tree = appRender(
      <FrontEditor object={object} Components={Components} inEditMode={true} />
    )

    expect(tree.container).toMatchSnapshot()
  })
})
