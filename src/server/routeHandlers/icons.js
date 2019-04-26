import { readFile } from 'fs';
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
  
  res.end(shell({
    res,
    rootContent: iconsView({ manifest }),
    title: 'Icons',
  }));
};