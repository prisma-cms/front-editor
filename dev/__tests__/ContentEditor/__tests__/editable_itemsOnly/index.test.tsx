import React from 'react'
import { appRender, act } from '../../../../tests/utils'
import FrontEditor from '../../../../../src'
import { Components, object } from '../mock'

describe('CodeChallenge', () => {
  it('Render editable items only', async () => {
    const tree = appRender(
      <FrontEditor
        object={object}
        Components={Components}
        inEditMode={true}
        itemsOnly={true}
        className="FrontEditor"
      />
    )

    // expect(tree.container).toMatchSnapshot()
    // expect(tree.baseElement).toMatchSnapshot()

    const editor = tree.container.querySelector('.ContentEditor')

    expect(editor).not.toBeNull()

    // expect(editor).toMatchSnapshot()

    const tag = tree.container.querySelector('#HtmlTag')

    expect(tag).not.toBeNull()

    // expect(tag).toMatchSnapshot()

    const selection = document.getSelection()

    const range = document.createRange()
    tag && range.selectNode(tag)
    selection?.addRange(range)

    expect(selection?.rangeCount).toBe(1)

    // expect(selection?.rangeCount).toMatchSnapshot()

    // expect(selection).toMatchSnapshot()

    const section = tree.container.querySelector('#Section')

    expect(section).not.toBeNull()

    expect(section).toMatchSnapshot()

    act(() => {
      // button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      const p = document.createElement('p')
      p.appendChild(document.createTextNode('hello' + '\n'))
      section?.appendChild(p)
    })

    expect(section).toMatchSnapshot()

    const s1 = tree.container.querySelector('.s1')

    expect(s1).not.toBeNull()

    // expect(s1).toMatchSnapshot()

    expect(editor).toMatchSnapshot()
  })
})
