const { readdirSync, writeFileSync } = require('fs');
const { parse } = require('path');
const { ports } = require('../package.json');
const { DIST_PUBLIC_ICONS } = require('../conf.app');

const BUCKET_URL = `http://localhost:${ports.dev}/icons`;
let manifest = {};

readdirSync(DIST_PUBLIC_ICONS).forEach(version => {
  const folder = `${DIST_PUBLIC_ICONS}/${version}`;
  const manifestFile = `${folder}/manifest.json`;
  
  // builds out manifest with updated version specific paths
  readdirSync(folder).forEach(svg => {
    const { base, name } = parse(`${folder}/${svg}`);
    manifest[name] = `${BUCKET_URL}/${version}/${base}`;
  });
  
  // alphabetize keys
  if(Object.keys(manifest).length){
    const sorted = {};
    Object.keys(manifest).sort().forEach((key) => {
      sorted[key] = manifest[key];
    });
    manifest = sorted;
  }
  
  // create a manifest of all files for each version
  writeFileSync(manifestFile, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`Created manifest for ${version}`);
});

// newest manifest will live at root
writeFileSync(`${DIST_PUBLIC_ICONS}/manifest.json`, JSON.stringify(manifest, null, 2), 'utf8');
console.log('Created root manifest');
