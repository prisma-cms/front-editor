import React, { useMemo } from 'react'
// import { action } from '@storybook/addon-actions'

import { Meta } from '@storybook/react'
import {
  Title,
  Subtitle,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from '@storybook/addon-docs/blocks'

import Component, { FrontEditorProps } from '../src'
import object from './object'

import Context from '@prisma-cms/context'

const title = '@prisma-cms/front-editor'

export const FrontEditor: React.FC<Partial<FrontEditorProps>> = ({
  inEditMode = false,
  ...other
}) => {
  const context = useMemo(() => {
    return {}
  }, [])

  return (
    <Context.Provider value={context}>
      <Component {...other} object={object} inEditMode={inEditMode}></Component>
    </Context.Provider>
  )
}

const args = {
  inEditMode: true,
}

export default {
  title,
  component: FrontEditor,
  argTypes: {},
  args,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>{title}</Title>
          <Subtitle></Subtitle>
          <Description></Description>
          <Primary></Primary>
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta
