import React from 'react';
import {
    View,
    StyleSheet, TouchableOpacity, Text
} from 'react-native';
import {Icon} from "native-base";

const HeaderAccounts = (props) => {
    const {styleRoot, styleTitle, title, navigation, onOpenSearch, search} = props;

    const handleGoBack = () => {
        navigation.goBack();
    }

    const handleGetCountActiveFilter = () => {
        let count = 0;

        if (!!search?.userName) {
            count++
        }
        if (!!search?.isSystem) {
            count++
        }

        return count
    }

    return (
        <View style={[styles.root, styleRoot]}>
            <View style={styles.rootLeft}>
                <TouchableOpacity style={styles.buttonBack} onPress={() => handleGoBack()}>
                    <Icon name={'arrow-left'} style={{color: '#8152E4'}} type={'Feather'}/>
                </TouchableOpacity>
            </View>

            <View style={styles.rootContainerTitle}>
                <Text style={[styles.rootTitle, styleTitle]}>{title}</Text>
            </View>


            {
                !!search && (
                    <View style={styles.rootLeft}>
                        <TouchableOpacity style={styles.buttonBack} onPress={onOpenSearch}>
                            <Icon name={'search'} style={{color: '#8152E4', fontSize: 20}} type={'Feather'}/>

                            {
                                Boolean(handleGetCountActiveFilter() > 0) && (
                                    <View style={styles.buttonBackBadge}>
                                        <Text style={styles.buttonBackBadgeText}>{ handleGetCountActiveFilter() }</Text>
                                    </View>
                                )
                            }
                        </TouchableOpacity>
                    </View>
                )
            }

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

    buttonBack: {
        position: 'relative'
    },

    buttonBackBadge: {
        position: 'absolute',
        top: -4,
        right: -4,

        width: 15,
        height: 15,
        borderRadius: 999,
        backgroundColor: '#8152E4',

        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonBackBadgeText: {
        fontFamily: 'AtypText',
        fontSize: 8,
        lineHeight: 8,
        color: 'white'
    }
})

export default HeaderAccounts
