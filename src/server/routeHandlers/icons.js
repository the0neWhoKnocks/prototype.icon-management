import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  PUBLIC_ICONS,
} from 'ROOT/conf.app';
import iconsView from 'SERVER/views/icons';
import shell from 'SERVER/views/shell';
import handleError from './error';

export const renderShell = ({ iconsDir, res, version }) => {
  const manifest = (!version)
    ? require(`${iconsDir}/manifest.json`)
    : require(`${iconsDir}/${version}/manifest.json`);
  const styles = readFileSync(resolve(__dirname, 'SERVER/views/icons/styles.css'), 'utf8');
  const clientJS = readFileSync(resolve(__dirname, 'SERVER/views/icons/client.js'), 'utf8');
  
  const shellOpts = {
    rootContent: iconsView({ manifest }),
    scripts: {
      head: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js' },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/languages/javascript.min.js' },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/languages/xml.min.js' },
        { raw: clientJS },
      ],
    },
    styles: [
      { link: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/railscasts.min.css' },
      { style: styles },
    ],
    title: 'Icons',
  };
  
  return shell(shellOpts);
};

export default ({ matches, res }) => {
  const version = matches[1];
  res.end(renderShell({
    res,
    iconsDir: PUBLIC_ICONS,
    version,
  }));
};