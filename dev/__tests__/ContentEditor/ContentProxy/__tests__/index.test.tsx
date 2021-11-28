import React from 'react'
import FrontEditor from '../../../../../src'
import { baseRender, act } from '../../../../tests/utils'
import { object, Components } from './mock'

const Wrapper: React.FC = ({ children }) => {
  return (
    <FrontEditor object={object} inEditMode={true} Components={Components}>
      {children}
    </FrontEditor>
  )
}

describe('ContentProxy', () => {
  it('Render default view', async () => {
    // const tree = baseRender(<Wrapper>
    //   <ContentProxy
    //     className="ContentProxy"
    //   />
    // </Wrapper>)

    const tree = baseRender(<Wrapper />)

    expect(tree.baseElement).toMatchSnapshot()

    const contentEditor = tree.baseElement.querySelector('.ContentEditor')

    expect(contentEditor).not.toBeNull()

    expect(contentEditor).toMatchSnapshot()

    // const editorContainer = tree.baseElement.querySelector(".ContentProxy") as HTMLElement | null
    const editorContainer =
      tree.baseElement.querySelector<HTMLElement>('.ContentProxy')

    expect(editorContainer).not.toBeNull()

    expect(editorContainer).toMatchSnapshot()

    // expect(editorContainer?.attributes?.getNamedItem("contenteditable")?.value).toBe("false");

    /**
     * Invoke onFocus
     */
    act(() => {
      // const event = editorContainer?.dispatchEvent(new FocusEvent('focus'));
      // console.log('event', event);
      editorContainer?.focus()
    })

    expect(editorContainer).toMatchSnapshot()
  })
})
