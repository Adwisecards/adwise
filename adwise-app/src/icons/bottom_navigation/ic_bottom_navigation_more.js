import React from 'react';
import Svg, { Circle, Rect, Path, G } from 'react-native-svg';

const BottomNavigationMore = (props) => {
    const { color, opacity } = props;

    return (
        <Svg width="23" height="5" viewBox="0 0 23 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G opacity={ opacity }>
                <Circle cx="3" cy="2.5" r="2.5" transform="rotate(90 3 2.5)" fill={ color }/>
                <Circle cx="20.5" cy="2.5" r="2.5" transform="rotate(90 20.5 2.5)" fill={ color }/>
                <Circle cx="11.75" cy="2.5" r="2.5" transform="rotate(90 11.75 2.5)" fill={ color }/>
            </G>
        </Svg>
    )
}

BottomNavigationMore.defaultProps = {
    opacity: 0.8,
    color: '#808080'   
}

export default BottomNavigationMore