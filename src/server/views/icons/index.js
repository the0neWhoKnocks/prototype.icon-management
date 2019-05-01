export default ({ manifest }) => {
  const iconCards = Object.keys(manifest).map((icon) => {
    if(icon === '_version') return '';
    
    const src = `./${ manifest[icon].split('/').slice(-1).pop() }`;
    
    return `
      <icon-card>
        <card>
          <icon-wrapper>
            <icon><img src="${ src }" /></icon>
            <icon-text>${ icon }</icon-text>
          </icon-wrapper>
          <button
            name="usage"
            data-name="${ icon }"
            data-src="${ src }"
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