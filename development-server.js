// A basic development webserver.

const http = require("http");
const fileSystem = require('fs');
const path = require('path');

const host = '0.0.0.0';
const port = 8000;

const CSS_CONTENT_TYPE = 'text/css';
const HTML_CONTENT_TYPE = 'text/html';
const INDEX_HTML_PATH = './index.html'
const JPEG_CONTENT_TYPE = 'image/jpeg';
const JS_CONTENT_TYPE = 'text/javascript';
const PNG_CONTENT_TYPE = 'image/png';

const contentTypes = {
  css: CSS_CONTENT_TYPE,
  html: HTML_CONTENT_TYPE,
  jpg: JPEG_CONTENT_TYPE,
  js: JS_CONTENT_TYPE,
  png: PNG_CONTENT_TYPE,
};

const ALLOW_LIST = [
  '/',
  '/index.js',
  '/styles.css',
  '/tests.js',
  '/images/og.jpg',
  '/images/favicon.png',
];

function determineContentType(url) {
  if (url === '/') return HTML_CONTENT_TYPE;

  const fileType = url.match(/.*\.(.+)$/)[1];
  return contentTypes[fileType];
}

function determineFilePath(url) {
  if (!ALLOW_LIST.includes(url)) return;
  if (url === '/') return path.join(__dirname, INDEX_HTML_PATH);
  return path.join(__dirname, `./${url}`);
}

function writeNotFound(url, response, body) {
  console.log(`404 - ${url} - ${body}`);
  response.writeHead(404);
  response.end();
}

const requestListener = function (request, response) {
  const { url } = request;

  const contentType = determineContentType(url);
  if (!contentType) return writeNotFound(url, response, 'Content type not supported');

  const filePath = determineFilePath(url);
  if (!filePath) return writeNotFound(url, response, 'File not found or allowlisted');

  var stat = fileSystem.statSync(filePath);
  response.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size
  });

  const readStream = fileSystem.createReadStream(filePath);
  readStream.pipe(response);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
