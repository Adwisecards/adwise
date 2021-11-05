import React from 'react';
import Svg, {
    Path,
    G,
    Rect,
    Mask,
    Defs,
    RadialGradient,
    Stop
} from 'react-native-svg';
import {
    View,
    Dimensions,
    StyleSheet
} from 'react-native';

const { width, height } = Dimensions.get('window');

const BackgroundPage = (props) => {
    const {color} = props;

    return (
        <View style={styles.root}>
            <Svg width={ width } height={ height } fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.rootSvg}>
                <Rect width="100%" height="100%" fill="rgba(0, 0, 0, 1)"/>
                <Rect width="100%" height="100%" fill="url(#paint0_radial)"/>
                <Defs>
                    <RadialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(407 642) rotate(90) scale(407 642)">
                        <Stop stopColor="white"/>
                        <Stop offset="1" stopColor={ color }/>
                    </RadialGradient>
                </Defs>
            </Svg>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,

        zIndex: -1,

        opacity: 0.09
    },

    rootSvg: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    }
})

export default BackgroundPage
