import React from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

const BottomNavigationContacts = (props) => {
    const { color, opacity } = props;

    return (
        <Svg width="100%" height="100%" viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path opacity={ opacity } d="M20.5661 0.199997L5.43386 0.199997C4.35191 0.199997 3.46667 1.0775 3.46667 2.15V13.85C3.46667 14.9225 4.35191 15.8 5.43386 15.8H20.5661C21.6481 15.8 22.5333 14.9225 22.5333 13.85V2.15C22.5333 1.0775 21.6481 0.199997 20.5661 0.199997ZM13.3026 2.88125C14.5223 2.88125 15.5157 3.866 15.5157 5.075C15.5157 6.284 14.5223 7.26875 13.3026 7.26875C12.083 7.26875 11.0896 6.284 11.0896 5.075C11.0896 3.866 12.083 2.88125 13.3026 2.88125ZM18.2206 12.875H8.38466V11.4125C8.38466 9.78425 11.66 8.975 13.3026 8.975C14.9453 8.975 18.2206 9.78425 18.2206 11.4125V12.875Z" fill={ color }/>
            <Path opacity={ opacity } d="M24.2667 14.0667L24.2667 1.93333C24.2667 1.45667 24.6567 1.06667 25.1333 1.06667C25.61 1.06667 26 1.45667 26 1.93333L26 14.0667C26 14.5433 25.61 14.9333 25.1333 14.9333C24.6567 14.9333 24.2667 14.5433 24.2667 14.0667Z" fill={ color }/>
            <Path opacity={ opacity } d="M-3.5003e-06 14.0667L-2.90364e-06 1.93333C-2.8802e-06 1.45667 0.389996 1.06667 0.866663 1.06667C1.34333 1.06667 1.73333 1.45667 1.73333 1.93333L1.73333 14.0667C1.73333 14.5433 1.34333 14.9333 0.866662 14.9333C0.389995 14.9333 -3.52374e-06 14.5433 -3.5003e-06 14.0667Z" fill={ color }/>
        </Svg>
    )
}

BottomNavigationContacts.defaultProps = {
    opacity: 0.8,
    color: '#808080'
}

export default BottomNavigationContacts