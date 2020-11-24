import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import '@prisma-cms/context';
import { NextRouter } from 'next/dist/client/router';
import URI from 'urijs';


declare module '@prisma-cms/context' {

  export type PrismaCmsContext = {
    uri: URI
    client: ApolloClient<NormalizedCacheObject>
    lang: string;
    localStorage: typeof global.localStorage | undefined
    UserLink: any
    router?: NextRouter
  }

}
