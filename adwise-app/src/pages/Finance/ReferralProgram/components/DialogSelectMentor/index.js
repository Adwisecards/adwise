import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {
    DropDownHolder,
    ModalLoading
} from "../../../../../components";
import {Modalize} from "react-native-modalize";
import { Portal } from 'react-native-portalize';
import {TextInputMask} from "react-native-masked-text";
import axios from "../../../../../plugins/axios";
import urls from "../../../../../constants/urls";

const DialogSelectMentor = (props) => {
    const { innerRef, setupParent } = props;

    const [code, setCode] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [userContact, setUserContact] = useState({});

    const handleGetUserContact = async () => {
        const refCode = code.replace(/\D+/g,"");
        const isCodeValid = Boolean(refCode.length === 8);

        if (!isCodeValid) {
            DropDownHolder.alert(
                'error',
                'Системное уведомление',
                'Недействительный код',
                5000,
                true
            );

            return null
        }

        setLoading(true);

        const ref = await axios('get', `${urls["get-ref"]}${refCode}`).then((response) => {
            return response.data.data.ref
        }).catch(() => {
            return null
        });
        if (!ref || ref.mode !== 'contact') {
            setLoading(false);

            DropDownHolder.alert(
                'error',
                'Системное уведомление',
                'Недействительный код',
                5000,
                true
            );

            return null
        }

        const contact = await axios('get', `${urls["get-contact"]}${ref.ref}`).then((response) => {
            return response.data.data.contact
        }).catch(() => {
            return null
        })
        if (!contact) {
            setLoading(false);

            DropDownHolder.alert(
                'error',
                'Системное уведомление',
                'Недействительный код',
                5000,
                true
            );

            return null
        }

        const user = await axios('get', `${urls["get-user"]}${contact.ref}`).then((response) => {
            return response.data.data.user
        }).catch(() => {
            return null
        });
        if (!user) {
            setLoading(false);

            DropDownHolder.alert(
                'error',
                'Системное уведомление',
                'Недействительный код',
                5000,
                true
            );

            return null
        }

        setUserContact(user);

        setLoading(false);
    }
    const handleSetupParent = () => {
        setCode("");
        setLoading(false);
        setUserContact({});

        setupParent(userContact._id)
    }

    return (
        <Portal>
            <Modalize
                ref={innerRef}
                adjustToContentHeight={true}
                scrollViewProps={{
                    alwaysBounceHorizontal: false,
                    alwaysBounceVertical: false,
                    bounces: false
                }}
            >

                <View style={styles.root}>

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Наставник</Text>
                    </View>

                    <View style={styles.body}>

                        <Text style={styles.bodyMessage}>Введите код визитной карточки пользователя которого хотите назначить вашим наставником</Text>

                        <TextInputMask
                            value={code}
                            onChangeText={(text) => {setCode(text); setUserContact({})}}

                            style={styles.inputCode}

                            keyboardType={'phone-pad'}
                            placeholder={"123-45-678"}

                            type={'custom'}
                            options={{ mask: '999-99-999' }}
                        />

                        {
                            Boolean(Object.keys(userContact).length > 0) && (
                                <View style={styles.userSection}>
                                    <Text style={styles.userSectionTitle}>Предварительный куратор</Text>

                                    <View style={styles.userSectionBody}>
                                        {
                                            Boolean(userContact.picture) && (
                                                <View style={[styles.userSectionImage, {borderColor: userContact.contacts?.[0]?.['color']}]}>
                                                    <Image
                                                        source={{uri: userContact.picture}}
                                                        resizeMode="cover"
                                                        style={{flex: 1, borderRadius: 999}}
                                                    />
                                                </View>
                                            )
                                        }

                                        <View>
                                            <Text style={styles.userSectionMessage}>{userContact?.lastName}</Text>
                                            <Text style={styles.userSectionMessage}>{userContact?.firstName}</Text>
                                        </View>

                                    </View>
                                </View>
                            )
                        }

                        <TouchableOpacity style={styles.buttonSend} onPress={() => Boolean(Object.keys(userContact).length > 0) ? handleSetupParent() : handleGetUserContact()}>
                            <Text style={styles.buttonSendText}>Назначить</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </Modalize>


            <ModalLoading
                isOpen={isLoading}
            />

        </Portal>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: "white",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 24
    },

    header: {
        marginBottom: 12
    },
    headerTitle: {
        fontSize: 24,
        lineHeight: 32,
        fontFamily: 'AtypText_medium'
    },

    body: {},
    bodyMessage: {
        fontFamily: "AtypText_medium",
        fontSize: 14,
        lineHeight: 17,
        color: "#808080",
        marginBottom: 8
    },

    inputCode: {
        height: 50,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "rgba(0, 0, 0, 0.08)",
        borderRadius: 5,

        fontFamily: "AtypText_medium",
        fontSize: 24,
        color: "black",
        textAlign: "center",

        marginBottom: 12
    },

    userSection: {
        marginTop: 6,
        marginBottom: 8,
    },
    userSectionTitle: {
        fontFamily: "AtypText",
        fontSize: 10,
        lineHeight: 12,
        color: "#808080",
        marginBottom: 4
    },
    userSectionBody: {
        flexDirection: "row",
        alignItems: "center",
    },
    userSectionImage: {
        width: 40,
        height: 40,
        borderRadius: 999,
        overflow: 'hidden',
        marginRight: 8,
        padding: 1,
        borderWidth: 1,
        borderStyle: 'solid',
    },
    userSectionMessage: {
        fontFamily: "AtypText",
        fontSize: 16,
        lineHeight: 20,
        color: "black",
    },

    buttonSend: {
        height: 40,
        borderRadius: 6,
        backgroundColor: "#8152E4",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonSendText: {
        fontFamily: "AtypText_medium",
        fontSize: 18,
        color: "white"
    }
});

export default DialogSelectMentor
