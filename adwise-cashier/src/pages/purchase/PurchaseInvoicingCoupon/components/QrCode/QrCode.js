import React from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {
    Icon
} from 'native-base';

const { width } = Dimensions.get('window');

const QrCode = (props) => {
    return (
        <View style={styles.root}>

            <View style={styles.qrCodeContainer}>
                <Image
                    source={{ uri: props.qrCode }}
                    resizeMode="contain"
                    style={{ flex: 1 }}
                />
            </View>

            <View style={styles.line}>
                <Text style={styles.code}>{ `Предъявите\nQR код покупателю` }</Text>

                {/*<TouchableOpacity style={styles.buttonCopy}>*/}
                {/*    <Icon name="copy" type="Feather" style={styles.buttonCopyIcon}/>*/}
                {/*</TouchableOpacity>*/}

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    qrCodeContainer: {
        width: width * 0.5,
        height: width * 0.5,

        marginBottom: 24
    },

    line: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    code: {
        textAlign: 'center',
        fontSize: 18,
        lineHeight: 22,
        color: '#25233E',
        letterSpacing: 0.2
    },

    buttonCopy: {
        justifyContent: 'center',
        alignItems: 'center',

        width: 40,
        height: 40
    },
    buttonCopyIcon: {
        color: '#ED8E00',
        fontSize: 20
    }
})

export default QrCode
