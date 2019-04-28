import React, { Fragment } from 'react';
import { render } from 'react-dom';

const App = () => (
  <Fragment>
    <style>{`
      .org-icon {
        width: 2em;
        height: 2em;
        fill: currentColor;
        display: inline-block;
        vertical-align: top;
      }
    `}</style>
    <div>Hello</div>
    <svg className="org-icon">
      <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#org-icon_cake"></use>
    </svg>
    <svg className="org-icon">
      <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#org-icon_domain"></use>
    </svg>
    <svg className="org-icon">
      <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#org-icon_mood_bad"></use>
    </svg>
  </Fragment>
);

render(<App />, document.getElementById('root'));