import React from 'react';
import {
    View,
    Dimensions,
    StyleSheet
} from 'react-native';
import Svg, {
    Rect,
    Path,
    G,
    Mask,
    Defs,
    ClipPath
} from 'react-native-svg';

const PaymentPurchase = (props) => {
    return (
        <Svg width="39" height="46" viewBox="0 0 39 46" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <G clipPath="url(#clip0)">
                <Path d="M14.9013 37.9645L10.2446 40.5266L5.58787 37.9645L0.931152 40.5266V20.7291V0.931641L5.47145 3.37721L10.1282 0.931641L14.7849 3.37721L19.4416 0.931641L24.0983 3.37721L28.8715 0.931641V20.7291" stroke="#ED8E00" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <Path d="M11.4087 11.4131H23.0505" stroke="#ED8E00" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <Path d="M5.58789 23.0586H19.558" stroke="#ED8E00" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <Path d="M5.58789 27.7168H13.7371" stroke="#ED8E00" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <Path d="M11.4087 16.0713H19.5579" stroke="#ED8E00" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <Path d="M7.91625 11.4131H5.58789" stroke="#ED8E00" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <Path d="M7.91625 16.0713H5.58789" stroke="#ED8E00" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <Path d="M27.7071 45.1847C33.4937 45.1847 38.1847 40.4922 38.1847 34.7037C38.1847 28.9152 33.4937 24.2227 27.7071 24.2227C21.9205 24.2227 17.2295 28.9152 17.2295 34.7037C17.2295 40.4922 21.9205 45.1847 27.7071 45.1847Z" stroke="#ED8E00" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <Path d="M24.7192 36.775H23.8042C23.5042 36.775 23.2492 37.03 23.2492 37.33V37.6C23.2492 37.9 23.5042 38.155 23.8042 38.155H24.7192V39.445C24.7192 39.745 24.9742 40 25.2742 40H25.9942C26.2942 40 26.5492 39.745 26.5492 39.445V38.155H28.4542C28.7542 38.155 29.0092 37.9 29.0092 37.6V37.33C29.0092 37.03 28.7542 36.775 28.4542 36.775H26.5492V35.53H27.9292C30.4192 35.53 31.7542 34.345 31.7542 32.545C31.7542 30.82 30.7942 29.47 27.6892 29.47C27.1192 29.47 26.0242 29.485 25.2742 29.5C24.9592 29.5 24.7192 29.755 24.7192 30.055V34.15H23.8042C23.5042 34.15 23.2492 34.405 23.2492 34.705V34.975C23.2492 35.275 23.5042 35.53 23.8042 35.53H24.7192V36.775ZM26.5492 34.15V31.225C27.0442 31.21 27.5092 31.195 27.8842 31.195C29.1292 31.195 29.8042 31.615 29.8042 32.71C29.8042 33.775 28.9492 34.15 27.8692 34.15H26.5492Z" fill="#ED8E00"/>
            </G>
            <Defs>
                <ClipPath id="clip0">
                    <Rect width="39" height="46" fill="white"/>
                </ClipPath>
            </Defs>
        </Svg>
    )
}

export default PaymentPurchase
