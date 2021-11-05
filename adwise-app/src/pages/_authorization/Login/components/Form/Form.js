import React, {useState, useRef} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {Text} from "native-base";
import {
    Input as InputCustom,
    InputPhone as InputPhoneDefault
} from "../../../../../components";
import {compose} from "recompose";
import {handleTextInput, withNextInputAutoFocusForm, withNextInputAutoFocusInput} from "react-native-formik";
import {Formik} from "formik";
import * as Yup from "yup";
import localization from "../../../../../localization/localization";
import allTranslations from "../../../../../localization/allTranslations";


const Input = compose(
    handleTextInput,
    withNextInputAutoFocusInput
)(InputCustom);
const InputPhone = compose(
    handleTextInput,
    withNextInputAutoFocusInput
)(InputPhoneDefault);
const FormView = withNextInputAutoFocusForm(View);

const validationSchemes = Yup.object().shape({
    login: Yup.string(allTranslations(localization.yupString)).required(allTranslations(localization.yupRequired)),
    password: Yup.string(allTranslations(localization.yupString)).required(allTranslations(localization.yupRequired)).min(6, allTranslations(localization.yupMin, {length: 6}))
});

const Form = (props) => {
    const {form, onSubmit, navigation} = props;

    const refForm = useRef();

    const handleSubmit = (form, {setErrors, resetForm}) => {
        onSubmit(form, {setErrors, resetForm})
    }
    const handleGoForgot = () => {
        navigation.navigate('ResetPasswordHome');
    }
    const handleOnChange = (value, name) => {
        let newForm = {...refForm.current.values};
        newForm[name] = value;

        refForm.current?.setValues(newForm);
    }

    return (

        <Formik
            innerRef={refForm}

            onSubmit={handleSubmit}
            initialValues={form}
            validationSchema={validationSchemes}
        >
            {
                props => {
                    const values = props.values;
                    return (
                        <FormView>
                            <View>
                                <View style={[styles.itemForm, {marginBottom: 40}]} keyboardShouldPersistTaps="handled">
                                    <Text
                                        style={[styles.title]}>{allTranslations(localization.authorizationFormsPhone)}</Text>
                                    <InputPhone
                                        name={'login'}
                                        value={values.login}
                                        onChangeText={(value) => handleOnChange(value, 'login')}
                                    />
                                </View>

                                <View style={[styles.itemForm, {marginBottom: 15}]} keyboardShouldPersistTaps="handled">
                                    <Text
                                        style={[styles.title]}>{allTranslations(localization.authorizationFormsPassword)}</Text>
                                    <Input
                                        name={'password'}
                                        autoCapitalize="none"
                                        value={values.password}
                                        styleInput={styles.input}
                                        placeholderTextColor={'rgba(0, 0, 0, 0.2)'}
                                        placeholder={"********"}

                                        styleContainer={{alignItems: 'center'}}
                                        selectTextOnFocus={true}
                                        onChangeText={(value) => handleOnChange(value, 'password')}
                                    />
                                </View>

                                <View style={styles.forgotContainer}>
                                    <TouchableOpacity style={styles.forgotButton} onPress={handleGoForgot}>
                                        <Text
                                            style={styles.forgotButtonText}>{allTranslations(localization.authorizationButtonsForgotPassword)}</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity style={styles.buttonNext} onPress={props.handleSubmit}>
                                    <Text
                                        style={styles.buttonNextText}>{allTranslations(localization.authorizationButtonsEntry)}</Text>
                                </TouchableOpacity>
                            </View>
                        </FormView>
                    )
                }
            }
        </Formik>
    )
}

const styles = StyleSheet.create({
    root: {},

    itemForm: {},
    title: {
        width: '100%',
        textAlign: 'center',
        fontFamily: 'AtypText',
        color: 'black',
        fontSize: 18,
        lineHeight: 22,
        marginBottom: 16
    },
    input: {
        height: 50,
        lineHeight: 23,
        minHeight: 50
    },

    forgotContainer: {
        alignItems: 'center',
        marginBottom: 10
    },
    forgotButton: {
        paddingHorizontal: 30,
        paddingVertical: 10
    },
    forgotButtonText: {
        fontFamily: 'AtypText',
        textAlign: 'center',
        color: '#ED8E00',
        fontSize: 14,
        lineHeight: 16
    },

    buttonNext: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#8152E4',

        marginBottom: 40
    },
    buttonNextText: {
        lineHeight: 48,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'AtypText_medium'
    },

    errorText: {
        fontSize: 12,
        marginTop: 2,
        color: '#F35647'
    },
});

export default Form
