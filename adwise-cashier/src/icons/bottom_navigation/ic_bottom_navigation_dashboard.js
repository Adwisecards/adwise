import React from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

const BottomNavigationDashboard = (props) => {
    const { color } = props;

    return (
        <Svg width="100%" height="100%" viewBox="0 0 100% 100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M41.9999 133V134C41.9999 145.046 50.9542 154 61.9999 154H204C215.046 154 224 145.046 224 134V62C224 50.9543 215.046 42 204 42H203V131C203 132.105 202.104 133 201 133H41.9999Z" fill="#8152E4"/>
            <Rect width="182" height="112" rx="20" fill="#8152E4"/>
        </Svg>
    )
}

export default BottomNavigationDashboard