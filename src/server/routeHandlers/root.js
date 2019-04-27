import { readFile } from 'fs';
import {
  PUBLIC,
  PUBLIC_JS,
  PUBLIC_MANIFEST,
  PUBLIC_VENDOR,
} from 'ROOT/conf.app';
import getMode from 'SERVER/utils/getMode';
import shell from 'SERVER/views/shell';
import handleError from './error';

const isProd = getMode() === 'prod';
const relativeJS = PUBLIC_JS.replace(PUBLIC, '');
const relativeVendor = PUBLIC_VENDOR.replace(PUBLIC, '');

export default ({ res }) => {
  readFile(PUBLIC_MANIFEST, 'utf8', (err, manifest) => {
    let bundleScripts;
    
    if(err || !manifest){
      return handleError({ res }, 404, err || `Manifest contents are: "${ manifest }"`);
    }
    else{
      bundleScripts = JSON.parse(manifest);
    }
    
    res.end(shell({
      bundleScripts: Object.keys(bundleScripts).map(
        (key) => `${ relativeJS }/${ bundleScripts[key] }`
      ),
      scripts: {
        head: [
          { src: `${ relativeVendor }/react.${ (isProd) ? 'production.min' : 'development' }.js` },
          { src: `${ relativeVendor }/react-dom.${ (isProd) ? 'production.min' : 'development' }.js` },
        ],
      },
      res,
      title: 'Root View',
    }));
  });
};