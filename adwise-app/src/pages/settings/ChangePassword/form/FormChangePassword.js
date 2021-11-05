import React, {useState, useRef} from "react";
import {
    View,
    Text,
    TouchableOpacity,

    StyleSheet
} from "react-native";
import {compose} from "recompose";
import {
    handleTextInput,
    withNextInputAutoFocusForm,
    withNextInputAutoFocusInput
} from "react-native-formik";
import {
    Input as InputCustom
} from "../../../../components";
import * as Yup from "yup";
import {Formik} from "formik";

const Input = compose(
    handleTextInput,
    withNextInputAutoFocusInput
)(InputCustom);
const FormView = withNextInputAutoFocusForm(View);

const validationSchemes = Yup.object().shape({
    password: Yup.string('Только числа').required('Обязательно к заполнению').min(6, "Слишком короткий пароль"),
    confirmPassword: Yup.string().required('Только числа').typeError('Должна быть строка').oneOf([Yup.ref('password')], 'Пароли не совпадают').min(6, 'Пароль должен быть больше 6 символов'),
});

const FormChangePassword = (props) => {
    const { onChangePassword } = props;

    const [form, setForm] = useState({
        password: '',
        confirmPassword: '',
    });

    const refForm = useRef();

    const handleSubmit = (data, events) => {
        onChangePassword(data, events, handleClearForm);
    }

    const handleChangeForm = async (name, value) => {
        let newForm = {...form};

        newForm[name] = value;

        setForm(newForm);

        await refForm.current.setValues(newForm);
    }
    const handleClearForm = async () => {
        setForm({
            password: '',
            confirmPassword: ''
        })
        await refForm.current.setValues({
            password: '',
            confirmPassword: ''
        });
        await refForm.current.resetForm();
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
                        <FormView style={styles.form}>

                            <View style={styles.formElement}>

                                <Text style={styles.formElementTitle}>Пароль</Text>

                                <Input
                                    name="password"
                                    placeholder="*****"
                                    autoCapitalize="none"

                                    secureTextEntry={ true }
                                    value={values.password}

                                    onChangeText={(value) => handleChangeForm('password', value)}
                                />

                            </View>

                            <View style={styles.formElement}>

                                <Text style={styles.formElementTitle}>Повторите пароль</Text>

                                <Input
                                    name="confirmPassword"
                                    placeholder="*****"
                                    autoCapitalize="none"

                                    secureTextEntry={ true }
                                    value={values.confirmPassword}

                                    onChangeText={(value) => handleChangeForm('confirmPassword', value)}
                                />

                            </View>

                            <TouchableOpacity style={styles.buttonForm} onPress={props.handleSubmit}>
                                <Text style={styles.buttonFormText}>Изменить</Text>
                            </TouchableOpacity>

                        </FormView>
                    )

                }
            }

        </Formik>
    )
};

const styles = StyleSheet.create({
    form: {
        paddingHorizontal: 16,
    },

    formElement: {
        marginBottom: 24
    },
    formElementTitle: {
        marginBottom: 8,
        fontSize: 16,
        lineHeight: 18,
        opacity: 0.6,
        letterSpacing: 0.01
    },

    buttonForm: {
        paddingHorizontal: 24,
        paddingVertical: 12,

        backgroundColor: '#8152E4',

        borderRadius: 10
    },
    buttonFormText: {
        fontSize: 20,
        lineHeight: 22,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'AtypText_medium'
    },
});

export default FormChangePassword
