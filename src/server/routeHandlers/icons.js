import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  PUBLIC_ICONS,
} from 'ROOT/conf.app';
import iconsView from 'SERVER/views/icons';
import shell from 'SERVER/views/shell';
import handleError from './error';

export default ({ matches, res }) => {
  const version = matches[1];
  const manifest = (!version)
    ? require(`${PUBLIC_ICONS}/manifest.json`)
    : require(`${PUBLIC_ICONS}/${version}/manifest.json`);
  const styles = readFileSync(resolve(__dirname, 'SERVER/views/icons/styles.css'), 'utf8');
  const clientJS = readFileSync(resolve(__dirname, 'SERVER/views/icons/client.js'), 'utf8');
  
  res.end(shell({
    res,
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
  }));
};