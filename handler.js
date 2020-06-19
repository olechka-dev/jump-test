'use strict';
const awsServerlessExpress = require('aws-serverless-express');
const app = require('./server-packed');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml',
  'image/x-icon',
  'image/svg+xml',
  'application/x-font-ttf'
];


app.use(awsServerlessExpressMiddleware.eventContext());

const serverProxy = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

exports.run = (event, context) => {
  console.log(event, context);
  awsServerlessExpress.proxy(serverProxy, event, context)
};
