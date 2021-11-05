import React from 'react';
import Svg, {
    Circle,
    Rect,
    Path,
    Defs,
    Stop,
    LinearGradient
} from 'react-native-svg';

const СoupArrow = (props) => {
    return (
        <Svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M0 0H34C38.4183 0 42 3.58172 42 8V42L0 0Z" fill={ props.color }/>
            <Path d="M0 0H34C38.4183 0 42 3.58172 42 8V42L0 0Z" fill="url(#paint0_linear)" fillOpacity="0.1" style="mix-blend-mode:multiply"/>
            <Path opacity="0.5" d="M19.9392 10.6751L23.3856 14.1216C23.7809 14.5169 24.448 14.2451 24.448 13.6892L24.448 11.4781C28.5368 11.4781 31.8598 14.801 31.8598 18.8898C31.8598 19.8657 31.6745 20.8169 31.3162 21.6692C31.1309 22.114 31.2668 22.6204 31.6003 22.954C32.2303 23.584 33.2927 23.3616 33.6262 22.534C34.0833 21.4098 34.3303 20.1745 34.3303 18.8898C34.3303 13.4298 29.908 9.00748 24.448 9.00748L24.448 6.7963C24.448 6.24042 23.7809 5.96866 23.398 6.36395L19.9515 9.81042C19.7045 10.0451 19.7045 10.4404 19.9392 10.6751Z" fill={ props.colorArrow }/>
            <Defs>
                <LinearGradient id="paint0_linear" x1="21" y1="21" x2="24.5" y2="17.5" gradientUnits="userSpaceOnUse">
                    <Stop/>
                    <Stop offset="1" stopColor="white" stopOpacity="0"/>
                </LinearGradient>
            </Defs>
        </Svg>
    )
}

СoupArrow.defaultProps = {
    color: '#8152E4',
    colorArrow: 'white'
};

export default СoupArrow
