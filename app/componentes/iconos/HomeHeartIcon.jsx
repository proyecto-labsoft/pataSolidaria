import React from 'react';
import { Svg, Path } from 'react-native-svg';
import PropTypes from 'prop-types';

const HomeHeartIcon = ({ width = 24, height = 24, color = '#000000' }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
    >
      <Path
        fill={color}
        d="M20 20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3zm-2-1V9.157l-6-5.454l-6 5.454V19zm-6-2l-3.359-3.359a2.25 2.25 0 0 1 3.182-3.182l.177.177l.177-.177a2.25 2.25 0 0 1 3.182 3.182z"
      />
    </Svg>
  );
};

HomeHeartIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

export default HomeHeartIcon;