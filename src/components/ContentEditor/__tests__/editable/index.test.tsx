import React from 'react'
import { appRender } from '../../../../../dev/tests/utils'
import FrontEditor from '../../../..'
import { Components, object } from '../mock'

describe('CodeChallenge', () => {
  it('Render editable items only', async () => {
    const tree = appRender(
      <FrontEditor object={object} Components={Components} inEditMode={true} />
    )

    expect(tree.container).toMatchSnapshot()
  })
})
