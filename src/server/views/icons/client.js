const els = {};

const handleTabSelect = ({ tabsContentEl, tabEls }) => (tab) => {
  const tabContentNodes = tab.querySelector('tab-content').childNodes;
  const tabContent = [...tabContentNodes].map((node) => node.cloneNode(true));

  // set current tab class
  [...tabEls].forEach((el) => el.classList.remove('current'));
  tab.classList.add('current');
  // update content
  tabsContentEl.innerHTML = '';
  [...tabContent].forEach((el) => {
    tabsContentEl.appendChild(el);
    if(el.nodeName === 'CODE') hljs.highlightBlock(el);
  });
};

const wireUpTabs = () => {
  const tabs = els.panel.querySelectorAll('tabs');
  
  [...tabs].forEach((tabsEl, ndx) => {
    const tabEls = tabsEl.querySelectorAll('tab');
    const tabsRowEl = tabsEl.querySelector('tabs-row');
    const tabsContentEl = tabsEl.querySelector('tabs-content');
    const handler = handleTabSelect({ tabsContentEl, tabEls });

    // Select the first tab on load
    if(ndx === 0) handler(tabEls[0]);

    tabsEl.addEventListener('click', (ev) => {
      if(ev.target.nodeName === 'TAB-TITLE') handler(ev.target.parentNode);
    });
  });
};

const tab = ({ content, title }) => `
  <tab>
    <tab-title>${ title }</tab-title>
    <tab-content>${ content }</tab-content>
  </tab>
`;

const addListeners = () => {
  document.body.addEventListener('click', (ev) => {
    const el = ev.target;
    
    if(el.nodeName === 'BUTTON') {
      switch(el.getAttribute('name')){
        case 'usage': {
          const { name, src } = el.dataset;
          const tabs = [
            tab({
              title: 'img',
              content:
                '<p>Standard img request format.</p>'
                + `<code class="html">&lt;img src="${ window.location.href }${ src }" /&gt;</code>`
              ,
            }),
            tab({
              title: 'svg',
              content:
                '<p>This approach allows for customization of the icon since it adds a copy of the full SVG to the DOM.</p>'
                + '<code class="js">'
                + "import { Icon } from '@ORG/org-react-icon';"
                + '\n'  
                + '\nconst App = () => ('
                + '\n  &lt;div&gt;'
                + '\n    &lt;Icon' 
                + `\n      name="${ name }"`
                + '\n      title="Icon title"'
                + '\n      desc="An icon description"'
                + '\n    /&gt;'
                + '\n  &lt;/div&gt;'
                + '\n);'
                + '\n</code>'
              ,
            }),
            tab({
              title: 'svg link',
              content:
                '<p>This approach has the same benefits of the svg usage, but also trims down Client requests.</p>'
                + '<h4>Server</h4>'
                + '<ul>'
                + '  <li>Downloads and caches the icons on Server startup.</li>'
                + '  <li>Passes icons to Shell</li>'
                + '</ul>'
                + '<code class="js">'
                + "import { getIcons, iconsToSymbols } from '@ORG/org-icons';"
                + '\n\n'
                + '\n// Fetches and caches the specified icons'
                + '\nconst iconsPromise = getIcons({'
                + "\n  icons: ['cake', 'mood', 'mood_bad'],"
                + "\n  version: 'v1.1.0',"
                + '\n});'
                + '\n\n'
                + '\n// Once the icons have been fetched, pass them to your View'
                + '\niconsPromise.then((icons) => {'
                + '\n  renderShell({ icons });'
                + '\n});'
                + '</code>'
                + '<h4>Shell</h4>'
                + '<ul>'
                + '  <li>Inlines the SVGs for link reference usage.</li>'
                + '</ul>'
                + '<code class="js">'
                + 'const shell = ({ icons }) => \`'
                + '\n  &lt;html&gt;'
                + '\n    &lt;body&gt;'
                + '\n      ${ icons }'
                + '\n    &lt;/body&gt;'
                + '\n  &lt;/html&gt;'
                + '\n\`;'
                + '</code>'
                + '<h4>Client</h4>'
                + '<ul>'
                + '  <li>Uses a reference to one of the inlined SVGs</li>'
                + '</ul>'
                + '<code class="js">'
                + "import { IconLink } from '@ORG/org-react-icon';"
                + '\n'  
                + '\nconst App = () => ('
                + '\n  &lt;div&gt;'
                + '\n    &lt;IconLink' 
                + `\n      name="${ name }"`
                + '\n      title="Icon title"'
                + '\n      desc="An icon description"'
                + '\n    /&gt;'
                + '\n  &lt;/div&gt;'
                + '\n);'
                + '\n</code>'
              ,
            }),
          ];
          els.panelContent.innerHTML = `
            <tabs>
              <tabs-row>${ tabs.join('') }</tabs-row>
              <tabs-content></tabs-content>
            </tabs>
          `;
          wireUpTabs();
          els.panel.classList.toggle('open');
          break;
        }

        case 'panel-close':
        case 'panel-mask':
          els.panel.classList.toggle('open');
          break;
      }
    }
  });
};

window.addEventListener('DOMContentLoaded', () => {
  els.panel = document.querySelector('panel');
  els.panelContent = document.querySelector('panel-content');
  els.panelMask = document.querySelector('panel-mask');
  
  addListeners();
});