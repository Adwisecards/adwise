import React, {useEffect, useState, useRef} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform, Image
} from "react-native";
import {
    DatePicker,
    Input as InputCustom,
    InputPhone as InputPhoneDvefault,
    Picker
} from '../../../../components';
import Modal from "react-native-modal";
import * as Yup from "yup";
import regexp from "../../../../constants/regexp";
import {Formik} from "formik";
import {
    handleTextInput,
    withNextInputAutoFocusForm,
    withNextInputAutoFocusInput
} from "react-native-formik";
import {compose} from "recompose";
import i18n from "i18n-js";
import iconDatePicker from "../../../../../assets/graphics/account/account_date_picker.png";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const Input = compose(
    handleTextInput,
    withNextInputAutoFocusInput
)(InputCustom);
const InputPhone = compose(
    handleTextInput,
    withNextInputAutoFocusInput
)(InputPhoneDvefault);
const Form = withNextInputAutoFocusForm(View);

const behavior = Platform.OS == 'ios' ? 'padding' : 'height';

const genderList = [
    {
        value: 'male',
        label: allTranslations(localization.genderMale)
    },
    {
        value: 'female',
        label: allTranslations(localization.genderFemale)
    },
    {
        value: 'other',
        label: allTranslations(localization.genderOther)
    }
];

