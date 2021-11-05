import React from "react";
import {
    View,

    Text,

    Image,

    StyleSheet,

    TouchableOpacity
} from 'react-native';

const Confirmed = (props) => {
    const { purchase } = props;

    return (
        <View style={styles.root}>
            <View style={styles.qrCodeContainer}>
                <Image
                    style={{ flex: 1 }}
                    source={{ uri: purchase.ref.QRCode }}
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    root: {
        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 32
    },

    qrCodeContainer: {
        width: 120,
        height: 120,

        marginBottom: 24
    },
    qrCode: {},

    textCode: {}
})

export default Confirmed
