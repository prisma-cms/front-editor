import React from 'react'
import Head from 'next/head'
import App from '../../../src/components/App'
import object from './object'

const createTemplate = async () => {
  console.error('called createTemplate')
  return new Error('called createTemplate')
}

const updateTemplate = async () => {
  console.error('called updateTemplate')
  return new Error('called updateTemplate')
}

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
      />
    </>
  )
}

export default ContentEditorPage
