import React from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

const BottomNavigationBusinessCards = (props) => {
    const { color, opacity } = props;

    return (
        <Svg width="100%" height="67%" viewBox="0 0 100 67" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path opacity={opacity} fillRule="evenodd" clipRule="evenodd" d="M0 4.25383C0 1.90451 1.87289 0 4.18321 0H77.8483C80.1583 0 82.0312 1.90451 82.0312 4.25383V44.4721C82.0312 46.8213 80.1583 48.7257 77.8483 48.7257H4.18321C1.87289 48.7257 0 46.8213 0 44.4721V4.25383ZM32.9428 21.7744C32.9428 28.2498 27.7806 33.499 21.4128 33.499C15.045 33.499 9.88283 28.2498 9.88283 21.7744C9.88283 15.299 15.045 10.0497 21.4128 10.0497C27.7806 10.0497 32.9428 15.299 32.9428 21.7744Z" fill={ color }/>
            <Path opacity={opacity} d="M17.9686 62.7463V56.7038H85.8342C88.1446 56.7038 90.0175 54.7993 90.0175 52.4497V18.2741H95.8167C98.1271 18.2741 100 20.1786 100 22.528V62.7463C100 65.0955 98.1271 67 95.8167 67H22.1518C19.8415 67 17.9686 65.0955 17.9686 62.7463Z" fill={ color }/>
        </Svg>
    )
}

BottomNavigationBusinessCards.defaultProps = {
    opacity: 0.8,
    color: '#808080'
}

export default BottomNavigationBusinessCards
