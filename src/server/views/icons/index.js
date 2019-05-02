export default ({ manifest }) => {
  return `
    <script>
      window.manifest = ${ JSON.stringify(manifest) };
    </script>
    <nav class="top-nav">
      <input type="text" name="search" placeholder="Search" />
    </nav>
    <icon-cards></icon-cards>
    <panel>
      <button name="panel-mask"></button>
      <panel-body>
        <nav><button name="panel-close">Close</button></nav>
        <panel-content></panel-content>
      </panel-body>
    </panel>
  `;
};