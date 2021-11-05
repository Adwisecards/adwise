import React from 'react';
import {
    View,
    StyleSheet, Text
} from 'react-native';
import {compose} from "recompose";
import {handleTextInput, withNextInputAutoFocusForm, withNextInputAutoFocusInput} from "react-native-formik";
import {
    DatePicker as DatePickerDefault,
    Input as InputCustom
} from "../../../../components";
import * as Yup from "yup";
import {Formik} from "formik";
import {Col, Grid} from "react-native-easy-grid";
import moment from "moment";


const DatePicker = compose(
    handleTextInput,
    withNextInputAutoFocusInput
)(DatePickerDefault);
const Input = compose(
    handleTextInput,
    withNextInputAutoFocusInput
)(InputCustom);
const FormView = withNextInputAutoFocusForm(View);

const validationSchemes = Yup.object().shape({
    name: Yup.string('Введена не строка').required('Обязательно к заполнению'),
    description: Yup.string('Введена не строка').required('Обязательно к заполнению')
});

const Form = (props) => {
    const {form, onSubmit, setRef, onChangeForm} = props;

    const handleSubmit = (form, { setErrors, resetForm }) => {
        onSubmit(form, { setErrors, resetForm })
    }

    const handleUpdateDate = (value) => {
        let newForm = {...form};

        newForm['date'] = moment(value).format('YYYY-MM-DD');

        onChangeForm(newForm)
    }
    const handleUpdateTime = (value) => {
        let newForm = {...form};

        newForm['time'] = moment(value);

        onChangeForm(newForm)
    }
    const handleChangeInput = (name, value) => {
        let newForm = {...form};

        newForm[name] = value;

        onChangeForm(newForm)
    }

    return (
        <Formik
            innerRef={setRef}
            onSubmit={handleSubmit}
            initialValues={form}
            validationSchema={validationSchemes}

            enableReinitialize
        >
            {
                props => {
                    const values = props.values;

                    return (
                        <FormView>
                            <View style={styles.form_Line}>
                                <Grid style={{ marginLeft: -12 }}>
                                    <Col size={2} style={{ marginLeft: 12 }}>
                                        <Text style={styles.formItem_Title}>Дата</Text>
                                        <DatePicker
                                            name={'date'}
                                            mode={'date'}
                                            value={values.date}
                                            styleButton={{ justifyContent: 'center' }}
                                            onChange={handleUpdateDate}
                                        />
                                    </Col>
                                    <Col size={1} style={{ marginLeft: 12 }}>
                                        <Text style={styles.formItem_Title}>Время</Text>
                                        <DatePicker
                                            mode={'time'}
                                            value={values.time}
                                            styleButton={{ justifyContent: 'center' }}
                                            onChange={handleUpdateTime}
                                        />
                                    </Col>
                                </Grid>
                            </View>

                            <View style={styles.form_Line}>
                                <Text style={styles.formItem_Title}>Задача</Text>
                                <Input
                                    name={'name'}
                                    placeholder={'Задача'}

                                    onChangeText={(value) => handleChangeInput('name', value)}
                                />
                            </View>

                            <View style={styles.form_Line}>
                                <Text style={styles.formItem_Title}>Описание</Text>
                                <Input
                                    name={'description'}
                                    placeholder={'Описание задачи'}
                                    multiline
                                    numberOfLines={1}
                                    styleInput={{ lineHeight: 25, alignItems: 'baseline' }}
                                    onChangeText={(value) => handleChangeInput('description', value)}
                                />
                            </View>
                        </FormView>
                    )
                }
            }
        </Formik>
    )
}

const styles = StyleSheet.create({
    form_Line: {
        marginBottom: 24
    },

    formItem_Title: {
        fontSize: 16,
        lineHeight: 18,
        opacity: 0.6,
        fontFamily: 'AtypText',
        marginBottom: 8
    }
});

export default Form