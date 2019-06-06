
import React, {
  Component,
} from 'react';

import Context from '@prisma-cms/context';

import * as UI from "../ui";

class ContextProvider extends Component {

  static contextType = Context;


  // componentWillMount() {

  //   const {
  //     query,
  //     ...other
  //   } = this.context;

  //   this.newContext = {
  //     query: {
  //       ...query,
  //       ...this.prepareQuery(),
  //     },
  //     ...other
  //   }

  // }


  render() {

    const {
      children,
    } = this.props;

    let {
      query,
    } = this.context;

    Object.assign(this.context, {
      query: {
        ...query,
        ...this.prepareQuery(),
      },
      ...UI,
    });

    return <Context.Provider
      value={this.context}
    >
      {children || null}
    </Context.Provider>;

  }

  prepareQuery() {

    return {
      ...this.prepareUserQuery(),
      ...this.prepareTemplateQuery(),
    }
  }

  prepareUserQuery() {


    const {
      queryFragments,
    } = this.context;


    const {
      UserNoNestingFragment,
      BatchPayloadNoNestingFragment,
    } = queryFragments;



    const usersConnection = `
      query usersConnection (
        $where: UserWhereInput
        $orderBy: UserOrderByInput
        $skip: Int
        $after: String
        $before: String
        $first: Int
        $last: Int
      ){
        objectsConnection: usersConnection (
          where: $where
          orderBy: $orderBy
          skip: $skip
          after: $after
          before: $before
          first: $first
          last: $last
        ){
          aggregate{
            count
          }
          edges{
            node{
              ...UserNoNesting
            }
          }
        }
      }

      ${UserNoNestingFragment}
    `;


    const users = `
      query users (
        $where: UserWhereInput
        $orderBy: UserOrderByInput
        $skip: Int
        $after: String
        $before: String
        $first: Int
        $last: Int
      ){
        objects: users (
          where: $where
          orderBy: $orderBy
          skip: $skip
          after: $after
          before: $before
          first: $first
          last: $last
        ){
          ...UserNoNesting
        }
      }

      ${UserNoNestingFragment}
    `;


    const user = `
      query user (
        $where: UserWhereUniqueInput!
      ){
        object: user (
          where: $where
        ){
          ...UserNoNesting
        }
      }

      ${UserNoNestingFragment}
    `;


    const createUserProcessor = `
      mutation createUserProcessor(
        $data: UserCreateInput!
      ) {
        response: createUserProcessor(
          data: $data
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...UserNoNesting
          }
        }
      }

      ${UserNoNestingFragment}
    `;


    const updateUserProcessor = `
      mutation updateUserProcessor(
        $data: UserUpdateInput!
        $where: UserWhereUniqueInput!
      ) {
        response: updateUserProcessor(
          data: $data
          where: $where
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...UserNoNesting
          }
        }
      }

      ${UserNoNestingFragment}
    `;



    const deleteUser = `
      mutation deleteUser (
        $where: UserWhereUniqueInput!
      ){
        deleteUser(
          where: $where
        ){
          ...UserNoNesting
        }
      }
      ${UserNoNestingFragment}
    `;


    const deleteManyUsers = `
      mutation deleteManyUsers (
        $where: UserWhereInput
      ){
        deleteManyUsers(
          where: $where
        ){
          ...BatchPayloadNoNesting
        }
      }
      ${BatchPayloadNoNestingFragment}
    `;


    return {
      usersConnection,
      users,
      user,
      createUserProcessor,
      updateUserProcessor,
      deleteUser,
      deleteManyUsers,
    }

  }


  prepareTemplateQuery() {


    const {
      queryFragments,
    } = this.context;


    const {
      TemplateNoNestingFragment,
      UserNoNestingFragment,
      BatchPayloadNoNestingFragment,
      ProjectNoNestingFragment,
    } = queryFragments;


    const TemplateFragment = `
      fragment Template on Template {
        ...TemplateNoNesting
        CreatedBy{
          ...UserNoNesting
        }
        PrismaProject {
          ...ProjectNoNesting
        }
      }

      ${TemplateNoNestingFragment}
      ${UserNoNestingFragment}
      ${ProjectNoNestingFragment}
    `;


    const templatesConnection = `
      query templatesConnection (
        $where: TemplateWhereInput
        $orderBy: TemplateOrderByInput
        $skip: Int
        $after: String
        $before: String
        $first: Int
        $last: Int
      ){
        objectsConnection: templatesConnection (
          where: $where
          orderBy: $orderBy
          skip: $skip
          after: $after
          before: $before
          first: $first
          last: $last
        ){
          aggregate{
            count
          }
          edges{
            node{
              ...Template
            }
          }
        }
      }

      ${TemplateFragment}
    `;


    const templates = `
      query templates (
        $where: TemplateWhereInput
        $orderBy: TemplateOrderByInput
        $skip: Int
        $after: String
        $before: String
        $first: Int
        $last: Int
      ){
        objects: templates (
          where: $where
          orderBy: $orderBy
          skip: $skip
          after: $after
          before: $before
          first: $first
          last: $last
        ){
          ...Template
        }
      }

      ${TemplateFragment}
    `;


    const template = `
      query template (
        $where: TemplateWhereUniqueInput!
      ){
        object: template (
          where: $where
        ){
          ...Template
        }
      }

      ${TemplateFragment}
    `;


    const createTemplateProcessor = `
      mutation createTemplateProcessor(
        $data: TemplateCreateInput!
      ) {
        response: createTemplateProcessor(
          data: $data
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...Template
          }
        }
      }

      ${TemplateFragment}
    `;


    const updateTemplateProcessor = `
      mutation updateTemplateProcessor(
        $data: TemplateUpdateInput!
        $where: TemplateWhereUniqueInput!
      ) {
        response: updateTemplateProcessor(
          data: $data
          where: $where
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...Template
          }
        }
      }

      ${TemplateFragment}
    `;



    const deleteTemplate = `
      mutation deleteTemplate (
        $where: TemplateWhereUniqueInput!
      ){
        deleteTemplate(
          where: $where
        ){
          ...TemplateNoNesting
        }
      }
      ${TemplateNoNestingFragment}
    `;


    const deleteManyTemplates = `
      mutation deleteManyTemplates (
        $where: TemplateWhereInput
      ){
        deleteManyTemplates(
          where: $where
        ){
          ...BatchPayloadNoNesting
        }
      }
      ${BatchPayloadNoNestingFragment}
    `;


    return {
      templatesConnection,
      templates,
      template,
      createTemplateProcessor,
      updateTemplateProcessor,
      deleteTemplate,
      deleteManyTemplates,
    }

  }

}

export default ContextProvider;