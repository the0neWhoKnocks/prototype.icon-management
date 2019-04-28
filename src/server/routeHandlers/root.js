import { readFile, readFileSync } from 'fs';
import { resolve } from 'path';
import orgIcons from '@ORG/org-icons';
import {
  PUBLIC,
  PUBLIC_JS,
  PUBLIC_MANIFEST,
  PUBLIC_VENDOR,
} from 'ROOT/conf.app';
import getEnv from 'SERVER/utils/getEnv';
import shell from 'SERVER/views/shell';
import handleError from './error';

const isProd = getEnv() === 'prod';
const relativeJS = PUBLIC_JS.replace(PUBLIC, '');
const relativeVendor = PUBLIC_VENDOR.replace(PUBLIC, '');
const iconsPromise = orgIcons({
  icons: ['cake', 'mood', 'mood_bad'],
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
  const clientJS = readFileSync(resolve(__dirname, 'SERVER/views/root/client.js'), 'utf8');
  
  Promise.all([manifestPromise, iconsPromise])
    .then(([bundleScripts, icons]) => {
      res.end(shell({
        bundleScripts: [
          ...Object.keys(bundleScripts).map(
            (key) => `${ relativeJS }/${ bundleScripts[key] }`
          ),
          // API has to load after hydration, otherwise it may not always get
          // bound to the correct DOM element.
          'https://www.youtube.com/iframe_api',
        ],
        res,
        scripts: {
          head: [
            { src: `${ relativeVendor }/react.${ (isProd) ? 'production.min' : 'development' }.js` },
            { src: `${ relativeVendor }/react-dom.${ (isProd) ? 'production.min' : 'development' }.js` },
            { raw: clientJS },
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