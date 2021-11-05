import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet
} from 'react-native';

import PlugAdwise from "../../../assets/graphics/organization/plug_adwise.png";

const { width, height } = Dimensions.get('window');

const CompanyPage = (props) => {
    const { color, style } = props;

    return (
        <View style={[styles.root, style, { backgroundColor: color }]}>
            <Image source={PlugAdwise} style={styles.image} resizeMode="cover"/>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
    },
    image: {
        position: 'absolute',
        left: -50,
        top: -20,
        right: -50,
        bottom: -20,
        width: width + 200,
        height: height
    }
})

CompanyPage.defaultProps = {
    color: '#007BED'
};

export default CompanyPage
