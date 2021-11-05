import React, {useEffect, useRef} from "react";
import {
    View,
    Text,
    Image,
    Platform,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {Modalize} from 'react-native-modalize';
import * as Linking from 'expo-linking';
import Logo from "../../../assets/graphics/logos/logo_mini.png";

const ModalUpdateApp = (props) => {
    const {isOpen, onClose} = props;

    if (!isOpen) {
        return null
    }

    const refModalize = useRef();

    useEffect(() => {
        if (!isOpen) {
            return null
        }

        refModalize?.current.open();
    }, [isOpen])

    const handleOnClose = () => {
        refModalize?.current?.close();
    }
    const handleOnUpdate = () => {
        const isIos = Boolean(Platform.OS === 'ios');
        const url = isIos ? 'https://apps.apple.com/ru/app/adwise-cards/id1537570348' : 'https://play.google.com/store/apps/details?id=ad.wise.win';

        Linking.openURL(url);
    }

    return (
        <Modalize ref={refModalize} adjustToContentHeight={true} onClose={onClose}>

            <View style={styles.root}>
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <Image
                            style={{width: 40, height: 40}}
                            source={Logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.logoTitle}>AdWise</Text>
                </View>
                <Text style={styles.title}>Доступна новая версия приложения</Text>
                <Text style={styles.message}>Мы подготовили новую версию приложения. Пожалуйста, обновите её, чтобы оставаться в курсе новых нововедений.</Text>

                <View style={styles.controls}>
                    <TouchableOpacity style={[styles.button, styles.buttonSecondary, {marginBottom: 8}]} onPress={handleOnClose}>
                        <Text style={[styles.buttonText, styles.buttonSecondaryText]}>Отложить</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleOnUpdate}>
                        <Text style={[styles.buttonText, styles.buttonPrimaryText]}>Обновить</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </Modalize>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: "white",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 24
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8
    },
    logo: {
        marginRight: 8
    },
    logoTitle: {
        fontFamily: "AtypText_medium",
        fontSize: 24,
        lineHeight: 30,
        color: "#25233E"
    },
    title: {
        fontFamily: "AtypText_semibold",
        fontSize: 18,
        lineHeight: 22,
        color: "black",
        marginBottom: 8
    },
    message: {
        fontFamily: "AtypText_medium",
        fontSize: 16,
        lineHeight: 20,
        color: "black",
        opacity: 0.8
    },

    controls: {
        marginTop: 12
    },

    button: {
        width: '100%',
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10
    },
    buttonText: {
        fontFamily: "AtypText_medium",
        fontSize: 20,
        lineHeight: 22
    },
    buttonPrimary: {
        backgroundColor: "#8152E4"
    },
    buttonPrimaryText: {
        color: "white"
    },
    buttonSecondary: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#8152E4"
    },
    buttonSecondaryText: {
        color: "#8152E4"
    },
});

export default ModalUpdateApp
