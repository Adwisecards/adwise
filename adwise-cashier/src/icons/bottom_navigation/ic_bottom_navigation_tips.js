import React from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

const BottomNavigationTips = (props) => {

    const color = '#8152E4';

    return (
        <Svg width="100%" height="100%" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M12.9995 16.7866H15.5709C16.0281 16.7866 16.4281 17.1866 16.4281 17.6437V24.2151" stroke={ color } strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M1 24.2151V17.6437C1 17.1866 1.4 16.7866 1.85714 16.7866H4.42857" stroke={ color } strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M16.4286 21.3579H1" stroke={ color } strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M11.8575 19.0723H5.57178" stroke={ color } strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M10.1426 12.7866C10.8854 13.2437 11.3426 14.0437 11.3426 14.958C11.3426 16.3866 10.1997 17.5294 8.77113 17.5294C7.34256 17.5294 6.19971 16.3866 6.19971 14.958C6.19971 14.3866 6.37114 13.8151 6.71399 13.4151" stroke={ color } strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M22.1431 9.1294C20.3146 11.3008 17.4003 11.9865 14.6574 11.358L14.086 11.2437L9.62887 12.958C9.11458 13.1294 8.54315 12.9008 8.31458 12.3865C8.14315 11.8723 8.37173 11.3008 8.88601 11.0723L15.286 8.61511" stroke={ color } strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M8.25654 12.3294L6.1994 13.7579C5.85654 13.9865 5.45654 13.9294 5.17083 13.6436C4.88511 13.3579 4.88511 12.8436 5.17083 12.5579L10.4851 7.52937C11.628 6.44365 13.0565 5.7008 14.6565 5.3008L17.2851 4.72937" stroke={ color } strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M25.0001 7.24368L22.7715 9.70082L16.4858 3.98654L18.7144 1.35797" stroke={ color } strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    )
}

export default BottomNavigationTips
