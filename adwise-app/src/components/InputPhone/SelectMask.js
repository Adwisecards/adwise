import React, {useState} from 'react';
import {
    View,
    Text,
    Image,
    Platform,
    FlatList,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';

import listMask from '../../constants/phone-number-masks';
import Modal from "react-native-modal";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const behavior = (Platform.OS == 'ios') ? 'padding' : 'height';
const {height} = Dimensions.get('window');

const ItemFlatList = (props) => {
    const {code, icon, id, name, useIcon, currentMask, onChange} = props;

    const handleOnActive = () => {
        onChange(id)
    }

    const active = currentMask === id;

    return (
        <TouchableOpacity
            style={[
                styles.buttonMask,
                active && styles.buttonMaskActive
            ]}
            onPress={handleOnActive}
        >
            <View style={styles.buttonMaskIcon}>
                {
                    useIcon ? (
                        <icon/>
                    ) : (
                        <Image
                            source={icon}
                            style={{width: 20, height: 20}}
                        />
                    )
                }
            </View>
            <Text style={styles.buttonMaskCode}>{code}</Text>
            <Text style={[
                styles.buttonMaskName,
                active && styles.buttonMaskNameActive
            ]}>{name}</Text>
        </TouchableOpacity>
    )
}

const SelectMask = (props) => {
    const {mask, onChangeMask} = props;
    const [openList, setOpenList] = useState(false);

    if (!mask || Object.keys(mask).length <= 0) {
        return null
    }

    const handleOpenList = () => {
        setOpenList(true)
    }
    const handleChangeMask = (id) => {
        onChangeMask(id);
        setOpenList(false)
    }

    const useIcon = mask.useIcon || false;
    const Icon = mask.icon || null;

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.button
                ]}

                _onPress={handleOpenList}
            >
                <View style={styles.buttonIcon}>
                    {
                        useIcon ? (
                            <Icon/>
                        ) : (
                            <Image
                                source={mask.icon}
                                style={{width: 20, height: 20}}
                            />
                        )
                    }
                </View>

                <Text
                    style={[
                        styles.buttonText
                    ]}
                >{mask.code}</Text>
            </TouchableOpacity>


            <Modal
                isVisible={openList}
                backdropColor={'black'}
                backdropOpacity={0.5}

                animationInTiming={500}
                animationOutTiming={500}

                swipeDirection={'down'}

                onBackdropPress={() => setOpenList(false)}
                onSwipeComplete={() => setOpenList(false)}
                onBackButtonPress={() => setOpenList(false)}

                style={styles.modalBottom}
            >
                <KeyboardAvoidingView behavior={behavior}>
                    <View style={styles.modalContent}>
                        <SafeAreaView style={{flex: 1}}>
                            <FlatList
                                data={listMask}
                                contentContainerStyle={{paddingHorizontal: 8, paddingVertical: 24}}
                                renderItem={({item}) => (
                                    <ItemFlatList
                                        currentMask={mask.id}
                                        onChange={handleChangeMask}
                                        {...item}
                                    />
                                )}
                            />
                        </SafeAreaView>

                        <TouchableOpacity style={styles.buttonModal} onPress={() => setOpenList(false)}>
                            <Text style={styles.buttonModalText}>{allTranslations(localization.commonDone)}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    )
};

const styles = StyleSheet.create({
    button: {
        height: 50,

        flexDirection: 'row',
        alignItems: 'center',

        borderRadius: 10,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',

        backgroundColor: 'white',

        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    buttonIcon: {
        width: 20,
        height: 20,
    },
    buttonText: {
        fontSize: 20,
        lineHeight: 20,
        letterSpacing: 0.5,
        marginLeft: 4,
        fontFamily: 'AtypText'
    },

    modalBottom: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        height: height * 0.5,

        backgroundColor: 'white',

        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },

    buttonMask: {
        flexDirection: 'row',
        alignItems: 'center',

        borderRadius: 8,

        paddingHorizontal: 8,
        paddingVertical: 8,

        marginVertical: 4,
    },
    buttonMaskActive: {
        backgroundColor: 'rgba(129, 82, 228, 0.09)'
    },
    buttonMaskIcon: {
        width: 25,
        height: 25
    },
    buttonMaskCode: {
        fontSize: 20,
        lineHeight: 20,
        fontFamily: 'AtypText',

        width: 55,
        marginHorizontal: 4
    },
    buttonMaskName: {
        fontSize: 20,
        lineHeight: 20,
        fontFamily: 'AtypText',
        opacity: 0.3
    },
    buttonMaskNameActive: {
        opacity: 1
    },

    buttonModal: {
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    buttonModalText: {
        fontSize: 18,
        lineHeight: 18,
        fontFamily: 'AtypText_medium',

        color: '#ED8E00'
    }
})

export default SelectMask
