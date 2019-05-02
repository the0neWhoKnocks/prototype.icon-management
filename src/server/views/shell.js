import getPort from 'UTILS/getPort';
import getEnv from 'SERVER/utils/getEnv';

export default ({
  bundleScripts,
  icons,
  prod,
  res,
  rootContent,
  scripts,
  styles,
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
  const _icons = (icons) ? icons: '';
  
  if(res) res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
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
      ${ _icons }
      ${ noscriptMsg }
      <div id="root">${ rootContent || '' }</div>
      ${ _bundleScripts }
    </body>
    </html>
  `;
};