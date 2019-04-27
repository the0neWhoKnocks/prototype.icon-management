const { resolve } = require('path');

const ROOT = resolve(__dirname, './');
const SRC = `${ ROOT }/src`;
// NOTE - Anything pointing to DIST is top-level, should only be used in
// development. When the App is packaged up, the context will shift to within
// the `dist` directory.
const DIST = `${ ROOT }/dist`;
const DIST_CJS = `${ DIST }/cjs`;
const DIST_PUBLIC = `${ DIST }/public`;
const DIST_PUBLIC_ICONS = `${ DIST_PUBLIC }/icons`;
const DIST_JS = `${ DIST_PUBLIC }/js`;
const DIST_SERVER = `${ DIST_CJS }/server`;
const DIST_VENDOR = `${ DIST_JS }/vendor`;
// NOTE - Anything pointing to PUBLIC is assuming the production context where
// everything is executing from within the `dist` directory.
const PUBLIC = `${ ROOT }/public`;
const PUBLIC_JS = `${ PUBLIC }/js`;
const PUBLIC_MANIFEST = `${ PUBLIC_JS }/manifest.json`;
const PUBLIC_VENDOR = `${ PUBLIC }/js/vendor`;

module.exports = {
  DIST,
  DIST_CJS,
  DIST_JS,
  DIST_PUBLIC,
  DIST_PUBLIC_ICONS,
  DIST_SERVER,
  DIST_VENDOR,
  PUBLIC,
  PUBLIC_ICONS: `${PUBLIC}/icons`,
  PUBLIC_JS,
  PUBLIC_MANIFEST,
  PUBLIC_STATIC_FILE_CACHE: `${ ROOT }/cjs/server/.static-cache`,
  PUBLIC_VENDOR,
  SRC,
  SRC_STATIC_ICONS: `${ SRC }/static/icons`,
  aliases: {
    '@ORG': `${ SRC }/modules/@org`,
    ROOT,
    SERVER: `${ SRC }/server`,
    SRC,
  },
};