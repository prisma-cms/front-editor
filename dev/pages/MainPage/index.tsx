import React from 'react'
import Head from 'next/head'
import App from '../../../src'
import object from './object'
import allComponentsPreset from '../../../src/preset/all'

const createTemplate = async () => {
  console.error('called createTemplate')
  return new Error('called createTemplate')
}

const updateTemplate = async () => {
  console.error('called updateTemplate')
  return new Error('called updateTemplate')
}

const MainPage: React.FC = (props) => {
  return (
    <>
      <Head>
        <title>@prisma-cms/front-editor MainPage</title>
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
        Components={allComponentsPreset}
      />
    </>
  )
}

export default MainPage
