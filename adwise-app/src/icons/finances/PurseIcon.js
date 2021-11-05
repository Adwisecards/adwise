import React from 'react';
import {
    View,
    Dimensions,
    StyleSheet
} from 'react-native';
import Svg, {
    Rect,
    Path,
    G,
    Mask
} from 'react-native-svg';

const PurseIcon = () => {
    return (
        <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M20 4.28V2C20 0.9 19.1 0 18 0H2C0.89 0 0 0.9 0 2V16C0 17.1 0.89 18 2 18H18C19.1 18 20 17.1 20 16V13.72C20.59 13.37 21 12.74 21 12V6C21 5.26 20.59 4.63 20 4.28ZM19 6V12H12V6H19ZM2 16V2H18V4H12C10.9 4 10 4.9 10 6V12C10 13.1 10.9 14 12 14H18V16H2Z" fill="#ED8E00"/>
            <Path d="M15 10.5C15.8284 10.5 16.5 9.82843 16.5 9C16.5 8.17157 15.8284 7.5 15 7.5C14.1716 7.5 13.5 8.17157 13.5 9C13.5 9.82843 14.1716 10.5 15 10.5Z" fill="#ED8E00"/>
        </svg>

    )
}

export default PurseIcon
