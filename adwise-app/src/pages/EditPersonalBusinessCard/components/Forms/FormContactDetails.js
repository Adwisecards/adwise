import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {compose} from "recompose";
import {
    handleTextInput,
    withNextInputAutoFocusForm,
    withNextInputAutoFocusInput
} from "react-native-formik";
import {Input as InputCustom} from "../../../../components";
import * as Yup from "yup";
import {Icon} from "native-base";
import {Formik} from "formik";
import regexp from "../../../../constants/regexp";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const Input = compose(
    handleTextInput,
    withNextInputAutoFocusInput
)(InputCustom);
const FormView = withNextInputAutoFocusForm(View);
const validationSchemes = Yup.object().shape({
    email: Yup
        .string(allTranslations(localization.yupString))
        .email(allTranslations(localization.yupEmail))
        .when(['phone'], {
            is: (phone) => !phone,
            then: Yup
                .string(allTranslations(localization.yupString))
                .required(allTranslations(localization.yupRequired))
        }),
    phone: Yup
        .string(allTranslations(localization.yupString))
        .matches(regexp.phone, allTranslations(localization.yupPhone))
        .when(['email'], {
            is: (email) => !email,
            then: Yup
                .string(allTranslations(localization.yupString))
                .required(allTranslations(localization.yupRequired))
        }),
    website: Yup
        .string(allTranslations(localization.yupString))
        .matches(regexp.url, allTranslations(localization.yupRegexpUrl))
}, [['email', 'phone']]);

const ButtonClear = (props) => {
    const {value} = props;

    if (!value) {
        return null
    }

    return (
        <TouchableOpacity style={styles.buttonClear} onPress={props.onPress}>
            <Icon name={'clear'} style={styles.buttonClearIcon} type={'MaterialIcons'}/>
        </TouchableOpacity>
    )
}

const FormContactDetails = (props) => {
    const {setRef, initialForm, onChangeInitialForm} = props;

    const handleChangeForm = (name, value) => {
        let newInitialForm = {...initialForm};

        newInitialForm[name] = value;

        onChangeInitialForm(newInitialForm)
    }

    return (
        <Formik
            innerRef={setRef}
            initialValues={initialForm}
            validationSchema={validationSchemes}
        >
            {
                props => {
                    const values = props.values;

                    return (
                        <FormView>
                            <View style={styles.root}>
                                <View style={styles.formItem}>
                                    <Text
                                        style={styles.formItemTitle}>{allTranslations(localization.editPersonalBusinessCardFormsPhoneTitle)}</Text>
                                    <Input
                                        useMask

                                        name={'phone'}
                                        placeholder={allTranslations(localization.editPersonalBusinessCardFormsPhonePlaceholder)}
                                        value={values.phone}
                                        onChangeText={(value) => handleChangeForm('phone', value)}

                                        autoCapitalize='none'
                                        keyboardType='phone-pad'

                                        type={'custom'}
                                        options={{
                                            mask: '+9 999 999-99-99'
                                        }}

                                        styleContainer={styles.styleContainer}
                                        styleInput={styles.styleInput}
                                        rightChildren={(<ButtonClear value={values.phone}
                                                                     onPress={() => handleChangeForm('phone', '')}/>)}
                                    />
                                </View>
                                <View style={styles.formItem}>
                                    <Text
                                        style={styles.formItemTitle}>{allTranslations(localization.editPersonalBusinessCardFormsEmailTitle)}</Text>
                                    <Input
                                        name={'email'}
                                        value={values.email}

                                        autoCapitalize="none"
                                        placeholder={allTranslations(localization.editPersonalBusinessCardFormsEmailPlaceholder)}

                                        onChangeText={(value) => handleChangeForm('email', value)}

                                        styleContainer={styles.styleContainer}
                                        styleInput={styles.styleInput}
                                        rightChildren={(<ButtonClear value={values.email}
                                                                     onPress={() => handleChangeForm('email', '')}/>)}
                                    />
                                </View>
                                <View style={[styles.formItem, {marginBottom: 0}]}>
                                    <Text
                                        style={styles.formItemTitle}>{allTranslations(localization.editPersonalBusinessCardFormsWebsiteTitle)}</Text>

                                    <Input
                                        name={'website'}

                                        autoCapitalize="none"

                                        value={values.website}
                                        placeholder={allTranslations(localization.editPersonalBusinessCardFormsWebsitePlaceholder)}

                                        onChangeText={(value) => handleChangeForm('website', value)}

                                        styleContainer={styles.styleContainer}
                                        styleInput={styles.styleInput}
                                        rightChildren={(<ButtonClear value={values.website}
                                                                     onPress={() => handleChangeForm('website', '')}/>)}
                                    />
                                </View>
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

    formItem: {
        marginBottom: 24
    },

    formItemTitle: {
        marginBottom: 8,
        fontSize: 16,
        lineHeight: 18,
        opacity: 0.6,
        letterSpacing: 0.01
    },

    styleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingRight: 2,
        backgroundColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
    },
    styleInput: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },

    buttonClear: {
        padding: 15,
        marginVertical: -15
    },
    buttonClearIcon: {
        fontSize: 20,
        opacity: 0.13
    }
});

export default FormContactDetails
