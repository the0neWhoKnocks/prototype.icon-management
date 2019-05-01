const { resolve } = require('path');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const TidyPlugin = require('@noxx/webpack-tidy-plugin');
const {
  DIST,
  DIST_JS,
  SRC,
} = require('./conf.app');

const MODE = process.env.MODE;
const HASH_LENGTH = 5;
const stats = {
  chunks: false,
  colors: true,
  errors: true,
  errorDetails: true,
  modules: false,
};

const conf = {
  entry: {
    app: `${ SRC }/app.js`,
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  mode: MODE,
  module: {
    rules: [
      {
        use: 'babel-loader',
        exclude: /node_modules/,
        test: /\.js$/,
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          test: resolve(__dirname, 'node_modules'),
          name: 'vendor',
          enforce: true,
        },
      },
    },
  },
  output: {
    path: DIST_JS,
    // assigns the hashed name to the file
    filename: `[name]_[chunkhash:${ HASH_LENGTH }].js`,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info => resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  plugins: [
    /**
     * Gives more control of how bundles are hashed
     */
    new webpack.HashedModuleIdsPlugin({
      hashDigestLength: HASH_LENGTH,
    }),
    /**
     * Generate a manifest file which contains a mapping of all asset filenames
     * to their corresponding output file so that tools can load them without
     * having to know the hashed name.
     */
    new WebpackAssetsManifest({
      sortManifest: false,
      writeToDisk: true,
    }),
    /**
     * Makes some environment variables available to the JS code, for example:
     * if (process.env.NODE_ENV === 'production') { ... }.
     */
    new webpack.DefinePlugin({
      'process.env.ON_CLIENT': true,
      'process.env.PORT': process.env.PORT,
    }),
    /**
     * Provides build progress in the CLI
     */
    new SimpleProgressWebpackPlugin({
      format: 'minimal',
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
  stats: stats,
};

if(MODE === 'production'){
  const { readFileSync } = require('fs');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { iconsToSymbols } = require(`${ DIST }/cjs/modules/@org/org-icons`);
  const clientJS = readFileSync(`${ SRC }/server/views/root/client.js`, 'utf8');
  // emulate how the module would function
  const iconOpts = {
    icons: ['cake', 'mood', 'mood_bad'],
    version: 'v1.1.0',
  };
  const iconsManifest = JSON.parse(
    readFileSync(`${ DIST }/public/icons/${ iconOpts.version }/manifest.json`, 'utf8')
  );
  const icons = {};
  iconOpts.icons.forEach((name) => {
    const svgPath = `${ SRC }/static/icons/${ iconsManifest[name].split('/icons/')[1] }`;
    icons[name] = readFileSync(svgPath, 'utf8');
  });
  
  conf.plugins.push(
    /**
     * Wires up the example HTML with generated bundles
     */
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: `${ SRC }/server/views/shell.js`,
      templateParameters: {
        // NOTE - Similar params exist in `SERVER/routeHandlers/root.js` and may have to updated.
        icons: iconsToSymbols(icons),
        scripts: {
          head: [
            { src: `js/vendor/react.production.min.js` },
            { src: `js/vendor/react-dom.production.min.js` },
            { raw: clientJS },
          ],
        },
        title: 'Root View',
      },
    })
  );
}
else {
  conf.plugins.push(
    new TidyPlugin({
      cleanOutput: true,
      hashLength: HASH_LENGTH,
    }),
  );
}

module.exports = conf;
