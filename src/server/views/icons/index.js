export default ({ manifest }) => {
  const iconCards = Object.keys(manifest).map((icon) => {
    if(icon === '_version') return '';
    
    const src = manifest[icon];
    const relSrc = `/${ src.split('/').slice(3).join('/') }`;
    
    return `
      <icon-card>
        <card>
          <icon-wrapper>
            <icon><img src="${ relSrc }" /></icon>
            <icon-text>${ icon }</icon-text>
          </icon-wrapper>
          <button
            name="usage"
            data-name="${ icon }"
            data-src="${ relSrc }"
          >Usage</button>
        </card>
      </icon-card>
    `;
  }).join('');
  
  return `
    <icon-cards>${ iconCards }</icon-cards>
    <panel>
      <button name="panel-mask"></button>
      <panel-body>
        <nav><button name="panel-close">Close</button></nav>
        <panel-content></panel-content>
      </panel-body>
    </panel>
  `;
};