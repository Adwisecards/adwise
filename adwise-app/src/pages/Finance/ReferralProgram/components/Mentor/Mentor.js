import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import {
    PartnerCompanyMentor
} from '../../../../../components'
import {Modalize} from "react-native-modalize";
import InsetShadow from 'react-native-inset-shadow'
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import Logo from "../../../../../../assets/graphics/logos/logo_mini.png";
import * as Linking from "expo-linking";
import variables from "../../../../../constants/variables";

const { width } = Dimensions.get('window');

const Mentor = (props) => {
    const { mentor, refDialogSelectMentor } = props;

    const refModalize = useRef();
    const isNotMentor = Boolean(!mentor);

    const handleRequestMentor = () => {}
    const handleChangeMentor = () => {}

    const openModalSelectMentor = () => {
        refDialogSelectMentor?.current.open();
    }

    const _sendMessageSupport = async () => {
        await Linking.openURL(`tg://resolve?domain=${variables["telegram-bot"]}&start=tgorg`);
    }

    return (
        <View style={styles.root}>
            <Text style={styles.typographyTitle}>{allTranslations(localization.financeMentor)}</Text>

            {
                Boolean(mentor) ? (
                    <PartnerCompanyMentor mentor={mentor} widthCard={width - 24}/>
                ) : (
                    <View style={styles.notMentor}>
                        <InsetShadow elevation={8} containerStyle={styles.notMentorContent}>
                            <Text style={styles.notMentorText}>{allTranslations(localization.financeNotMentor)}</Text>
                        </InsetShadow>
                    </View>
                )
            }

            <View style={styles.footer}>
                {
                    Boolean(!mentor) ? (
                        <TouchableOpacity
                            style={styles.buttonRequestMentor}
                            onPress={openModalSelectMentor}
                        >
                            <Text style={styles.buttonTextRequestMentor}>
                                {isNotMentor ? 'Запросить' : 'Изменить'}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View>

                            <TouchableOpacity
                                style={styles.buttonRequestMentor}
                                onPress={_sendMessageSupport}
                            >
                                <Text style={styles.buttonTextRequestMentor}>
                                    Запросить
                                </Text>
                            </TouchableOpacity>

                            <Text style={styles.messageRequestChangeMentor}>
                                Для изменения наставника мобильного приложения, пожалуйста, оставьте заявку в Support.
                            </Text>

                        </View>
                    )
                }
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        marginBottom: 42
    },
    footer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 4
    },

    notMentor: {
        height: 165,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 10,

        borderWidth: 2.5,
        borderStyle: 'solid',
        borderColor: 'white',

        overflow: 'hidden'
    },
    notMentorContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    notMentorText: {
        fontFamily: 'AtypText_medium',
        fontSize: 17,
        lineHeight: 19,
        color: '#ED8E00'
    },

    buttonRequestMentor: {},
    buttonTextRequestMentor: {
        fontFamily: 'AtypText_semibold',
        fontSize: 16,
        lineHeight: 23,
        color: '#8152E4'
    },

    typographyTitle: {
        marginBottom: 16,

        fontSize: 24,
        lineHeight: 26,
        fontFamily: 'AtypText_medium'
    },

    messageRequestChangeMentor: {
        marginTop: 2,
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 18,
        color: 'rgba(0, 0, 0, 0.4)',
    }
})

export default Mentor
