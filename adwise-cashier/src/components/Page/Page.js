import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet
} from 'react-native';
import imageBackground from "../../../assets/graphics/login/bg.png";
import getHeightStatusBar from "../../helper/getHeightStatusBar";

const heightStatusBat = getHeightStatusBar();
const { width, height } = Dimensions.get('window');

const Page = (props) => {
    const { children, style, styleImage } = props;

    return (
        <View style={[styles.root, { paddingTop: heightStatusBat }, props.styleContainer]}>
            <Image
                style={[styles.imageBackground, styleImage]}
                source={imageBackground}
            />

            <View style={[styles.container, style]}>
                { props.children }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    container: {
        flex: 1
    },

    imageBackground: {
        width: width,
        height: height + heightStatusBat,

        left: 0,
        right: 0,
        bottom: 0,
        top: 0,

        position: 'absolute',
        resizeMode: "cover"
    },
})

export default Page
