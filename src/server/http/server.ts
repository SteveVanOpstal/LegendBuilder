// import {HttpServer, Option} from 'http-server';

// import {settings} from '../../../config/settings';

// let server = new HttpServer({root: 'build/dist/client', cache: 3 * 60 * 60, showDir: false, gzip:
// true});
// server.listen(settings.httpServer.port);

'use strict';

// let http = require('http');
let httpProxy = require('http-proxy');
let union = require('union');
let ecstatic = require('ecstatic');
let helpers = require('../../../helpers');
let settings = require('../../../config/settings').settings;

// let before = [];
// before.push(function(req, res) {
//   // console.log(req, res);
//   res.emit('next');
// });


// let proxy = httpProxy.createProxyServer({});
// before.push(function(req, res) {
//   // proxy.web(req, res, {
//   //   target: ,
//   //   changeOrigin: true
//   // });
//   req.url = '/index.html';
// });

// before.push(
//     ecstatic({root: helpers.root('build/dist/client'), cache: 3 * 60 * 60, showDir: false, gzip:
//     true}));


// // let server = http.createServer((req, resp) => {
// //   for (let handler of before) {
// //     handler(req, resp);
// //   }
// // });

// let server = union.createServer({
//   before: before,
//   onError: function(err, req, res) {
//     // if (options.logFn) {
//     //   options.logFn(req, res, err);
//     // }
//     res.end();
//   }
// });

// server.listen(settings.httpServer.port, settings.httpServer.host);

function logt(req, res, err?) {}


// this.headers = options.headers || {};

let before = [];

before.push((req, res) => {
  logt(req, res);
  console.log('request');

  res.emit('next');
});

before.push(ecstatic({
  root: helpers.root('build/dist/client'),
  cache: 3 * 60 * 60,
  contentType: 'application/octet-stream',
  showDir: false,
  autoIndex: true,
  handleError: false
}));

let proxy = httpProxy.createProxyServer({});
before.push((req, res) => {
  proxy.web(req, res, {
    target: settings.httpServer.host + ':' + settings.httpServer.port + '/',
    changeOrigin: true
  });
});

let serverOptions = {
  before: before,
  // headers: this.headers,
  onError: (err, req, res) => {
    logt(req, res, err);
    console.log('error');

    res.end();
  }
};

// if (options.https) {
//   serverOptions.https = options.https;
// }

let server = union.createServer(serverOptions);
server.listen(settings.httpServer.port, settings.httpServer.host);

console.log(settings.httpServer.host + ':' + settings.httpServer.port);
