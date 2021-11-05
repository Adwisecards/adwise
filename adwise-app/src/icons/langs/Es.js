import React from "react";
import Svg, {
    Rect,
    Path,
    Defs,
    ClipPath,
    G
} from 'react-native-svg';

const Es = () => {

    return (
        <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G clipPath="url(#clip0)">
                <Path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#C60B1A"/>
                <Path d="M23.2536 16.174C23.736 14.874 24 13.4679 24 12.0001C24 10.5322 23.736 9.12616 23.2536 7.82617H0.746391C0.264047 9.12616 0 10.5322 0 12.0001C0 13.4679 0.264047 14.874 0.746391 16.174L12 17.2174L23.2536 16.174Z" fill="#FFC400"/>
                <Path d="M12.0035 23.9999C17.1631 23.9999 21.5616 20.7434 23.2571 16.1738H0.749878C2.44539 20.7434 6.84391 23.9999 12.0035 23.9999Z" fill="#C60B1A"/>
            </G>
            <Defs>
                <ClipPath id="clip0">
                    <Rect width="24" height="24" fill="white"/>
                </ClipPath>
            </Defs>
        </Svg>
    )
};

export default Es
