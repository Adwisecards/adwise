import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import Splash from '../Splash/Splash';
import Modal from "react-native-modal";

const ModalLoading = (props) => {
    const {isOpen, textLoading} = props;

    if (!isOpen){
        return null
    }

    return (
        <Modal
            isVisible={isOpen}
            backdropColor={'black'}
            backdropOpacity={0.5}

            animationIn={'pulse'}
            animationOut={'pulse'}

            animationInTiming={1}
            animationOutTiming={1}
        >
            <View style={styles.root}>
                <View style={styles.container}>
                    <Splash
                        styleCustom={styles.splash}
                        textLoading={textLoading}
                    />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    container: {
        borderRadius: 10,
        padding: 30
    },
    splash: {
        flex: null
    }
});

export default ModalLoading
