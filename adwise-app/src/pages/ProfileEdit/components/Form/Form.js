import React, { useEffect, createRef } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {compose} from "recompose";
import {handleTextInput, withNextInputAutoFocusForm, withNextInputAutoFocusInput} from "react-native-formik";
import {
    Input as InputCustom,
    DatePicker, Picker
} from "../../../../components";
import * as Yup from "yup";
import {Formik} from "formik";
import iconDatePicker from '../../../../../assets/graphics/account/account_date_picker.png';
import {
    Icon
} from 'native-base';
import {PersonalBusinessPage} from "../../../../icons";
import {useActionSheet} from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import {Camera} from "expo-camera";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const Input = compose(
    handleTextInput,
    withNextInputAutoFocusInput
)(InputCustom);
const FormView = withNextInputAutoFocusForm(View);

const validationSchemes = Yup.object().shape({
    firstName: Yup.string(allTranslations(localization.yupString)).required(allTranslations(localization.yupRequired))
});

const ButtonClear = (props) => {
    const { value, onPress } = props;

    if (!value){
        return null
    }

    return (
        <TouchableOpacity style={styles.buttonClear} onPress={onPress}>
            <Icon name={'clear'} type={'MaterialIcons'} style={{ fontSize: 20 }}/>
        </TouchableOpacity>
    )
}

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

