import React, { useCallback, useMemo } from 'react'
import { action } from '@storybook/addon-actions'

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

import Component, { FrontEditorProps } from '../../src'
import object from './object'

import Context from '@prisma-cms/context'
import { EditorComponentProps } from '../../src/EditorComponent'
import allComponentsPreset from '../../src/preset/all'

const title = '@prisma-cms/front-editor/Editor'

export const FrontEditor: React.FC<Partial<FrontEditorProps>> = ({
  inEditMode = false,
  ...other
}) => {
  const context = useMemo(() => {
    return {}
  }, [])

  const onChangeState = useCallback((data: EditorComponentProps['_dirty']) => {
    action('onChange')(data)

    return data
  }, [])

  return (
    <Context.Provider value={context}>
      <Component
        {...other}
        object={object}
        inEditMode={inEditMode}
        onChangeState={onChangeState}
        Components={allComponentsPreset}
      ></Component>
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
