import http from 'http';
import getPort from 'SERVER/utils/getPort';
import jsonResp from 'SERVER/utils/jsonResp';
import requestHandler from 'SERVER/utils/requestHandler';
import handleError from './routeHandlers/error';
import handleIcons from './routeHandlers/icons';
import handleRootRequest from './routeHandlers/root';
import handleStaticFile from './routeHandlers/static';

const port = getPort();

const inspectMiddleware = [];
if( process.env.DEBUG ){
  // https://nodejs.org/api/inspector.html
  const inspector = require('inspector');
  inspectMiddleware.push(
    ['/json', ({ reqData, res }) => {
      // open, close, url, Session
      inspector.open();
      res.end();
    }, null, false],
    ['/json/version', ({ res }) => {
      jsonResp(res, {
        Browser: `node.js/${ process.version }`,
        'Protocol-Version': '1.1',
      });
    }, null, false],
  );
}

http
  .createServer(requestHandler([
    ...inspectMiddleware,
    ['/', handleRootRequest],
    [/\/icons(?:\/(v\d{1,3}\.\d{1,3}\.\d{1,3}))?\/?$/, handleIcons],
    [/\.[a-z]{2,4}/, handleStaticFile],
    ['*', handleError, [404, 'Page Not Found']],
  ]))
  .listen(port, (err) => {
    if(err) throw err;
    console.log(`Server running at http://localhost:${ port }/`);
  });
