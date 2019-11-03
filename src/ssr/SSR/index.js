import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
// import Express from 'express';
import { StaticRouter } from 'react-router';
import { InMemoryCache } from "apollo-cache-inmemory";

import fetch from 'node-fetch';

import React from 'react';

import { getDataFromTree } from "react-apollo"

import ReactDOM from 'react-dom/server';


import {
  // createMuiTheme,
  createGenerateClassName,
} from 'material-ui/styles';

import MainApp from '../../src/dev/App';


import chalk from "chalk";

// import { MuiThemeProvider } from 'material-ui/styles';

import URI from 'urijs';

// import moment from "moment";

// import htmlToJson from 'html-to-json';

import cheerio from "cheerio";

var XMLWriter = require('xml-writer');

const { Prisma } = require('prisma-binding')

// eslint-disable-next-line no-unused-vars
let api;

const JssProvider = require('react-jss').JssProvider;
const SheetsRegistry = require('react-jss').SheetsRegistry;

// const theme = createMuiTheme({
// });

const fs = require("fs");

const PWD = process.env.PWD;

const HTML = fs.readFileSync(`${PWD}/build/index.html`, "utf8");


let apiSchema;


class Server {


  constructor(props = {}) {

    const {
      App,
      ...other
    } = props;

    const schemaFile = "src/schema/generated/api.graphql";

    if (fs.existsSync(schemaFile)) {

      api = new Prisma({
        typeDefs: schemaFile,
        endpoint: 'http://localhost:4000',
        secret: 'mysecret123',
        debug: false,
        ...other,
      });

    }


    this.App = App || MainApp;

    this.props = props;

  }


  middleware = async (req, res) => {

    /**
     * Надо сбрасывать этот объект, чтобы не попадали результаты прошлого выполнения
     */
    global.document = undefined;


    const protocol = req.headers["server-protocol"] || req.protocol || "http";

    // console.log("req.headers", req.headers);

    // console.log("protocol", protocol);

    const host = req.get('host');

    const url = `${protocol}://${host}${req.url}`;

    // console.log("url", url);

    const uri = new URI(url);


    const urlPath = uri.path();


    let response;

    switch (urlPath.toLowerCase()) {


      case "/sitemap.xml":

        response = await this.renderSitemap(req, res, uri)
          .catch(error => {
            console.error(chalk.red("Server error"), error);
            res.status(500);
            res.end(error.message);
            ;
          });

        break;

      default: response = await this.renderHTML(req, res, uri)
        .catch(error => {
          console.error(chalk.red("Server error"), error);
          res.status(500);
          res.end(error.message);
          ;
        });

    }

    return response;

  };


