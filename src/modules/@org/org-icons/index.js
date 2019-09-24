import getIconsURL from 'UTILS/getIconsURL';

const ICONS_URL = getIconsURL();

const manifestURL = (version = 'latest') => {
  const v = (version !== 'latest') ? `/${ version }` : '';
  return `${ ICONS_URL }${ v }/manifest.json`;
};


if(process.env.ON_CLIENT){
  // NOTE - Using `fetch` for simplicity, would have to be polyfilled to account
  // for older browsers.
  const getManifest = (url) => window.fetch(url).then((resp) => resp.json());
  const getSVG = (url) => window.fetch(url).then((resp) => resp.text());
  
  module.exports.getIcon = ({ icon, version = 'latest' }) => {
    return getManifest( manifestURL(version) )
      .then((manifest) => getSVG(manifest[icon]));
  };
}
else {
  const { readFile, writeFile } = require('fs');
  const { resolve } = require('path');
  const { get } = require('request');
  
  const CACHE_PATH = resolve(__dirname, './cache.js');
  
  const getManifest = ({ icons, version }) => new Promise((res, rej) => {
    get({ url: manifestURL(version), json: true }, (err, resp, manifest) => {
      if(err){
        rej({ message: err.message, status: 500 });
      }
      else {
        console.log(`[ICONS] Loaded ${ manifest._version } manifest`);
        res(manifest);
      }
    });
  });

  const saveCache = (cache, cb) => {
    writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), cb);
  };

  const getCache = ({ icons, version }) => new Promise((res, rej) => {
    readFile(CACHE_PATH, 'utf8', (err, cache) => {
      let _cache = (cache) ? JSON.parse(cache) : {};
      
      if(err || _cache.manifest._version !== version){
        // cache doesn't exist yet
        const missingCache = err && err.code === 'ENOENT';
        // if cached manifest version differs from what's specified, get new manifest
        const manifestVersionMisMatch = !err && _cache.manifest._version !== version
        
        if(missingCache || manifestVersionMisMatch){
          const versionMsg = (version === 'latest')
            ? 'Getting "latest" manifest'
            : 'Different manifest version detected, updating...';
          console.log('[ICONS]', (missingCache)
            ? 'No cache found, creating...'
            : versionMsg
          );
          
          getManifest({ icons, version })
            .then((manifest) => {
              _cache = { manifest };
              
              saveCache(_cache, (err) => {
                if(err) rej({ message: err.message, status: 500 });
                else res(_cache);
              });
            })
            .catch((err) => rej(err));
        }
        else if(err) rej(err);
      }
      else {
        res(_cache);
      }
    });
  });

  const getSVG = (name, url) => new Promise((res, rej) => {
    get(url, (err, resp, icon) => {
      if(err) rej({ message: err.message, status: 500 });
      else res({ name, svg: icon });
    });
  });

  const loadSVGs = ({ cache, icons }) => new Promise((res, rej) => {
    const pendingSVGs = icons.map(icon => getSVG(icon, cache.manifest[icon]));
    
    Promise.all(pendingSVGs)
      .then((svgs) => {
        const _cache = { ...cache };
        if(!_cache.icons) _cache.icons = {};
        svgs.forEach(({ name, svg }) => { _cache.icons[name] = svg; });
        
        saveCache(_cache, (err) => {
          if(err) rej({ message: err.message, status: 500 });
          else res(_cache.icons);
        });
      })
      .catch(err => rej(err));
  });

  const filterIcons = (icons, cachedIcons) => {
    const filtered = {};
    icons.forEach((icon) => { filtered[icon] = cachedIcons[icon]; });
    return filtered;
  };

  const getIcons = ({ icons, version = 'latest' }) => new Promise((res, rej) => {
    getCache({ icons, version })
      .then((cache) => {
        // if no icons are cached, add them all
        if(!cache.icons){
          console.log('[ICONS] None were cached, starting look-ups');
          loadSVGs({ cache, icons })
            .then(_icons => res(_icons))
            .catch(err => rej(err));
        }
        else {
          const missingIcons = icons.filter(icon => !cache.icons[icon]);
          
          // if specified icon isn't in cache, add to cache. Happens when a
          // version is pinned.
          if(missingIcons.length){
            console.log('[ICONS] Missing', missingIcons);
            loadSVGs({ cache, icons: missingIcons })
              .then(_icons => res(_icons))
              .catch(err => rej(err));
          }
          // everything seems to be cached, so just return the icons
          else {
            console.log('[ICONS] All cached');
            res(filterIcons(icons, cache.icons));
          }
        }
      })
      .catch(err => rej(err));
  });
  
  const iconsToSymbols = (svgs) => {
    const symbols = Object.keys(svgs).map((name) => {
      return svgs[name]
        .replace('<svg', `<symbol id="org-icon_${name}"`)
        .replace('svg>', 'symbol>')
        .replace(/\s(?:width|height)="\d+"/g, '');
    });
    
    return `
      <svg style="display:none; position:absolute" width="0" height="0">
        ${ symbols.join('\n') }
      </svg>
    `;
  };

  module.exports.getIcons = getIcons;
  module.exports.iconsToSymbols = iconsToSymbols;
}
