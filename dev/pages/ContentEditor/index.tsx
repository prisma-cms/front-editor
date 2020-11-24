import React from 'react'
import Head from 'next/head'
import App, { FrontEditorProps } from '../../../src'
import object from './object'
import Section from '../../../src/components/Section'
import ContentEditor from '../../../src/components/ContentEditor'
import HtmlTag from '../../../src/components/Tag/HtmlTag'

const createTemplate = async () => {
  console.error('called createTemplate')
  return new Error('called createTemplate')
}

const updateTemplate = async () => {
  console.error('called updateTemplate')
  return new Error('called updateTemplate')
}

const Components: FrontEditorProps["Components"] = [
  Section,
  ContentEditor,
  HtmlTag,
] as FrontEditorProps["Components"];

// TODO: Fix editing via chrome dev-tools
const ContentEditorPage: React.FC = (props) => {
  return (
    <>
      <Head>
        <title>@prisma-cms/front-editor ContentEditor</title>
        <meta
          name="description"
          content="Component boilerplate for prisma-cms"
        />
      </Head>
      <App
        {...props}
        object={object}
        createTemplate={createTemplate}
        updateTemplate={updateTemplate}
        inEditMode={true}
        Components={Components}
      />
    </>
  )
}

export default ContentEditorPage
