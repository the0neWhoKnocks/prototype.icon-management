import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { Icon, IconLink } from '@ORG/org-react-icon';

const Tag = ({ children, desc, icon, title }) => (
  <div className="tag">
    <IconLink name={icon} desc={desc} title={title} />
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
      
      #player {
        width: 560;
        height: 315;
        margin: 0 auto;
        background: #000;
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
        padding: 0 0.5em 0 1.25em;
        margin: 0 0 0 0.1em;
        background: #333;
        display: inline-block;
        position: relative;
      }
      .tag svg.org-icon {
        color: #333;
        border-radius: 1em;
        padding: 0.1em;
        margin-right: 0.2em;
        background: #eee;
        position: absolute;
        top: 50%;
        left: 2px;
        transform: translateY(-50%);
      }
      
      .party-time {
        ${ bgAnim }
      }
      
      .party-time .tag .tag-text,
      .party-time .tag .org-icon {
        ${ textAnim }
      }
    `}</style>
    <canvas
      id="canvas"
      width="300"
      height="300"
    ></canvas>
    <div className="wrapper">
      <div className="message">
        <Tag icon="mood" title="smiley face" desc="A smiling face">Happy</Tag>
        <Tag icon="cake" title="cake" desc="A cake with a candle on top">Birthday</Tag> to the
        <Tag icon="mood_bad" title="sad face" desc="A frowning face">Ground</Tag>!!!
      </div>
      <div id="player"></div>
      <div>
        <Icon name="people" version="v1.0.0" title="smiley face" desc="A smiling face">Happy</Icon>
        <Icon name="people" version="v1.1.0" title="smiley face" desc="A smiling face">Happy</Icon>
      </div>
    </div>
  </Fragment>
);

render(<App />, document.getElementById('root'));

// API has to load after the DOM's been updated
// https://developers.google.com/youtube/iframe_api_reference
const tag = document.createElement('script');
const firstScriptTag = document.getElementsByTagName('script')[0];
tag.src = 'https://www.youtube.com/iframe_api';
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);