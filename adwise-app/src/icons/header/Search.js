import React from "react";
import Svg, {
    Line,
    Circle
} from 'react-native-svg';

const Search = (props) => {
    return (
        <Svg width="100%" height="100%" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Circle cx="5.95745" cy="5.95745" r="5.20745" stroke={props.color} strokeWidth="1.5"/>
            <Line x1="10.1612" y1="9.89521" x2="13.7357" y2="13.4697" stroke={props.color} strokeWidth="1.5"/>
        </Svg>
    )
};

Search.defaultProps = {
    color: "#ED8E00"
};

export default Search
