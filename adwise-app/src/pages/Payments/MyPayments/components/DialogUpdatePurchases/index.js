import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {Portal} from 'react-native-portalize';
import {Modalize} from "react-native-modalize";

const DialogUpdatePurchases = (props) => {
    const {innerRef, onUpdate} = props;

    return (
        <Portal>
            <Modalize
                ref={innerRef}
                adjustToContentHeight={true}
                rootStyle={styles.backdrop}
                childrenStyle={styles.childrenStyle}
                snapPoint={100}
            >
                <View style={styles.root}>

                    <Text style={styles.title}>Мои заказы</Text>

                    <Text style={styles.description}>Поступила новая информация по заказам. Обновитесь для просмотра</Text>

                    <TouchableOpacity style={styles.button} onPress={onUpdate}>
                        <Text style={styles.buttonText}>Обновить</Text>
                    </TouchableOpacity>

                </View>
            </Modalize>
        </Portal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(80, 52, 140, 0.8)'
    },
    childrenStyle: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        overflow: 'hidden'
    },

    root: {
        backgroundColor: 'white',
        padding: 24
    },

    title: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: 'black',
        marginBottom: 12
    },
    description: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 18,
        color: 'black',
        marginBottom: 20
    },

    button: {
        height: 40,
        borderRadius: 4,
        backgroundColor: '#8152E4',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'AtypText_medium'
    },
});

export default DialogUpdatePurchases
