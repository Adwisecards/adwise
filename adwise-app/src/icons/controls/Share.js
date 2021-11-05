import React from "react";
import Svg, {Path} from "react-native-svg";

const Share = (props) => {

    return (
        <Svg width="100%" height="100%" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M15 16H3C2.45 16 2 15.55 2 15V3C2 2.45 2.45 2 3 2H8C8.55 2 9 1.55 9 1C9 0.45 8.55 0 8 0H2C0.89 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V10C18 9.45 17.55 9 17 9C16.45 9 16 9.45 16 10V15C16 15.55 15.55 16 15 16ZM11 1C11 1.55 11.45 2 12 2H14.59L5.46 11.13C5.07 11.52 5.07 12.15 5.46 12.54C5.85 12.93 6.48 12.93 6.87 12.54L16 3.41V6C16 6.55 16.45 7 17 7C17.55 7 18 6.55 18 6V1C18 0.45 17.55 0 17 0H12C11.45 0 11 0.45 11 1Z" fill={ props.color }/>
        </Svg>
    )
};

Share.defaultProps = {
    color: '#8152E4'
};

export default Share

