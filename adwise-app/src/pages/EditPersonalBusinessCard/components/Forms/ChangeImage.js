import React, {useState, useRef} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {} from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import {Camera} from 'expo-camera';
import {useActionSheet} from '@expo/react-native-action-sheet'
import {PersonalBusinessPage} from "../../../../icons";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const ChangeImage = (props) => {
    const { initialForm, onChangeInitialForm, onChangeFile } = props;
    const {showActionSheetWithOptions} = useActionSheet();

    const handleMenuItemSelection = async (index) => {
        if (index === 0) {
            handleSelectImageFromGallery()
        }
        if (index === 1) {
            await handleSelectImageFromCamera()
        }
    }

    const handleOpenActionSheet = () => {
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
                handleMenuItemSelection(buttonIndex)
            },
        );
    };

    const handleSelectImageFromGallery = async () => {
        const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
            alert(allTranslations(localization.permissionsCameraNotGranted));

            return null
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: false,
            aspect: [4, 3],
            quality: 0.6,
        });

        if (result.cancelled) {
            return null
        }

        let newInitialForm = {...initialForm};
        newInitialForm['picture'] = result.uri;
        onChangeInitialForm(newInitialForm)
        onChangeFile(result)
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
            aspect: [4, 3],
            quality: 0.6,
        })

        let newInitialForm = {...initialForm};
        newInitialForm['picture'] = result.uri;
        onChangeInitialForm(newInitialForm)
        onChangeFile(result)
    }

    return (
        <View style={styles.containerImageCard}>
            {
                (initialForm.picture) ? (
                    <Image
                        style={styles.imageCard}
                        source={{uri: initialForm.picture}}
                    />
                ) : (
                    <View style={styles.imageCard}>
                        <PersonalBusinessPage color={'#ED8E00'}/>
                    </View>
                )
            }

            <TouchableOpacity
                style={styles.buttonOutline}
                onPress={handleOpenActionSheet}
            >
                <Text style={styles.buttonOutlineText}>{allTranslations(localization.editPersonalBusinessCardButtonUploadImage)}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    containerImageCard: {
        width: '100%'
    },
    imageCard: {
        flex: 1,
        height: 220,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 12
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
})

export default ChangeImage
