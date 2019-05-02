const { repository } = require('ROOT/package.json');
const getPort = require('UTILS/getPort');

module.exports = () => {
  let prodBucket = '';
  
  if(process.env.PROD_BUCKET){
    const { repository } = require('ROOT/package.json');
    const urlParts = repository.url.replace('git+https://github.com/', '').split('/');
    prodBucket = `https://${ urlParts[0] }.github.io/${ urlParts[1] }`;
  }
  
  return `${ (prodBucket) ? prodBucket : `http://localhost:${ getPort() }` }/icons`;
};