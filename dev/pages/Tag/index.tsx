import React from 'react'
import Head from 'next/head'
import App, { FrontEditorProps } from '../../../src'
import object from './object'
import Section from '../../../src/components/Section'
import Tag from '../../../src/components/Tag'
import HtmlTag from '../../../src/components/Tag/HtmlTag'

const Components = [Section, Tag, HtmlTag] as FrontEditorProps['Components']

const SectionPage: React.FC = (props) => {
  return (
    <>
      <Head>
        <title>@prisma-cms/front-editor Tag</title>
        <meta name="description" content="Tag component" />
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