const Form = (props) => {
    const {
        form, onChangeForm, onSubmitForm,
        imageLoadUser, onChangeImageUser
    } = props;
    const {showActionSheetWithOptions} = useActionSheet();
    const refForm = createRef();

    const handleSubmit = (form) => {
        onSubmitForm(form)
    }
    const handleClearItem = (name) => {
        handleChangeForm(name, '')
    }
    const handleChangeForm = (name, value) => {
        let newForm = {...refForm.current.values};

        newForm[name] = value;
        onChangeForm(newForm)
    }

    const handleOpenLoadImage = () => {
        const options = [
            allTranslations(localization.imagePickerChooseGallery),
            allTranslations(localization.imagePickerCamera),
            allTranslations(localization.imagePickerCancel)
        ];
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
            alert(allTranslations(localization.permissionsImagePickerNotGranted));

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

        let newInitialForm = {...refForm.current.values};
        newInitialForm['picture'] = result.uri;
        onChangeForm(newInitialForm)
        onChangeImageUser(result)
    }
    const handleSelectImageFromCamera = async () => {
        const {status} = await Camera.requestPermissionsAsync();

        if (status !== 'granted') {
            alert(allTranslations(localization.permissionsCameraNotGranted));

            return null
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: false,
            aspect: [4, 4],
            quality: 0.5
        })

        let newInitialForm = {...refForm.current.values};
        newInitialForm['picture'] = result.uri;
        onChangeForm(newInitialForm)
        onChangeImageUser(result)
    }

    const contact = props.account.contacts.find((t) => t.type === 'personal');
    const color = contact?.color || '#0f7bed';

    return (
        <Formik
            innerRef={refForm}

            onSubmit={handleSubmit}
            initialValues={ form }
            validationSchema={validationSchemes}

            enableReinitialize
        >
            {
                props => {
                    const values = props.values;

                    return (
                        <FormView style={{ flex: 1 }}>
                            <View style={styles.containerImageCard}>
                                {
                                    (form.picture) ? (
                                        <View style={[styles.imageCard, { backgroundColor: color }]}>
                                            <View style={{
                                                position: 'absolute',
                                                top: -20,
                                                right: 0,
                                                width: '50%',
                                                height: 240,
                                                zIndex: -1,
                                                overflow: 'hidden'
                                            }}>
                                                <PersonalBusinessPage color="rgba(0, 0, 0, 0)" hideAvatar style={{
                                                    position: 'absolute',
                                                    top: -20,
                                                    left: -200,
                                                    width: 600,
                                                    height: 260,
                                                    zIndex: -1
                                                }}/>
                                            </View>

                                            <Image
                                                style={styles.imageCardRound}
                                                source={{uri: form.picture}}
                                            />

                                            <View style={{
                                                position: 'absolute',
                                                top: -20,
                                                left: 0,
                                                width: '50%',
                                                height: 240,
                                                zIndex: -1,
                                                overflow: 'hidden'
                                            }}>
                                                <PersonalBusinessPage color="rgba(0, 0, 0, 0)" hideAvatar style={{
                                                    position: 'absolute',
                                                    top: -20,
                                                    right: -200,
                                                    width: 600,
                                                    height: 260,
                                                    zIndex: -1
                                                }}/>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={styles.imageCard}>
                                            <PersonalBusinessPage color={'#0f7bed'}/>
                                        </View>
                                    )
                                }

                                <TouchableOpacity
                                    style={styles.buttonOutline}
                                    onPress={handleOpenLoadImage}
                                >
                                    <Text style={styles.buttonOutlineText}>{allTranslations(localization.profileUploadImage)}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.formItem}>
                                <Text style={styles.formItemTitle}>{ allTranslations(localization.profileName) }</Text>
                                <Input
                                    name={'firstName'}
                                    value={values.firstName}
                                    styleInput={styles.formItemInput}
                                    styleContainer={styles.formItemContainer}
                                    rightChildren={<ButtonClear onPress={() => handleClearItem('firstName')} value={values.firstName}/>}
                                />
                            </View>
                            <View style={styles.formItem}>
                                <Text style={styles.formItemTitle}>{ allTranslations(localization.profileSurname) }</Text>
                                <Input
                                    name={'lastName'}
                                    value={values.lastName}
                                    styleInput={styles.formItemInput}
                                    styleContainer={styles.formItemContainer}

                                    rightChildren={<ButtonClear onPress={() => handleClearItem('lastName')} value={values.lastName}/>}
                                />
                            </View>
                            <View style={styles.formItem}>
                                <Text style={styles.formItemTitle}>{ allTranslations(localization.profileGender) }</Text>
                                <Picker
                                    name={'gender'}
                                    value={values.gender}
                                    textInputProps={{ paddingLeft: 30 }}
                                    style={{ paddingVertical: 14 }}
                                    styleRoot={{ height: 50 }}
                                    styleSelect={{lineHeight: 38}}
                                    items={genderList}
                                    onChange={(value) => handleChangeForm('gender', value)}
                                />
                            </View>
                            <View style={styles.formItem}>
                                <Text style={styles.formItemTitle}>{ allTranslations(localization.profileDateBirth) }</Text>
                                <DatePicker
                                    name={'dob'}
                                    mode={'date'}
                                    value={values.dob}

                                    onChange={(value) => handleChangeForm('dob', value)}

                                    styleButton={styles.datePicker}
                                    rightContent={<Image style={styles.datePickerIcon} source={iconDatePicker} resizeMode={'contain'}/>}
                                />
                            </View>

                            <View style={styles.formFooter}>
                                <Text style={styles.formFooterText}>{ allTranslations(localization.profileHelpEditMessage) }</Text>

                                <TouchableOpacity style={styles.formButton} onPress={props.handleSubmit}>
                                    <Text style={styles.formButtonText}>{ allTranslations(localization.profileSendEdit) }</Text>
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

    formItem: {
        marginBottom: 24,
    },
    formItemTitle: {
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: 0.01,
        opacity: 0.6,

        marginBottom: 8
    },
    formItemContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        paddingRight: 16,
        borderRadius: 10,
    },
    formItemInput: {
        fontSize: 20,
        lineHeight: 20,
        borderWidth: 0
    },

    buttonClear: {
        opacity: 0.13,
        height: 50,
        width: 50,
        marginRight: -16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    datePickerIcon: {
        width: 24,
        height: 24
    },

    formFooter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    formFooterText: {
        textAlign: 'center',
        marginBottom: 22,
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 14,
        opacity: 0.4
    },

    formButton: {
        minWidth: 175,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#8152E4',
        borderRadius: 10
    },
    formButtonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        lineHeight: 20
    },

    containerImageCard: {
        width: '100%',

        marginBottom: 24
    },
    imageCard: {
        justifyContent: 'center',
        alignItems: 'center',


        flex: 1,
        height: 220,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 12
    },
    imageCardRound: {
        width: 137,
        height: 137,
        borderRadius: 999
    },

    buttonOutline: {
        width: '100%',
        height: 33,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#9671e6',
        borderRadius: 8
    },
    buttonOutlineText: {
        color: '#8152E4',
        fontFamily: 'AtypText_semibold',
        fontSize: 14,
        lineHeight: 30,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
});

export default Form
