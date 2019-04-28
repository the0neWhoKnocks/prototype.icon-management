import React, { Fragment } from 'react';
import { render } from 'react-dom';
import Icon from '@ORG/org-react-icon';

const Tag = ({ children, desc, icon, title }) => (
  <div className="tag">
    <Icon name={icon} desc={desc} title={title} />
    <span className="tag-text">
      { children }
    </span>
  </div>
);

const genGradientAnimation = (colors, bg = false) => {
  const inc = 100 / (colors.length - 1);
  return colors.map((color, ndx) => {
    return `${ndx * inc}% { ${ (bg) ? 'background' : 'color' }: ${color}; }`;
  }).join('\n');
};
const textAnim = '-webkit-animation: disco-text 0.5s infinite alternate;';
const bgAnim = '-webkit-animation: disco-bg 0.5s infinite alternate;';

const App = () => (
  <Fragment>
    <style>{`
      #root {
        height: 100%;
      }
      
      .wrapper {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
        left: 0;
        right: 0;
      }
      
      .message {
        color: #333;
        font-size: 2em;
        margin-bottom: 0.5em;
      }
      
      @-webkit-keyframes disco-text {
        ${ genGradientAnimation(['#fbab56', '#fc7732', '#c8d255', '#32bcac', '#6177da', '#c69cde', '#f0bebf']) }
      }
      @-webkit-keyframes disco-bg {
        ${ genGradientAnimation(['#fbab56', '#fc7732', '#c8d255', '#32bcac', '#6177da', '#c69cde', '#f0bebf'], true) }
      }
      
      .tag {
        color: #eee;
        border-radius: 1em 1.5em 0.5em 1em;
        padding: 0 0.5em 0 0.1em;
        margin: 0 0 0 0.1em;
        background: #333;
        display: inline-block;
      }
      .tag .org-icon svg {
        color: #333;
        border-radius: 1em;
        padding: 0.1em;
        margin-right: 0.2em;
        background: #eee;
      }
      
      .party-time {
        ${ bgAnim }
      }
      
      .party-time .tag .tag-text,
      .party-time .tag .org-icon svg {
        ${ textAnim }
      }
    `}</style>
    <div className="wrapper">
      <div className="message">
        <Tag icon="mood" title="smiley face" desc="A smiling face">Happy</Tag>
        <Tag icon="cake" title="cake" desc="A cake with a candle on top">Birthday</Tag> to the
        <Tag icon="mood_bad" title="sad face" desc="A frowning face">Ground</Tag>!!!
      </div>
      <div id="player"></div>
    </div>
  </Fragment>
);

render(<App />, document.getElementById('root'));