import React from 'react';
import Svg, {
    Rect,
    Path,
    G,
    Defs,
    ClipPath
} from 'react-native-svg';

const IcLangRu = () => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G clip-Path="url(#clip0)">
                <Path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F0F0F0"/>
                <Path d="M23.2536 16.174C23.736 14.874 24 13.4679 24 12.0001C24 10.5322 23.736 9.12616 23.2536 7.82617H0.746391C0.264047 9.12616 0 10.5322 0 12.0001C0 13.4679 0.264047 14.874 0.746391 16.174L12 17.2174L23.2536 16.174Z" fill="#0052B4"/>
                <Path d="M11.9999 23.9999C17.1595 23.9999 21.558 20.7434 23.2536 16.1738H0.746338C2.44185 20.7434 6.84037 23.9999 11.9999 23.9999Z" fill="#D80027"/>
            </G>
            <Defs>
                <ClipPath id="clip0">
                    <Rect width="24" height="24" fill="white"/>
                </ClipPath>
            </Defs>
        </Svg>
    )
}

export default  IcLangRu