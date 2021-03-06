import { exists, readFile } from 'fs';
import { join, parse } from 'path';
import { PUBLIC } from 'ROOT/conf.app';
import handleError from './error';

const mimeTypes = {
  '.css': 'text/css',
  '.eot': 'appliaction/vnd.ms-fontobject',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'aplication/font-sfnt',
};

export default (opts, cleanPath) => {
  const file = join(PUBLIC, cleanPath);
  const { req, res } = opts;
  
  exists(file, (exist) => {
    if(!exist) {
      handleError(opts, 404, `File ${ file } not found!`);
      return;
    }
    
    // read file from file system
    readFile(file, (err, data) => {
      if(err){
        handleError(opts, 500, `Error reading file: ${ err }.`);
      }
      else{
        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
        const ext = parse(file).ext;
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', mimeTypes[ext] || 'text/plain');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        if(ext === '.html') res.setHeader('Content-Length', data.length);
        
        res.end(data);
      }
    });
  });
};