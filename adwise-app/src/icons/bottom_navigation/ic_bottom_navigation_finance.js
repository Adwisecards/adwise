import React from 'react';
import Svg, { Circle, Rect, Path, G } from 'react-native-svg';

const BottomNavigationFinance = (props) => {
    const { color, opacity } = props;

    return (
        <Svg width="100%" height="100%" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G opacity={ opacity }>
                <Path d="M17.8873 6.80372H21.1641V4.68111C21.1641 4.10898 20.696 3.64087 20.1238 3.64087H4.01238C3.59628 3.64087 3.2322 3.27678 3.2322 2.86068C3.2322 2.44458 3.59628 2.0805 4.01238 2.0805H19.6037V1.04025C19.6037 0.468111 19.1356 0 18.5635 0H2.71207C1.5678 0 0.631577 0.936223 0.631577 2.0805V13.9195C0.631577 15.0638 1.5678 16 2.71207 16H20.1238C20.696 16 21.1641 15.5319 21.1641 14.9598V13.2012H17.8873C16.1189 13.2012 14.6625 11.7449 14.6625 9.97647C14.6625 8.20805 16.1189 6.80372 17.8873 6.80372Z" fill={ color }/>
                <Path d="M21.4241 8.10402H17.8873C16.847 8.10402 15.9628 8.93622 15.9628 10.0285C15.9628 11.0687 16.795 11.9529 17.8873 11.9529H21.4241C21.5802 11.9529 21.6842 11.8489 21.6842 11.6929V8.41609C21.6842 8.20804 21.5802 8.10402 21.4241 8.10402ZM18.3034 10.7566C17.8873 10.7566 17.5232 10.3926 17.5232 9.97646C17.5232 9.56037 17.8873 9.19628 18.3034 9.19628C18.7195 9.19628 19.0836 9.56037 19.0836 9.97646C19.0836 10.3926 18.7195 10.7566 18.3034 10.7566Z" fill={ color }/>
            </G>
        </Svg>
    )
}

BottomNavigationFinance.defaultProps = {
    opacity: 0.8,
    color: '#808080'   
}

export default BottomNavigationFinance