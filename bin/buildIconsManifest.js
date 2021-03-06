const { readdirSync, writeFileSync } = require('fs');
const { parse } = require('path');
const { DIST_PUBLIC_ICONS } = require('ROOT/conf.app');
const { renderShell } = require('SERVER/routeHandlers/icons');
const getIconsURL = require('UTILS/getIconsURL');
const getEnv = require('UTILS/getEnv');

const env = getEnv();
const ICONS_URL = getIconsURL();
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
    manifest[name] = `${ICONS_URL}/${version}/${base}`;
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
  
  if(env === 'prod'){
    // create index.html
    shellOpts = {
      iconsDir: DIST_PUBLIC_ICONS,
      version,
    };
    writeFileSync(indexFile, renderShell(shellOpts), 'utf8');
    console.log(`Created index.html for ${version}`);
  }
});

// newest manifest will live at root
writeFileSync(`${DIST_PUBLIC_ICONS}/manifest.json`, JSON.stringify(manifest, null, 2), 'utf8');
console.log('Created root manifest');

if(env === 'prod'){
  writeFileSync(`${DIST_PUBLIC_ICONS}/index.html`, renderShell(shellOpts), 'utf8');
  console.log('Created root index.html');
}
