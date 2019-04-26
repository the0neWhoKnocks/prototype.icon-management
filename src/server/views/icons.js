export default ({ manifest }) => {
  
  return Object.keys(manifest).map((icon) => {
    return `
      <div>
        <b>${icon}</b>
        <img src="${manifest[icon]}" />
      </div>
    `;
  }).join('');
};