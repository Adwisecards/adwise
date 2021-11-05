import React from 'react';
import Svg, {
    Circle,
    Rect,
    Path,
    Defs,
    Stop,
    LinearGradient
} from 'react-native-svg';

const LineNavigationBottom = (props) => {
    return (
        <Svg width="100%" height="3" viewBox="0 0 150 3" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M0 2C0 0.895431 0.895431 0 2 0H42C43.1046 0 44 0.895431 44 2V3H0V2Z" fill="#8252E4"/>
        </Svg>
    )
}

LineNavigationBottom.defaultProps = {
    color: '#8152E4'
};

export default LineNavigationBottom
