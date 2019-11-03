
const basepath = process.cwd();

// console.log('process.cwd', process.cwd());
// console.log('process.env.PWD', process.env.PWD);

// return ;

require('@babel/register')({
  extensions: ['.js'],
  // presets: ['react', "es2015"],
  // presets: ["es2015"],
  // presets: ['react'],
  // presets: [ "es2015", "react", "stage-0"],
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    // "transform-ensure-ignore"
    "transform-es2015-modules-commonjs",
    "@babel/plugin-proposal-class-properties"
  ],
  // ignore: /\/prisma\/node_modules\//,

  ignore: [function (filename) {
    // console.log(filename.indexOf(basepath + `/node_modules/`));

    return filename.indexOf(basepath + `/node_modules/`) === 0;
  }],

  // ignore: function(filename) {
  //   // console.log('filename', filename);
  //   // if (filename === "/path/to/es6-file.js") {
  //   if (filename === "/path/to/es6-file.js") {
  //     return false;
  //   } else {
  //     return true;
  //   }
  //   return true;
  // },
});

require("@babel/polyfill");

['.css', '.less', '.sass', '.scss', '.ttf', '.woff', '.woff2', '.svg', '.png', '.jpg', '.jpeg', '.gif']
  .forEach((ext) => require.extensions[ext] = () => { });
// ['.css', '.less', '.sass', '.ttf', '.woff', '.woff2'].forEach((ext) => require.extensions[ext] = () => {});
// require('babel-polyfill');

// const queryFragments = require("../src/schema/generated/api.fragments");


const apolloCaches = {

};


let SSRmiddlewareClass = require('./SSR');

let SSRmiddleware = new SSRmiddlewareClass({
  // queryFragments,
  apolloCaches,
}).middleware;

const ws = require('ws');

global.WebSocket = ws;

const express = require('express');
// const logger = require('./logger');

const argv = require('minimist')(process.argv.slice(2));
// const setup = require('./middlewares/frontendMiddleware');
const app = express();

var bodyParser = require('body-parser');

const cwd = process.cwd();

const setupProxy = require("../src/setupProxy");

setupProxy(app);


// app.use('/static', express.static(cwd + '/build/static')); //Serves resources from build folder
// app.use('/build', express.static(cwd + '/build')); //Serves resources from build folder
// app.use('/public', express.static(cwd + '/public')); //Serves resources from public folder

app.use(express.static(cwd + '/build')); //Serves resources from build folder
app.use(express.static(cwd + '/public')); //Serves resources from public folder

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(bodyParser.json());       // to support JSON-encoded bodies


app.get('/__apollo-state__/:state_id', async (req, res, next) => {

  const {
    state_id,
  } = req.params;


  const state = apolloCaches[state_id];

  if (state) {

    delete apolloCaches[state_id];

    res.status(200);
    res.contentType(`application/json`);
    res.setHeader("Cache-Control", "no-cache");
    res.send(state);
  }
  else {
    res.status(404).send('File not found');
  }

});

app.get('**', SSRmiddleware);

// get the intended port number, use port 3000 if not provided
const port = argv.port || process.env.PORT || 3000;

// Start your app.
app.listen(port, (err) => {
  if (err) {
    // return logger.error(err.message);
    console.error(err);
  }
  // logger.appStarted(port);
  console.log("Server started");
});

