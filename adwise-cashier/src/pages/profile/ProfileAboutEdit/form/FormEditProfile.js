import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity, Image
} from "react-native";
import * as Yup from "yup";
import {Formik} from "formik";
import {Camera} from "expo-camera";
import {PersonalBusinessPage} from "../../../../icons";
import {useActionSheet} from "@expo/react-native-action-sheet";

import * as ImagePicker from "expo-image-picker";

const validationSchemes = Yup.object().shape({
    // firstName: Yup.string('Введена не строка').required('Обязательно к заполнению'),
    // lastName: Yup.string('Введена не строка').required('Обязательно к заполнению'),
});

const FormEditProfile = (props) => {
    const { app, setRef, form, contactWork, onChangeForm, onSubmit } = props;

    const {showActionSheetWithOptions} = useActionSheet();

    const handleSubmit = (form) => {
        onSubmit(form);
    }

    const handleOnChangeForm = (name, value) => {
        let newForm = {...form};

        newForm[name] = value;

        onChangeForm(newForm);
    }

    const handleOpenLoadImage = () => {
        const options = ['Выбрать из галереи', 'Камера', 'Отмена'];
        const destructiveButtonIndex = 2;
        const cancelButtonIndex = 2;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveButtonIndex,
            },
            buttonIndex => {
                (async () => {
                    await handleMenuItemSelection(buttonIndex)
                })()
            },
        );
    }
    const handleMenuItemSelection = async (index) => {
        if (index === 0) {
            await handleSelectImageFromGallery()
        }
        if (index === 1) {
            await handleSelectImageFromCamera()
        }
    }
    const handleSelectImageFromGallery = async () => {
        const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
            alert('Извините, нам нужны разрешения камеры, чтобы это работало!');

            return null
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: false,
            aspect: [4, 4],
            quality: 0.5,
            maxFileSize: 2
        });

        if (result.cancelled) {
            return null
        }

        let newForm = {...form};

        newForm.picture = result;

        onChangeForm(newForm);
    }
    const handleSelectImageFromCamera = async () => {
        const {status} = await Camera.requestPermissionsAsync();

        if (status !== 'granted') {
            alert('Извините, нам нужны разрешения камеры, чтобы это работало!');

            return null
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: false,
            aspect: [4, 4],
            quality: 0.5
        })

        let newForm = {...form};

        newForm.picture = result;

        onChangeForm(newForm);
    }

    const isImageCard = Boolean(contactWork.picture.value || form?.picture);

    const emailUser = app?.account?.email;
    const emailCashier = contactWork.email?.value;

    return (
        <Formik
            innerRef={setRef}

            onSubmit={handleSubmit}
            initialValues={ form }
            validationSchema={validationSchemes}
        >{(props) => {
            const { values, errors, touched, handleSubmit } = props;

            return (
                <View>

                    <View style={styles.item}>
                        <Text style={styles.itemTitle}>Изображение</Text>

                        <View style={styles.imageContainer}>
                            {
                                isImageCard ? (
                                    <Image
                                        source={{ uri: (form?.picture) ? form?.picture?.uri : contactWork.picture.value || form?.picture?.uri }}
                                        style={{ flex: 1 }}
                                    />
                                ) : (
                                    <PersonalBusinessPage style={{ marginTop: -50 }} color="#966EEA"/>
                                )
                            }
                        </View>

                        <TouchableOpacity style={[styles.button, { marginTop: 16, backgroundColor: '#ED8E00' }]} onPress={handleOpenLoadImage}>
                            <Text style={styles.buttonText}>Загрузить</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.item}>
                        <Text style={styles.itemTitle}>Компания</Text>

                        <TextInput
                            value={contactWork.organization?.name}
                            style={[styles.input, styles.inputDisabled]}
                            editable={false}
                        />

                    </View>

                    <View style={styles.item}>
                        <Text style={styles.itemTitle}>E-mail</Text>

                        <TextInput
                            value={emailCashier || emailUser}
                            style={[styles.input, styles.inputDisabled]}
                            editable={false}
                        />
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.itemTitle}>Комментарий для чаевых</Text>

                        <TextInput
                            value={values.tipsMessage}
                            style={[styles.input]}
                            onChangeText={(value) => handleOnChangeForm('tipsMessage', value)}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Сохранить</Text>
                    </TouchableOpacity>

                </View>
            )
        }}</Formik>
    )
};

const styles = StyleSheet.create({
    item: {
        marginBottom: 24
    },
    itemTitle: {
        fontFamily: 'AtypDisplay',
        fontSize: 14,
        lineHeight: 17,
        color: '#808080',

        marginBottom: 8
    },

    input: {
        padding: 12,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',

        borderRadius: 5,

        fontFamily: 'AtypDisplay_medium',
        fontSize: 18,
        lineHeight: 22,
        color: 'black'
    },
    inputDisabled: {
        backgroundColor: '#f6f6f6',
        borderColor: '#f6f6f6',
        color: '#808080'
    },

    separate: {
        width: '100%',
        height: 1,
        backgroundColor: '#E8E8E8',
        marginVertical: 12
    },

    button: {
        height: 45,
        width: '100%',
        borderRadius: 6,
        backgroundColor: '#8152E4',

        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 18,
        color: 'white'
    },

    imageContainer: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        overflow: 'hidden',

        backgroundColor: '#966EEA'
    },
});

export default FormEditProfile
