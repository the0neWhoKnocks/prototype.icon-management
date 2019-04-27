const { parse, relative } = require('path');
const { version } = require('./package.json');
const { aliases } = require('./conf.app');

const a2rp = () => {
  return {
    visitor: {
      StringLiteral(path, state) {
        const { aliases } = state.opts;
        const { filename } = state.file.opts;
        
        if( !aliases || !filename ) return;
        
        const aliasKeys = Object.keys(aliases).map((alias) => alias);
        const aliasRegEx = new RegExp(`^(${ aliasKeys.join('|') })`);
        const currString = path.node.value;
        const match = currString.match(aliasRegEx);
        
        if( match ){
          const alias = match[1];
          const transformed = currString.replace(alias, aliases[alias]);
          
          let relativePath = relative(
            parse(filename).dir,
            transformed
          );
        
          if(!relativePath.startsWith('.')) relativePath = `./${ relativePath }`;
          
          // console.log(
          //   '---\n',
          //   `file: ${ filename }\n`,
          //   `requested: ${ transformed }\n`,
          //   `relative: ${ relativePath }\n`,
          // );
        
          path.node.value = relativePath;
        }
        
        return;
      },
    },
  };
};

module.exports = (api) => {
  api.cache(true);
  
  // Settings used for building npm distributable module
  // https://babeljs.io/docs/en/6.26.3/babel-preset-env
  return {
    plugins: [
      [a2rp, { aliases }],
      ['transform-define', {
        'global.appVersion': `v${ version }`,
      }],
      'emotion',
    ],
    presets: [
      ['@babel/preset-env', {
        modules: 'commonjs',
        targets: {
          node: '8.9.1',
        },
      }],
      '@babel/preset-react',
    ],
  };
};
