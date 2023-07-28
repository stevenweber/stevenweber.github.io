// A basic development webserver.

const http = require("http");
const fileSystem = require('fs');
const path = require('path');

const host = '0.0.0.0';
const port = 8000;

const INDEX_HTML_PATH = './index.html'
const HTML_CONTENT_TYPE = 'text/html';
const JS_CONTENT_TYPE = 'text/javascript';

const contentTypes = {
  html: HTML_CONTENT_TYPE,
  js: JS_CONTENT_TYPE,
};

function determineContentType(url) {
  // TODO: allowlisted files, e.g. not development-server.js
  if (url === '/') return HTML_CONTENT_TYPE;
  const fileType = url.match(/.*\.(.+)$/)[1];
  // TODO: validation
  return contentTypes[fileType];
}

function determineFilePath(url) {
  if (url === '/') return path.join(__dirname, INDEX_HTML_PATH);
  return path.join(__dirname, `./${url}`);
}

const requestListener = function (request, response) {
  const { url } = request;
  const contentType = determineContentType(url);
  const filePath = determineFilePath(url);
  var stat = fileSystem.statSync(filePath);

  // TODO: error handling, e.g. 404 and unsupported file types
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
