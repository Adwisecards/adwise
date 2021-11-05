import React from "react";
import Svg, {
    Path
} from 'react-native-svg';

const MapPoint = (props) => {
    return (
        <Svg width="100%" height="100%" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M5 0C2.23571 0 0 2.25064 0 5.03338C0 8.03184 3.15714 12.1664 4.45714 13.7411C4.74286 14.0863 5.26429 14.0863 5.55 13.7411C6.84286 12.1664 10 8.03184 10 5.03338C10 2.25064 7.76429 0 5 0ZM5 6.83102C4.01429 6.83102 3.21429 6.02568 3.21429 5.03338C3.21429 4.04109 4.01429 3.23575 5 3.23575C5.98571 3.23575 6.78571 4.04109 6.78571 5.03338C6.78571 6.02568 5.98571 6.83102 5 6.83102Z" fill={ props.color }/>
        </Svg>
    )
};

MapPoint.defaultProps = {
    color: "#ED8E00"
};

export default MapPoint
