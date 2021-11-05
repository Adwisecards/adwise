import React from 'react';
import {
    View,
    StyleSheet, TouchableOpacity, Text
} from 'react-native';
import {Icon} from "native-base";

const HeaderAccounts = (props) => {
    const {styleRoot, styleTitle, title, navigation} = props;

    const handleGoBack = () => {
        navigation.goBack();
    }

    return (
        <View style={[styles.root, styleRoot]}>
            {
                (!props.hideBackButton) && (
                    <View style={styles.rootLeft}>
                        <TouchableOpacity style={styles.buttonBack} onPress={() => handleGoBack()}>
                            <Icon name={'arrow-left'} style={{color: '#8152E4'}} type={'Feather'}/>
                        </TouchableOpacity>
                    </View>
                )
            }

            <View style={styles.rootContainerTitle}>
                <Text style={[styles.rootTitle, styleTitle]}>{title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: 22,
        marginTop: 50,

        flexDirection: 'row'
    },

    rootContainerTitle: {
        flex: 1,
        marginLeft: 16
    },
    rootTitle: {
        fontSize: 24,
        lineHeight: 24,
        color: 'black',
        paddingTop: 3,
        fontFamily: 'AtypText_medium'
    },

    rootLeft: {
        width: 30,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rootRight: {
        width: 30
    },

    buttonBack: {}
})

export default HeaderAccounts
