import React from 'react'

// import { useQuery } from "@apollo/client";
import { TemplateRendererProps } from './interfaces'

// TODO Restore

/**
 * Load template via API and render
 */
const TemplateRenderer: React.FC<TemplateRendererProps> = () => {
  return <>TemplateRenderer</>

  // const {
  //   client,
  //   templateQuery,
  //   Component,
  //    where,
  //    ...other
  // } = props;

  // const result = useQuery(templateQuery);

  // const {
  //   error,
  // } = result;

  // if(error) {
  //   return <h3>
  //     {error.message}
  //   </h3>
  // }

  // let { object } = other

  // const { data } = other

  // object = object !== undefined ? object : (data && data.object) || null

  // if (!object) {
  //   return null
  // }

  // const { id: templateId, props: objectProps, components } = object

  // return (
  //   <Component
  //     key={templateId}
  //     object={object}
  //     props={objectProps}
  //     components={components}
  //     {...other}
  //   />
  // )
}

export default TemplateRenderer
