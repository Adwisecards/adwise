import React, {useState } from 'react';
import {
    Input as InputCustom
} from '../../../../../components';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    handleTextInput,
    withNextInputAutoFocusForm,
    withNextInputAutoFocusInput
} from "react-native-formik";
import {
    Formik
} from "formik";
import {
    compose
} from "recompose";
import * as Yup from "yup";

const Input = compose(
    handleTextInput,
    withNextInputAutoFocusInput
)(InputCustom);

const FormView = withNextInputAutoFocusForm(View);
const validationSchemes = Yup.object().shape({
    login: Yup.string('Введена не строка').required('Обязательно к заполнению'),
    password: Yup.string('Введена не строка').required('Обязательно к заполнению').min(6, "Слишком короткий пароль")
});
const initialValues = {
    login: "",
    password: ""
};


const Form = (props) => {
    const { onLogin } = props;
    const [ showPassword, setShowPassword ] = useState(false);

    const handleSubmit = (form, { setErrors, setFieldError }) => {
        onLogin(form, { setErrors, setFieldError })
    }

    return (
        <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchemes}
        >
            {
                props => {
                    const values = props.values;
                    return (
                        <FormView style={styles.form}>

                            <View style={[styles.itemForm, {marginBottom: 32}]}>
                                {/*<Text style={[styles.title]}>{ 'Введите e-mail или телефон' }</Text>*/}
                                <Input
                                    autoCapitalize="none"
                                    name={'login'}
                                    placeholder="E-mail / телефон"
                                    value={values.login}
                                    style={styles.input}
                                    placeholderTextColor={'rgba(0, 0, 0, 0.2)'}
                                />
                            </View>

                            <View style={[styles.itemForm, {marginBottom: 48}]} keyboardShouldPersistTaps="handled">
                                <Input
                                    autoCapitalize="none"
                                    name={'password'}
                                    value={values.password}
                                    style={styles.input}
                                    typeContainer={'password'}
                                    placeholderTextColor={'rgba(0, 0, 0, 0.2)'}
                                    placeholder={'Пароль'}

                                    styleContainer={{ alignItems: 'center' }}

                                    secureTextEntry={!showPassword}
                                    onChangeSecureTextEntry={(showPassword) => setShowPassword(!showPassword)}
                                />
                            </View>

                            <TouchableOpacity style={styles.buttonNext} onPress={props.handleSubmit}>
                                <Text style={styles.buttonNextText}>Войти</Text>
                            </TouchableOpacity>
                        </FormView>
                    )
                }
            }
        </Formik>
    )
}

const styles = StyleSheet.create({
    root: {},

    form: {
        paddingHorizontal: 24,
        flex: 1
    },

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
        fontSize: 20,
        paddingVertical: 14
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
})

export default Form
