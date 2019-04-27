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
          const { exp, src } = el.dataset;
          const tabs = [
            tab({
              content: `<code class="html">&lt;img src="${ src }" /&gt;</code>`,
              title: 'img',
            }),
            tab({
              content: `<code class="js">import { ${ exp } } from 'module';</code>`,
              title: 'ES',
            }),
            tab({
              content: `<code class="js">const { ${ exp } } = require('module');</code>`,
              title: 'CJS',
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