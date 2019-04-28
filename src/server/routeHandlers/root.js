import { readFile } from 'fs';
import orgIcons from '@ORG/org-icons';
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
const iconsPromise = orgIcons({
  icons: ['cake', 'domain', 'mood_bad'],
  version: 'v1.1.0',
});

export default ({ res }) => {
  const manifestPromise = new Promise((resolve, reject) => {
    readFile(PUBLIC_MANIFEST, 'utf8', (err, manifest) => {
      if(err || !manifest){
        reject({
          message: err || `Manifest contents are: "${ manifest }"`,
          status: 404,
        });
      }
      else{
        resolve(JSON.parse(manifest));
      }
    });
  });
  
  Promise.all([manifestPromise, iconsPromise])
    .then(([bundleScripts, icons]) => {
      res.end(shell({
        bundleScripts: Object.keys(bundleScripts).map(
          (key) => `${ relativeJS }/${ bundleScripts[key] }`
        ),
        res,
        scripts: {
          head: [
            { src: `${ relativeVendor }/react.${ (isProd) ? 'production.min' : 'development' }.js` },
            { src: `${ relativeVendor }/react-dom.${ (isProd) ? 'production.min' : 'development' }.js` },
          ],
        },
        svgs: icons,
        title: 'Root View',
      }));
    })
    .catch(({ message, status }) => {
      return handleError({ res }, status, message);
    });
};