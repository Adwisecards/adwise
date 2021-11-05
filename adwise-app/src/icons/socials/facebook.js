import React from 'react';
import Svg, {
    Path,
} from "react-native-svg";

const IconFaceBook = (props) => {

    return (
        <Svg width="100%" height="100%" viewBox="0 0 16 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M5.0985 16.6081V29.2727H10.7618V16.6081H14.9845L15.788 11.3696H10.7618V7.97162C10.7618 6.5381 11.4626 5.13997 13.7138 5.13997H16.0003V0.680128C16.0003 0.680128 13.9262 0.326172 11.944 0.326172C7.80272 0.326172 5.0985 2.83572 5.0985 7.37697V11.3696H0.49707V16.6081H5.0985Z" fill={ props.color }/>
        </Svg>
    )
}

IconFaceBook.defaultProps = {
    color: "#3866BB"
}

export default IconFaceBook
