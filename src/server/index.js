import color from 'cli-color';
import http from 'http';
import { networkInterfaces } from 'os';
import jsonResp from 'SERVER/utils/jsonResp';
import requestHandler from 'SERVER/utils/requestHandler';
import getEnv from 'UTILS/getEnv';
import getPort from 'UTILS/getPort';
import handleError from './routeHandlers/error';
import handleIcons from './routeHandlers/icons';
import handleRootRequest from './routeHandlers/root';
import handleStaticFile from './routeHandlers/static';

process.on('unhandledRejection', (reason , p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const port = getPort();
const env = getEnv();

const inspectMiddleware = [];
if( env === 'dev' ){
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

const showIconURLs = () => {
  const { readdirSync } = require('fs');
  const { PUBLIC_ICONS } = require('ROOT/conf.app');
  let iconURLs = [];
  
  readdirSync(PUBLIC_ICONS).forEach(fileName => {
    if( !/(manifest\.json|index.html)$/.test(fileName) ){
      iconURLs.push(color.cyan(`http://localhost:${ port }/icons/${ fileName }/`));
    }
  });
  
  console.log(`Icons:\n  ${ iconURLs.join('\n  ') }`);
};

const getExternalIP = () => {
  const ifaces = networkInterfaces();
  let ip;
  
  Object.keys(ifaces).forEach((ifname) => {
    ifaces[ifname].forEach((iface) => {
      if (
        iface.family === 'IPv4'
        && iface.internal === false
        // Use the first `en` (ethernet) interface. Sometimes wireless which
        // should be `wl` shows up under `en`, so just roll with it :\
        && /(en|eth)\d+/i.test(ifname)
      ) {
        ip = iface.address;
      }
    });
  });
  
  return ip;
};

http
  .createServer(requestHandler([
    ...inspectMiddleware,
    ['/', handleRootRequest],
    [/\/icons(?:\/(v\d{1,3}\.\d{1,3}\.\d{1,3}))?\/?$/, handleIcons, null, false],
    [/\.[a-z]{2,4}/, handleStaticFile, null, false],
    ['*', handleError, [404, 'Page Not Found']],
  ]))
  .listen(port, (err) => {
    if(err) throw err;
    setTimeout(() => {
      let msg =
        'Server running at:'
        + `\n  Internal: ${ color.cyan(`http://localhost:${ port }/`) }`
        + `\n  External: ${ color.cyan(`http://${ getExternalIP() }:${ port }/`) }`;
      
      if(env === 'dev'){
        msg += `\n  Watching: ${ color.cyan(`http://localhost:${ port + 1 }/`) }`;
      }
      
      console.log(msg);
      showIconURLs();
    }, 1000);
  });
