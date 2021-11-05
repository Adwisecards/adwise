import React from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

const BottomNavigationOrders = (props) => {
    const { color, opacity } = props;

    return (
        <Svg width="100%" height="100%" viewBox="0 0 100 73" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path opacity={opacity} d="M90.9091 9.125H45.4545L39.0455 2.69187C37.3182 0.958125 35 0 32.5909 0H9.09091C4.09091 0 0.0454545 4.10625 0.0454545 9.125L0 63.875C0 68.8938 4.09091 73 9.09091 73H90.9091C95.9091 73 100 68.8938 100 63.875V18.25C100 13.2312 95.9091 9.125 90.9091 9.125ZM63.6364 50.1875C63.6364 52.7074 61.6014 54.75 59.0909 54.75H22.7273C20.2169 54.75 18.1818 52.7074 18.1818 50.1875C18.1818 47.6676 20.2169 45.625 22.7273 45.625H59.0909C61.6014 45.625 63.6364 47.6676 63.6364 50.1875ZM81.8182 31.9375C81.8182 34.4573 79.7832 36.5 77.2727 36.5H22.7273C20.2169 36.5 18.1818 34.4573 18.1818 31.9375C18.1818 29.4177 20.2169 27.375 22.7273 27.375H77.2727C79.7832 27.375 81.8182 29.4177 81.8182 31.9375Z" fill={ color }/>
        </Svg>
    )
}

BottomNavigationOrders.defaultProps = {
    opacity: 0.8,
    color: '#808080'
}

export default BottomNavigationOrders