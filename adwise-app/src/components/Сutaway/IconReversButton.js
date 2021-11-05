import React from 'react';
import Svg, {
    Path,
    G,
    Defs,
    LinearGradient,
    Stop
} from 'react-native-svg';

const IconReversButton = (props) => {
    const { color, iconColor } = props;

    return (
        <Svg width="100%" height="100%" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M0 0H42C46.4183 0 50 3.58172 50 8V50L0 0Z" fill={ color }/>
            {/*<Path d="M0 0H42C46.4183 0 50 3.58172 50 8V50L0 0Z" fill="url(#paint0_linear)" fill-opacity="0.1" style="mix-blend-mode:multiply"/>*/}
            <Path opacity="0.5" d="M23.7371 12.7085L27.84 16.8114C28.3106 17.282 29.1047 16.9585 29.1047 16.2967L29.1047 13.6643C33.9723 13.6643 37.9282 17.6202 37.9282 22.4879C37.9282 23.6496 37.7076 24.782 37.2812 25.7967C37.0606 26.3261 37.2223 26.9291 37.6194 27.3261C38.3694 28.0761 39.6341 27.8114 40.0312 26.8261C40.5753 25.4879 40.8694 24.0173 40.8694 22.4879C40.8694 15.9879 35.6047 10.7232 29.1047 10.7232L29.1047 8.09081C29.1047 7.42905 28.3106 7.10552 27.8547 7.57611L23.7518 11.6791C23.4576 11.9585 23.4576 12.4291 23.7371 12.7085Z" fill={ iconColor }/>
            <Defs>
                <LinearGradient id="paint0_linear" x1="25" y1="25" x2="29.1667" y2="20.8333" gradientUnits="userSpaceOnUse">
                    <Stop/>
                    <Stop offset="1" Stop-color="white" Stop-opacity="0"/>
                </LinearGradient>
            </Defs>
        </Svg>
    )
}

IconReversButton.defaultProps = {
    color: '#007BED',
    iconColor: 'white'
}

export default IconReversButton