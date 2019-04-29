import React from 'react';
import { string } from 'prop-types';
import styles from './styles';

const Icon = ({
  className,
  desc,
  name,
  title,
}) => {
  const titleId = (title) ? `title__${ name }` : '';
  const descId = (desc) ? `desc__${ name }` : '';
  
  return (
    <svg
      className={`${ styles } org-icon ${ className }`}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
    >
      {title && <title id={titleId}>{title}</title>}
      {desc && <desc id={descId}>{desc}</desc>}
      <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`#org-icon_${ name }`}></use>
    </svg>
  );
};

Icon.propTypes = {
  className: string,
  desc: string,
  name: string,
  title: string,
};
Icon.defaultProps = {
  className: '',
};

export default Icon;