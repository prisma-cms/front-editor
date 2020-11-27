import React from 'react'
import Head from 'next/head'
import App from '../../../src'

const EmptyEditor: React.FC = (props) => {
  return (
    <>
      <Head>
        <title>@prisma-cms/front-editor Empty Editor</title>
        <meta name="description" content="Test minimal bandles" />
      </Head>
      <App {...props} object={undefined} inEditMode={true} Components={[]} />
    </>
  )
}

export default EmptyEditor
