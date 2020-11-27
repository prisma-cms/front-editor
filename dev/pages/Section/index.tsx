import React from 'react'
import Head from 'next/head'
import App, { FrontEditorProps } from '../../../src'
import object from './object'
import Section from '../../../src/components/Section'

const Components = [Section] as FrontEditorProps['Components']

const SectionPage: React.FC = (props) => {
  return (
    <>
      <Head>
        <title>@prisma-cms/front-editor Section</title>
        <meta name="description" content="Section component" />
      </Head>
      <App
        {...props}
        object={object}
        inEditMode={true}
        Components={Components}
      />
    </>
  )
}

export default SectionPage
