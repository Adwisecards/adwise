import React from "react";
import Svg, {Circle, Line} from "react-native-svg";

const Search = (props) => {

    return (
        <Svg width="100%" height="100%" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Circle cx="7.65967" cy="8.39648" r="6.90967" stroke={props.color} strokeWidth="1.5"/>
            <Line x1="12.9136" y1="13.6108" x2="17.5094" y2="18.2066" stroke={props.color} strokeWidth="1.5"/>
        </Svg>
    )
};

Search.defaultProps = {
    color: '#8152E4'
};

export default Search

