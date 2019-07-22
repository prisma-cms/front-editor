import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
// import Express from 'express';
import { StaticRouter } from 'react-router';
import { InMemoryCache } from "apollo-cache-inmemory";

import fetch from 'node-fetch';

import React, { Component, Fragment } from 'react';

import { getDataFromTree } from "react-apollo"

import ReactDOM from 'react-dom/server';


import { createGenerateClassName } from 'material-ui/styles';

import MainApp from '../../dev/App';

// import PrismaCmsApp from '@prisma-cms/front/lib/components/App'
import {
  App as PrismaCmsApp,
  Renderer as PrismaRenderer,
} from '@prisma-cms/front';


// class Renderer extends PrismaRenderer {


//   render() {

//     return "33333333sdfdsf";
//   }
// }


class DevApp extends PrismaCmsApp {


  render() {

    const {
      // children,
      ...other
    } = this.props;

    return <Fragment>

      {super.render()}

    </Fragment>;
  }
}


import chalk from "chalk";

import URI from 'urijs';

import cheerio from "cheerio";

var XMLWriter = require('xml-writer');

const { Prisma } = require('prisma-binding')

let api;

const JssProvider = require('react-jss').JssProvider;
const SheetsRegistry = require('react-jss').SheetsRegistry;


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

    this.App = App || MainApp;

    this.props = props;

  }


  getApi(props) {

    if (!api) {

      api = new Prisma({
        typeDefs: 'src/schema/generated/api.graphql',
        endpoint: 'http://localhost:4000',
        secret: 'mysecret123',
        debug: false,
        ...props,
      });

    }

    return api;
  }


  timeLogStart(uri) {

    if (process.env.PRISMA_CMS_TIMELOG === "true") {
      console.log(chalk.green("Start request", uri));
      console.time("PrismaCMS SSR Render");
    }

  }

  timeLogEnd() {

    if (process.env.PRISMA_CMS_TIMELOG === "true") {
      console.timeEnd("PrismaCMS SSR Render");
      console.log(chalk.green("End request"));
    }

  }

  timeLog(label) {

    if (process.env.PRISMA_CMS_TIMELOG === "true") {

      // const args = ["PrismaCMS SSR Render"].concat((arguments || []));

      const args = ["PrismaCMS SSR Render"].concat([...arguments]);

      // console.log("arguments", arguments);

      // console.log("arguments array", [...arguments]);
      // console.log("args", args);

      console.timeLog.apply(this, args);
      // console.timeLog.apply("PrismaCMS SSR Render");
      // console.timeLog("PrismaCMS SSR Render", label);
    }

  }


  middleware = async (req, res) => {

    // console.log("process.env.NODE_ENV", process.env.PRISMA_CMS_TIMELOG);


    /**
     * Надо сбрасывать этот объект, чтобы не попадали результаты прошлого выполнения
     */
    global.document = undefined;


    const protocol = req.protocol || "http";

    const host = req.get('host');

    const uri = new URI(`${protocol}://${host}${req.url}`);

    this.timeLogStart(uri.toString());

    // this.timeLog("start", uri.toString());

    // this.timeLog();

    const {
      page,
    } = uri.query(true);


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

      default:
        response = await this.renderHTML(req, res, uri)
          .catch(error => {
            console.error(chalk.red("Server error"), error);
            res.status(500);
            res.end(error.message);
            ;
          });

      // res.end("Debug");

    }

    this.timeLogEnd();

    // console.log(chalk.green("response"), response);

    return response;

  };


  async renderHTML(req, res) {


    this.timeLog("renderHTML", "start");

    // return new Promise((resolve) => {


    //   this.timeLog("Promise start");

    //   setTimeout(() => {
    //     res.end("output");



    //     resolve("dsfdsfdsf");
    //   }, 3000);

    // });

    // res.end("output");
    // return;


    let context = {}


    const {
      host: hostname,
      protocol = "http:",
      // referer,
    } = req.headers;

    // const host = req.get('host');

    const uri = new URI(`${protocol}//${hostname}${req.url}`);


    let assetsUrl;

    let js_src;
    let css_src;

    let inline_styles;

    let basePath = process.cwd() + "/";

    let buildPath = basePath + "build/";


    // if (process.env.NODE_ENV === 'production') {

    //   let match = html.match(/<script [^>]*?src="(.*?)"/);

    //   if (match) {
    //     js_src = `/build${match[1]}`;
    //   }

    //   let css_match = html.match(/<link .*?href="(.*?)"/);

    //   if (css_match) {
    //     css_src = `/build${css_match[1]}`;
    //   }

    // }
    // else {

    //   js_src = `/dev/static/js/bundle.js`;
    // }



    // let css_match = html.match(/<link [^>]*?href="([^\"]*?\.css)" rel="stylesheet"/);

    // if (css_match) {
    //   css_src = `/build${css_match[1]}`;
    // }

    const {
      App: MainApp,
      props: {
        rootSelector,
      },
    } = this;


    this.timeLog("renderHTML", "Init ApolloClient");

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


    this.timeLog("renderHTML", "Init SheetsRegistry");

    const sheets = new SheetsRegistry();

    this.timeLog("renderHTML", "Init App");

    const App = (
      <JssProvider
        registry={sheets}
        generateClassName={createGenerateClassName()}
      >
        <ApolloProvider client={client}>
          <StaticRouter location={req.url} context={context}>
            <div>

            <DevApp
                sheetsManager={new Map()}
                uri={uri}
                onSchemaLoad={clientSchema => {

                  // console.log("onSchemaLoad", schema);
                  console.log(chalk.green("SSR onSchemaLoad"), clientSchema);

                  if (!apiSchema && clientSchema) {
                    // apiSchema = `window.__PRISMA_CMS_API_SCHEMA__=${JSON.stringify(schema).replace(/</g, '\\u003c')};`;
                    apiSchema = `window.__PRISMA_CMS_API_SCHEMA_DSL__=${JSON.stringify(clientSchema).replace(/</g, '\\u003c')};`;
                    apiSchema = `<script type="text/javascript">
                    ${apiSchema}
                  </script>`
                  }

                }}
                // Renderer={Renderer}
                routes={[
                  {
                    path: "/",
                    render: () => {

                      return <MainApp
                        data={{
                          object: {
                            name: "Section",
                            component: "Section",
                            props: {},
                            components: [
                              {
                                name: "Tag",
                                component: "Tag",
                                props: {
                                  text: "Test SSR",
                                },
                                components: [],
                              },
                              {
                                id: "cjxikj16403v60917afs9zixw",
                                name: "Section",
                                component: "Section",
                                props: {
                                },
                                components: [
                                  {
                                    name: "Tag",
                                    component: "Tag",
                                    props: {
                                      text: "Test SSR",
                                    },
                                    components: [],
                                  }
                                ],
                              },
                            ],
                          },
                        }}
                      // data={{
                      //   object: {
                      //     id: "cjxikj16403v60917afs9zixw",
                      //     name: "Section",
                      //     component: "Section",
                      //     props: {
                      //     },
                      //     components: [
                      //       {
                      //         name: "Tag",
                      //         component: "Tag",
                      //         props: {
                      //           text: "Test SSR",
                      //         },
                      //         components: [],
                      //       }
                      //     ],
                      //   },
                      // }}
                      />
                    }
                  }
                ]}
              >

              </DevApp>
            </div>
          </StaticRouter>
        </ApolloProvider>
      </JssProvider>
    );

    this.timeLog("renderHTML", "getDataFromTree start");

    await getDataFromTree(App)
      .then(async () => {
        // We are ready to render for real
        const content = await ReactDOM.renderToString(App);
        this.timeLog("renderHTML", "getDataFromTree ReactDOM.renderToString");

        const initialState = await client.extract();

        this.timeLog("renderHTML", "getDataFromTree client.extract()");


        let {
          title,
          description,
          status,
          canonical,
        } = global.document || {};


        status = status || 200;


        // const result = await htmlToJson.parse(HTML, {
        //   'head': function ($doc, $) {

        //     let head = $doc.find('head');

        //     // return item ? item.attr("href") : null;

        //     // console.log(chalk.green("TITLE"), $(head).find("title").html());
        //     // console.log(chalk.green("TITLE"), $(head).find("title").remove().html());

        //     return $(head);

        //   },
        //   // 'links': async function ($doc, $) {

        //   //   let links = await this.map('a', item => {
        //   //     // let text = item.text();
        //   //     // return text ? text.replace('\n', '').trim().toLocaleLowerCase() : null;

        //   //     const href = item.attr("href");

        //   //     return href
        //   //   }) || [];



        //   //   switch (currentHost) {


        //   //   }

        //   //   return links;
        //   // }
        // });


        // let {
        //   head,
        // } = result;

        const Html = ({
          content,
          state,
          sheets = "",
        }) => {


          // head = $(head);

          // head = head.remove("title");

          // let headHTML = head.find("title").remove().html()



          // console.log(chalk.green("title"), title.html());

          // let headHTML = head.html()

          // console.log(chalk.green("head"), head.html());


          this.timeLog("renderHTML", "cheerio.load start");

          const $ = cheerio.load(HTML, {
            decodeEntities: false,
          });

          this.timeLog("renderHTML", "cheerio.load end");

          // console.log(chalk.green("$"), $);

          /**
           * Remove noscript notifi
           */

          $("noscript#react-noscript-notify").remove();

          let root = $(rootSelector);


          let head = $("head");
          let body = $("body");



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


          this.timeLog("start add styles");

          head.append(`<style
            id="server-side-jss"
          >
            ${sheets.toString()}
          </style>`);

          this.timeLog("end add styles");

          // <script dangerouslySetInnerHTML={{
          //   __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
          // }} />

          // this.timeLog( "start add apolloState");

          // body.prepend(`<script type="text/javascript">
          // ${`window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`}
          // </script>`);


          let apolloState;

          if (state) {
            apolloState = `<script type="text/javascript">
            ${`window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`}
            </script>`;
          }


          // this.timeLog( "end add apolloState");

          // if (apiSchema) {


          // this.timeLog( "start add apiSchema");

          // body.prepend(`<script type="text/javascript">
          // ${apiSchema}
          // </script>`);

          // this.timeLog( "end add apiSchema");

          // }

          // root.html(content);

          console.log(chalk.green("content: "), content);


          this.timeLog("renderHTML", "$.html() start");
          let result = $.html();
          this.timeLog("renderHTML", "$.html() end");


          // <body><div id="root"></div>

          this.timeLog("renderHTML", "replace root content start");

          // result = result.replace(`<body><div id="root"></div>`, `<body><div id="root">${content}</div>`);
          // result = result.replace(`<body><div id="root"></div>`, `<body><div id="root">${content}</div>${apiSchema}`);
          result = result.replace(`<div id="root"></div>`, `<div id="root">${content}</div>${apolloState}${apiSchema || ""}`);

          this.timeLog("renderHTML", "replace root content end");


          return result;

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


          const response___ = (
            <html>
              <head>
                <title>{title || "Prisma-CMS"}</title>

                <base href="/" />

                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content={description || ""} />
                <meta name="language" content="Russian" />
                <meta http-equiv="content-language" content="ru" />

                <link rel="shortcut icon" href="/favicon.ico" />

                {canonical ? <link rel="canonical" href={canonical} /> : ""}

                {css_src ? <link
                  type="text/css"
                  rel="stylesheet"
                  href={css_src}
                /> : null}

                <style
                  id="server-side-jss"
                  key="server-side-jss"
                  type="text/css"
                  dangerouslySetInnerHTML={{ __html: sheets.toString() }}
                />


              </head>

              <body>
                <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
                <script dangerouslySetInnerHTML={{
                  __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
                }} />

                <script dangerouslySetInnerHTML={{
                  __html: `
                    setTimeout(() => {
                      var script = document.createElement('script');

                      script.setAttribute('src', '${js_src}');

                      document.head.appendChild(script);


                    }, 1000);
                    `,
                }} />

              </body>
            </html>
          );



          return response;
        }

        // const html = <Html
        //   content={content}
        //   state={initialState}
        //   sheets={sheets}
        // />;

        // const output = await ReactDOM.renderToStaticMarkup(html);

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


    this.timeLog("renderHTML", "getDataFromTree end");
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
        break;

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


    updatedAt && xml.writeElement("lastmod", updatedAt)

    changefreq && xml.writeElement("changefreq", changefreq)

    priority && xml.writeElement("priority", priority);

    xml.endElement();

  }

}


// module.exports = new Server().middleware;
module.exports = Server;
