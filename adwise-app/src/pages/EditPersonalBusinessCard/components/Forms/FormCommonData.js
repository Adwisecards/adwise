import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
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
import {Icon} from "native-base";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const Input = compose(
    handleTextInput,
    withNextInputAutoFocusInput
)(InputCustom);
const FormView = withNextInputAutoFocusForm(View);

const validationSchemes = Yup.object().shape({});

const ButtonClear = (props) => {
    const { value } = props;

    if (!value){
        return null
    }

    return (
        <TouchableOpacity style={styles.buttonClear} onPress={props.onPress}>
            <Icon name={'clear'} style={styles.buttonClearIcon} type={'MaterialIcons'}/>
        </TouchableOpacity>
    )
}

const FormCommonData = (props) => {
    const { setRef, handleSubmit, initialForm, onChangeInitialForm } = props;

    const handleChangeForm = (name, value) => {
        let newInitialForm = {...initialForm};

        newInitialForm[name] = value;

        onChangeInitialForm(newInitialForm)
    }

    return (
        <Formik
            innerRef={setRef}
            onSubmit={handleSubmit}
            initialValues={initialForm}
            validationSchema={validationSchemes}
        >
            {
                props => {
                    const values = props.values;

                    return (
                        <FormView>
                            <View style={styles.root}>

                                <Text style={[styles.formItemTitle, { marginBottom: 24 }]}>{allTranslations(localization.editPersonalBusinessCardCommonDataMessage)}</Text>
                                <View style={[styles.formItem, { marginBottom: 0 }]}>
                                    <Text style={styles.formItemTitle}>{allTranslations(localization.editPersonalBusinessCardFormsActivityTitle)}</Text>

                                    <Input
                                        name={'activity'}
                                        placeholder={allTranslations(localization.editPersonalBusinessCardFormsActivityPlaceholder)}

                                        value={values.activity}

                                        onChangeText={(value) => handleChangeForm('activity', value)}

                                        styleContainer={styles.styleContainer}
                                        styleInput={styles.styleInput}
                                        rightChildren={(<ButtonClear value={values.activity} onPress={() => handleChangeForm('activity', '')}/>)}
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

export default FormCommonData
