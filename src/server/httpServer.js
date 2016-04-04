var fs = require('fs');
var http = require('http');
var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');

var settings = require('./settings').settings;
var host = settings.httpServer.host || 'localhost';
var port = settings.httpServer.port || 8080;

var serve = serveStatic('/dist', { 'index': ['index.html'] });

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
})

server.listen(port, host);

console.log(host + ':' + port);
