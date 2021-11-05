import React from "react";
import Svg, {Path} from "react-native-svg";

const Scheduler = (props) => {

    return (
        <Svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fillRule="evenodd" clipRule="evenodd" d="M6.00002 4H4.00002V3H2V6H18V3H16V4H14V3H6.00002V4ZM18 8H2V18H18V8ZM14 1H6.00002V0H4.00002V1H2C0.89543 1 0 1.89543 0 3V18C0 19.1046 0.89543 20 2 20H18C19.1046 20 20 19.1046 20 18V3C20 1.89543 19.1046 1 18 1H16V0H14V1ZM7 12H5V10H7V12ZM9 12H11V10H9V12ZM15 12H13V10H15V12ZM5 16H7V14H5V16ZM11 16H9V14H11V16Z" fill={ props.color }/>
        </Svg>
    )
};

Scheduler.defaultProps = {
    color: '#8152E4'
};

export default Scheduler

