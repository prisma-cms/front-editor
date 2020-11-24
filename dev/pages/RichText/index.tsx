import React from 'react'
import Head from 'next/head'
import App, { FrontEditorProps } from '../../../src'
import object from './object'
import RichText from '../../../src/components/RichText'

const Components = [RichText] as FrontEditorProps["Components"];

const createTemplate = async () => {
  console.error('called createTemplate')
  return new Error('called createTemplate')
}

const updateTemplate = async () => {
  console.error('called updateTemplate')
  return new Error('called updateTemplate')
}

const RichTextPage: React.FC = (props) => {
  return (
    <>
      <Head>
        <title>@prisma-cms/front-editor RichText</title>
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

export default RichTextPage
