import '@prisma-cms/context';
import URI from 'urijs';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import Editor from '@prisma-cms/editor';
import { NextRouter } from 'next/dist/client/router';

declare module '@prisma-cms/context' {


  import Pagination from '../../../common/Pagination';
  
  export type PrismaCmsContext = { 
    
    client: ApolloClient<NormalizedCacheObject>

    lang: string;

    localStorage: typeof global.localStorage | undefined;

    uri: URI;

    Pagination: any;

    UserLink: any

    Editor: typeof Editor

    router?: NextRouter
  }

}
