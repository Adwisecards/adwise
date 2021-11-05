import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import LottieView from 'lottie-react-native';
import Modal from "react-native-modal";
import gifLoading from "../../../assets/preloader_fast.gif";
import localization from "../../localization/localization";
import allTranslations from "../../localization/allTranslations";

class ModalLoading extends React.PureComponent {
    render() {
        const {isOpen, textLoading} = this.props;

        if (!isOpen) {
            return null
        }

        return (
            <Modal
                isVisible={isOpen}
                backdropColor={'black'}
                backdropOpacity={0.7}

                animationIn={'pulse'}
                animationOut={'pulse'}

                animationInTiming={1}
                animationOutTiming={1}
            >
                <View style={styles.root}>
                    <View style={[styles.container]}>

                        <View style={{width: 200, height: 200}}>
                            <LottieView
                                style={{flex: 1}}
                                source={require('../../../assets/lottie/loading/modal_loading.json')}
                                autoPlay
                                loop
                            />
                        </View>

                        <Text style={styles.textLoading}>{textLoading || allTranslations(localization.commonLoadingProgress)}</Text>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    container: {
        borderRadius: 10,
        padding: 30
    },
    splash: {
        flex: null
    },

    textLoading: {
        fontFamily: "AtypText_medium",
        fontSize: 18,
        lineHeight: 20,
        textAlign: "center",
        color: "white",

        marginTop: -24
    }
});

export default ModalLoading