  async renderHTML(req, res) {


    let context = {}


    const {
      host: hostname,
      protocol = "http:",
      // referer,
    } = req.headers;

    const host = req.get('host');

    const uri = new URI(`${protocol}//${host}${req.url}`);


    const {
      App: MainApp,
      props: {
        // queryFragments,
        apolloCaches,
      },
    } = this;


    const client = new ApolloClient({
      ssrMode: true,
      // Remember that this is the interface the SSR server will use to connect to the
      // API server, so we need to ensure it isn't firewalled, etc
      link: createHttpLink({
        uri: `${protocol}//${hostname}/api/`,
        credentials: 'same-origin',
        headers: {
          cookie: req.header('Cookie'),
        },
        fetch,
      }),
      cache: new InMemoryCache(),
    });

    const sheets = new SheetsRegistry();

    const App = (
      <JssProvider
        registry={sheets}
        generateClassName={createGenerateClassName()}
      >
        {/* <MuiThemeProvider
          theme={theme}
          sheetsManager={new Map()}
        > */}
        <ApolloProvider client={client}>
          <StaticRouter location={req.url} context={context}>
            <MainApp
              sheetsManager={new Map()}
              // queryFragments={queryFragments}
              uri={uri}
              // onSchemaLoad={schema => {

              //   // console.log("onSchemaLoad", schema);
              //   // console.log(chalk.green("onSchemaLoad"));

              //   if (!apiSchema && schema) {
              //     apiSchema = `window.__PRISMA_CMS_API_SCHEMA__=${JSON.stringify(schema).replace(/</g, '\\u003c')};`;
              //   }

              // }}
              onSchemaLoad={clientSchema => {

                // console.log(chalk.green("onSchemaLoad loaded"));
                // console.log("onSchemaLoad", schema);
                // console.log(chalk.green("onSchemaLoad"));

                if (!apiSchema && clientSchema) {
                  // apiSchema = `window.__PRISMA_CMS_API_SCHEMA_DSL__=${JSON.stringify(clientSchema).replace(/</g, '\\u003c')};`;
                }

              }}
            />
          </StaticRouter>
        </ApolloProvider>
        {/* </MuiThemeProvider> */}
      </JssProvider>
    );



    await getDataFromTree(App)
      .then(async () => {
        // We are ready to render for real
        const content = await ReactDOM.renderToString(App);
        const initialState = await client.extract();


        let {
          title,
          description,
          status,
          canonical,
        } = global.document || {};


        status = status || 200;


        function Html({
          content,
          state,
          sheets = "",
        }) {


          // console.log('Object.keys(state)', Object.keys(state));



          const $ = cheerio.load(HTML, {
            decodeEntities: false,
          })

          // console.log(chalk.green("$"), $);

          /**
           * Remove noscript notifi
           */

          $("noscript#react-noscript-notify").remove();

          let root = $("#root");


          let head = $("head");

          if (title) {
            head.find("title").html(title);
          }

          // description = "Sdfdsfsdf";

          if (description) {

            let meta = head.find("meta[name=description]");

            if (!meta.length) {

              meta = $(`<meta 
                name="description"
              />`)

              head.append(meta);
            }


            // console.log(chalk.green("meta"), meta);

            meta.attr("content", description);
          }

          if (canonical) {

            let meta = head.find("link[rel=canonical]");

            if (!meta.length) {

              meta = $(`<link 
                rel="canonical"
              />`)

              head.append(meta);
            }

            meta.attr("href", canonical);
          }



          root.before(`<style
            id="server-side-jss"
          >
            ${sheets.toString()}
          </style>`);


          const apolloStateId = new Date().getTime() * Math.random();

          // console.log("apolloStateId", apolloStateId);

          root.after(`<script type="text/javascript">
            ${`window.__APOLLO_STATE_ID__=${apolloStateId};`}
          </script>`);

          apolloCaches[apolloStateId] = state;


          setTimeout(() => {
            delete apolloCaches[apolloStateId]
          }, 60 * 5 * 1000);

          // root.after(`<script type="text/javascript">
          //   ${`window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`}
          // </script>`);



          if (apiSchema) {

            root.after(`<script type="text/javascript">
              ${apiSchema}
            </script>`);

          }

          // console.log("content", content);

          root.html(content);

          return $.html();

          // const response = (
          //   <html>
          //     <head
          //       dangerouslySetInnerHTML={{
          //         __html: headHTML,
          //       }}
          //     >


          //     </head>

          //     <body>
          //       <div id="root" dangerouslySetInnerHTML={{ __html: content }} />

          //     </body>
          //   </html>
          // );

        }


        const output = Html({
          content,
          state: initialState,
          sheets,
        });

        res.charset = 'utf-8';

        res.writeHead(status, {
          'Content-Type': 'text/html; charset=utf-8',

        });
        // res.end(`<!doctype html>\n${output}`);
        res.end(output);



      })
      .catch(e => {

        console.error(chalk.red("Server errer"), e);

        res.writeHead(500, {
          'Content-Type': 'text/html; charset=utf-8',
        });
        res.end(e.message);
        ;
      });
  }


  /**
   * Рендеринк карты сайта.
   */
  async renderSitemap(req, res, uri) {

    let {
      section,
    } = uri.query(true);


    switch (section) {


      case "main":

        return this.renderMainSitemap(req, res, uri);

      default:
        return this.renderRootSitemap(req, res, uri);

    }



  }


  renderRootSitemap(req, res, uri) {

    const cleanUri = uri.clone().query(null)

    /**
     * Выводим ссылки на разделы
     */
    const xml = new XMLWriter();

    xml.startDocument('1.0', 'UTF-8')

    xml.startElement("sitemapindex")
      .writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    ;


    /**
     * Формируем ссылки на разделы
     */

    xml.startElement("sitemap")
      .writeElement("loc", cleanUri.clone().query({
        section: "main",
      }).toString())
      .endElement();


    xml.endDocument();



    res.charset = 'utf-8';

    res.writeHead(200, {
      'Content-Type': 'application/xml',

    });

    res.end(xml.toString());

  }


  /**
   * Основные страницы
   */
  async renderMainSitemap(req, res, uri) {



    const xml = new XMLWriter();

    xml.startDocument('1.0', 'UTF-8')



    xml.startElement("urlset")
      .writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    ;



    this.addSitemapDocument(xml, uri, {
      url: `/`,
      priority: 1,
    })

    xml.endDocument();



    res.charset = 'utf-8';

    res.writeHead(200, {
      'Content-Type': 'application/xml',

    });

    res.end(xml.toString());


    return;
  }



  addSitemapDocument(xml, uri, doc) {

    let {
      url,
      updatedAt,
      changefreq,
      priority,
    } = doc;


    const locUri = new URI(uri.origin()).path(url);


    xml.startElement("url")
      .writeElement("loc", locUri.toString())


    // updatedAt && xml.writeElement("updatedAt", moment(updatedAt).format())
    updatedAt && xml.writeElement("lastmod", updatedAt)

    changefreq && xml.writeElement("changefreq", changefreq)

    priority && xml.writeElement("priority", priority);

    xml.endElement();

  }

}


module.exports = Server;
