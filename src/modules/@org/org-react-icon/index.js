import React, { Component } from 'react';
import reactParser from 'html-react-parser';
import { string } from 'prop-types';
import { getIcon } from '@ORG/org-icons';
import styles from './styles';

const basePropTypes = {
  className: string,
  desc: string,
  name: string,
  title: string,
  version: string,
};
const baseDefaultProps = {
  className: '',
};

class Icon extends Component {
  static getManifest(url) {
    return fetch(url).then((resp) => resp.json());
  }
  
  static getSVG(url) {
    return fetch(url).then((resp) => resp.text());
  }
  
  constructor() {
    super();
    
    this.state = {
      svg: undefined,
    };
  }
  
  componentDidMount() {
    const { name, version } = this.props;
    
    getIcon({ icon: name, version }).then((svg) => {
      this.setState({ svg });
    });  
  }
  
  render() {
    const { className, desc, name, title } = this.props;
    const { svg } = this.state;
    
    if(!svg) return null;
    
    const titleId = (title) ? `title__${ name }` : '';
    const descId = (desc) ? `desc__${ name }` : '';
    let cl = `
      class="${ styles } org-icon ${ className }"
      role="img"
    `;
    
    if(titleId || descId) cl += `aria-labelledby="${ titleId } ${ descId }"`;
    
    const titleNode = (title) ? `<title id="${ titleId }">${ title }</title>` : '';
    const descNode = (desc) ? `<desc id="${ descId }">${ desc }</desc>` : '';
    const _svg = svg.replace(/<svg(\b[^>]*)>/, `<svg ${ cl }$1>${ titleNode }${descNode}`);
    
    return reactParser(_svg);
  }
}

Icon.propTypes = {
  ...basePropTypes,
};
Icon.defaultProps = {
  ...baseDefaultProps,
};

const IconLink = ({
  className,
  desc,
  name,
  title,
}) => {
  const titleId = (title) ? `title__${ name }` : '';
  const descId = (desc) ? `desc__${ name }` : '';
  const svgProps = {
    className: `${ styles } org-icon ${ className }`,
    role: 'img',
  };
  
  if(titleId || descId) svgProps['aria-labelledby'] = `${ titleId } ${ descId }`;
  
  return (
    <svg {...svgProps}>
      {title && <title id={titleId}>{title}</title>}
      {desc && <desc id={descId}>{desc}</desc>}
      <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`#org-icon_${ name }`}></use>
    </svg>
  );
};

IconLink.propTypes = {
  ...basePropTypes,
};
IconLink.defaultProps = {
  ...baseDefaultProps,
};

export {
  Icon,
  IconLink,
};