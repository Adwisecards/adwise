import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';

import SelectMask from './SelectMask';

import ListMask from '../../constants/phone-number-masks';
import {TextInputMask} from "react-native-masked-text";

const InputPhone = (props) => {
    const {onChangeText, value, formik, onChangeCountry} = props;
    const [currentMask, setCurrentMask] = useState({});

    useEffect(() => {
        (async () => {
            await handleSetCurrentMask()
        })();
    }, []);

    const handleSetCurrentMask = async () => {
        const indexCurrentMask = await AsyncStorage.getItem('current-mask-phone') || '0';
        const currentMask = ListMask.find((mask) => mask.id === indexCurrentMask);

        setCurrentMask(currentMask)
    }
    const handleChangeMask = async (maskId) => {
        onChangeText('');

        await AsyncStorage.setItem('current-mask-phone', maskId)

        const currentMask = ListMask.find((mask) => mask.id === maskId);
        setCurrentMask(currentMask);

        onChangeCountry ? onChangeCountry() : null
    }

    const handleChangePhoneText = (value) => {
        onChangeText(`${ currentMask.code }${ value }`);
    }

    const inputMask = currentMask.mask || "(999) 999-99-99";
    const placeholder = currentMask.placeholder || "(___) ___-__-__";

    const valueInput = value.replace(currentMask.code, '');

    return (
        <>
            <View style={styles.root}>
                <SelectMask
                    mask={currentMask}
                    onChangeMask={handleChangeMask}
                />

                <TextInputMask
                    value={valueInput}
                    onChangeText={handleChangePhoneText}

                    style={[styles.input]}

                    keyboardType={'phone-pad'}
                    placeholder={placeholder}

                    type={'custom'}
                    options={{ mask: inputMask }}
                />
            </View>

            {
                (formik && props.error) && (
                    <Text style={styles.errorText}>{ props.error }</Text>
                )
            }
        </>
    )
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50
    },

    input: {
        flex: 1,

        height: 50,

        borderRadius: 10,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',

        backgroundColor: 'white',

        paddingHorizontal: 12,

        marginLeft: 8,

        fontSize: 20,
        fontFamily: 'AtypText'
    },

    errorText: {
        fontSize: 12,
        marginTop: 2,
        color: '#F35647'
    },
});

InputPhone.propTypes = {
    onChangeText: PropTypes.func.isRequired
};

export default InputPhone
