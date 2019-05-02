import { readFileSync } from 'fs';

export default ({ path, res }) => {
  try {
    const index = readFileSync(`${ path }/index.html`, 'utf8');
    
    res.setHeader('Content-type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Length', index.length);
    
    console.log('[USE] index.html');
    res.end(index);
    
    return true;
  }
  catch(err){
    // no index.html found
    return false;
  }
};