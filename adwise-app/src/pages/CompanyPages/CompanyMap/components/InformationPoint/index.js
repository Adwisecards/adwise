import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native";

const InformationPoint = (props) => {
    const { isOpen, logo, title, description, onClose, onGetDirections, onClickLogo } = props;

    if (!isOpen) {
        return null
    }

    return (
        <View style={styles.root}>

            <View style={{flexDirection: "row"}}>
                <View style={{marginRight: 8}}>
                    <TouchableOpacity onPress={onClickLogo ? onClickLogo : null} activeOpacity={onClickLogo ? 0.6 : 1}>
                        <Image
                            source={{uri: logo}}
                            style={{width: 40, height: 40, borderRadius: 999}}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                <View>
                    <Text style={styles.title}>{ title }</Text>
                    <Text style={styles.description}>{ description }</Text>
                </View>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity style={[styles.button, styles.buttonFilled]} onPress={() => onGetDirections(props)}>
                    <Text style={[styles.buttonText, styles.buttonFilledText]}>Проложить маршрут</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={onClose}>
                    <Text style={[styles.buttonText, styles.buttonOutlineText]}>Закрыть</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: "white",
        borderRadius: 8,
        overflow: "hidden",
        paddingVertical: 12,
        paddingHorizontal: 16,

        marginTop: 12
    },

    title: {
        fontFamily: "AtypText_semibold",
        fontSize: 14,
        lineHeight: 17,
        color: 'black',
        marginBottom: 4
    },
    description: {
        fontFamily: "AtypText_medium",
        fontSize: 10,
        lineHeight: 12,
        color: 'black',
        opacity: 0.5
    },

    controls: {
        marginTop: 8,
        marginLeft: -16,
        flexDirection: 'row'
    },

    button: {
        flex: 1,
        marginLeft: 16,
        height: 30,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: "AtypText_medium",
        fontSize: 12,
        lineHeight: 14
    },
    buttonFilled: {
        backgroundColor: "#8152E4"
    },
    buttonFilledText: {
        color: 'white'
    },
    buttonOutline: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#8152E4'
    },
    buttonOutlineText: {
        color: '#8152E4'
    },
});

export default InformationPoint
