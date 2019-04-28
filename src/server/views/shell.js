import getPort from 'UTILS/getPort';
import getMode from 'SERVER/utils/getMode';

export default ({
  bundleScripts,
  prod,
  res,
  rootContent,
  scripts,
  styles,
  svgs,
  title,
}) => {
  const noscriptMsg = (!rootContent)
    ? `<noscript>
        <div>
          You need to enable JavaScript to run this App.
        </div>
      </noscript>`
    : '';
  const _bundleScripts = (bundleScripts)
    ? bundleScripts.map((script) => `<script type="text/javascript" src="${ script }"></script>`).join('\n')
    : '';
  const headScripts = (scripts)
    ? scripts.head.map(({ raw, src }) => {
        return (src)
          ? `<script type="text/javascript" src="${ src }"></script>`
          : `<script type="text/javascript">//<![CDATA[
              ${ raw }
            //]]></script>`
      })
    : [];
  const headStyles = (styles)
    ? styles.map(({ link, style }) => {
        return (style)
          ? `<style>${ style }</style>`
          : `<link rel="stylesheet" href="${ link }">`
      })
    : [];
  const bs = (getMode() === 'dev')
    ? `
      <script id="__bs_script__">//<![CDATA[
        document.write("<script async src='http://HOST:${ getPort() + 1 }/browser-sync/browser-sync-client.js?v=2.26.5'><\\/script>".replace("HOST", location.hostname));
      //]]></script>
    `
    : '';
  const _svgs = (svgs)
    ? `
      <svg style="display:none; position:absolute" width="0" height="0">
        ${ Object.keys(svgs).map((name) => svgs[name].replace(/svg/g, `symbol id="org-icon_${name}"`)) }
      </svg>
    `
    : '';
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  return `
    <html>
    <head>
      <title>${ title }</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        *, *::before, *::after {
          box-sizing: border-box;
        }
        html, body {
          padding: 0;
          margin: 0;
        }
        body {
          font-family: Helvetica, Arial, sans-serif;
          background: #eee;
        }
        body > noscript {
          font-size: 1.2em;
          font-weight: bold;
          text-align: center;
          padding: 1em;
          background: #80003b;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10;
        }
        body > noscript > div {
          width: 80%;
          color: #fff;
          text-shadow: 0px 2px 2px #000;
          display: inline-block;
        }
        code {
          padding: 0.1em 0.5em;
          border-radius: 0.25em;
          margin-bottom: -1px;
          background: #00000020;
          display: inline-block;
          vertical-align: top;
        }
        button {
          cursor: pointer;
        }
        button:disabled {
          cursor: default;
        }
      </style>
      ${ headStyles.join('\n') }
      ${ headScripts.join('\n') }
    </head>
    <body>
      ${ _svgs }
      ${ noscriptMsg }
      <div id="root">${ rootContent || '' }</div>
      ${ _bundleScripts }
      ${ bs }
    </body>
    </html>
  `;
};