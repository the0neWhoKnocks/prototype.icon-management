const { readdirSync, writeFileSync } = require('fs');
const { parse } = require('path');
const { DIST_PUBLIC_ICONS } = require('ROOT/conf.app');
const { renderShell } = require('SERVER/routeHandlers/icons');
const getPort = require('UTILS/getPort');

// TODO - wire this up for GH pages
// const BUCKET_URL = (process.env.NODE_ENV === 'production')
//   ? `https://the0newhoknocks.github.io/<repo>/`
//   : `http://localhost:${ getPort() }/icons`;
const BUCKET_URL = `http://localhost:${ getPort() }/icons`;
let manifest = {};
let shellOpts;

readdirSync(DIST_PUBLIC_ICONS).forEach(version => {
  const folder = `${DIST_PUBLIC_ICONS}/${version}`;
  const manifestFile = `${folder}/manifest.json`;
  const indexFile = `${folder}/index.html`;
  
  manifest._version = version;
  
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
  
  // create index.html
  shellOpts = {
    iconsDir: DIST_PUBLIC_ICONS,
    version,
  };
  writeFileSync(indexFile, renderShell(shellOpts), 'utf8');
  console.log(`Created index.html for ${version}`);
});

// newest manifest will live at root
writeFileSync(`${DIST_PUBLIC_ICONS}/manifest.json`, JSON.stringify(manifest, null, 2), 'utf8');
console.log('Created root manifest');

writeFileSync(`${DIST_PUBLIC_ICONS}/index.html`, renderShell(shellOpts), 'utf8');
console.log('Created root index.html');