const ModalForm = (props) => {
    const {typeModalEdit, form, onChange, onSubmit, isOpen, onClose} = props;
    const [regexpCurrent, setRegexpCurrent] = useState(null);
    const [validationSchema, setValidationSchema] = useState({});
    const refFormik = useRef();

    useEffect(() => {
        (async () => {
            const regexpObject = await regexp();
            setRegexpCurrent(regexpObject);
        })()
    }, [])
    useEffect(() => {
        const mode = typeModalEdit;

        handleGetValidationSchema(mode)
    }, [isOpen])

    const handleChangeForm = (form) => {
        onSubmit(form)
    }
    const handleGetValidationSchema = (mode) => {
        let validationFields = {};

        if (mode === 'phone') {
            const phoneRegExp = regexpCurrent.phone;

            validationFields['phone'] = Yup.string(allTranslations(localization.yupString)).matches(phoneRegExp, allTranslations(localization.yupPhone));
        }
        if (mode === 'email') {
            validationFields['email'] = Yup.string(allTranslations(localization.yupString)).required(allTranslations(localization.yupRequired)).email(allTranslations(localization.yupEmail));
        }

        setValidationSchema(Yup.object().shape(validationFields));
    }

    const handleChangeValidation = () => {
        const mode = typeModalEdit;

        handleGetValidationSchema(mode)
    }
    const handleChangeItemForm = async (name, value) => {
        await refFormik.current.setFieldValue(name, value);
    }

    return (
        <Modal
            isVisible={isOpen}
            backdropColor={'black'}
            backdropOpacity={0.5}

            animationInTiming={500}
            animationOutTiming={500}

            swipeDirection={'down'}

            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            onBackButtonPress={onClose}

            style={styles.modalBottom}
        >
            <KeyboardAvoidingView behavior={behavior}>
                <View style={styles.modalContent}>
                    <Formik
                        innerRef={refFormik}

                        onSubmit={handleChangeForm}
                        initialValues={form}
                        validationSchema={validationSchema}
                    >
                        {props => {
                            switch (typeModalEdit){
                                case 'phone': {
                                    return <FormPhone {...props}/>
                                }
                                case 'email': {
                                    return <FormEmail {...props}/>
                                }
                                case 'lastName': {
                                    return <FormLastName {...props}/>
                                }
                                case 'firstName': {
                                    return <FormFirstName {...props}/>
                                }
                                case 'gender': {
                                    return <FormGender {...props} onChangeForm={(value) => handleChangeItemForm('gender', value)}/>
                                }
                                case 'dob': {
                                    return <FormDob {...props} onChangeForm={(value) => handleChangeItemForm('dob', value)}/>
                                }
                            }
                        }}
                    </Formik>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const FormPhone = (props) => {
    const {handleChangeValidation} = props;

    return (
        <>
            <Form>
                <Text style={styles.title}>{ allTranslations(localization.profilePhone) }</Text>

                <InputPhone
                    name={'phone'}
                    value={props.values.phone}

                    onChangeCountry={handleChangeValidation}
                />

                <TouchableOpacity
                    style={styles.buttonSubmit}
                    onPress={() => props.handleSubmit()}
                >
                    <Text style={styles.buttonSubmitText}>{ allTranslations(localization.profileChange) } {props.isValidating}</Text>
                </TouchableOpacity>
            </Form>
        </>
    )
}
const FormEmail = (props) => {
    return (
        <>
            <Form>
                <Text style={styles.title}>E-mail</Text>

                <Input
                    name={'email'}
                    autoCapitalize='none'
                    value={props.values.email}
                    placeholder={'E-mail'}
                />

                <TouchableOpacity style={styles.buttonSubmit} onPress={() => props.handleSubmit()}>
                    <Text style={styles.buttonSubmitText}>{ allTranslations(localization.profileChange) }</Text>
                </TouchableOpacity>
            </Form>
        </>
    )
}
const FormDob = (props) => {
    return (
        <>
            <Form>
                <Text style={styles.title}>{ allTranslations(localization.profileDateBirth) }</Text>

                <DatePicker
                    name={'dob'}
                    mode={'date'}
                    value={props.values.dob}
                    styleButton={styles.datePicker}

                    onChange={props.onChangeForm}
                />

                <TouchableOpacity style={styles.buttonSubmit} onPress={() => props.handleSubmit()}>
                    <Text style={styles.buttonSubmitText}>{ allTranslations(localization.profileChange) }</Text>
                </TouchableOpacity>
            </Form>
        </>
    )
}
const FormLastName = (props) => {
    return (
        <>
            <Form>
                <Text style={styles.title}>{ allTranslations(localization.profileSurname) }</Text>

                <Input
                    name={'lastName'}
                    autoCapitalize='none'
                    value={props.values.lastName}
                    placeholder={'Иванов'}
                />

                <TouchableOpacity style={styles.buttonSubmit} onPress={() => props.handleSubmit()}>
                    <Text style={styles.buttonSubmitText}>{ allTranslations(localization.profileChange) }</Text>
                </TouchableOpacity>
            </Form>
        </>
    )
}
const FormFirstName = (props) => {
    return (
        <>
            <Form>
                <Text style={styles.title}>{ allTranslations(localization.profileName) }</Text>

                <Input
                    name={'firstName'}
                    autoCapitalize='none'
                    value={props.values.firstName}
                    placeholder={'Иванов'}
                />

                <TouchableOpacity style={styles.buttonSubmit} onPress={() => props.handleSubmit()}>
                    <Text style={styles.buttonSubmitText}>{ allTranslations(localization.profileChange) }</Text>
                </TouchableOpacity>
            </Form>
        </>
    )
}
const FormGender = (props) => {
    return (
        <>
            <Form>
                <Text style={styles.title}>{ allTranslations(localization.profileSurname) }</Text>

                <Picker
                    name={'gender'}
                    value={props.values.gender}
                    textInputProps={{ paddingLeft: 30 }}
                    styleRoot={{ height: 50 }}
                    styleSelect={{lineHeight: 38}}
                    items={genderList}

                    onChange={props.onChangeForm}
                />

                <TouchableOpacity style={styles.buttonSubmit} onPress={() => props.handleSubmit()}>
                    <Text style={styles.buttonSubmitText}>{ allTranslations(localization.profileChange) }</Text>
                </TouchableOpacity>
            </Form>
        </>
    )
}

const styles = StyleSheet.create({
    root: {},
    modalBottom: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',

        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,

        padding: 16
    },

    title: {
        fontSize: 18,
        lineHeight: 22,

        fontFamily: 'AtypText_medium',

        marginBottom: 16
    },

    buttonSubmit: {
        width: '100%',
        marginTop: 16,

        borderRadius: 10,
        backgroundColor: '#8152E4',
        paddingVertical: 12
    },
    buttonSubmitText: {
        fontSize: 16,
        lineHeight: 16,
        color: 'white',
        fontFamily: 'AtypText_medium',
        textAlign: 'center'
    },

    datePicker: {
        justifyContent: 'center'
    },

    inputPhone: {
        fontFamily: 'AtypText',
        width: '100%',
        borderRadius: 10,
        paddingVertical: 8,
        backgroundColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',

        paddingLeft: 14,
        paddingRight: 14,
    }
});

export default ModalForm
