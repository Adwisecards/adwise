import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from "react-native";
import Svg, {
    Rect,
    Path
} from 'react-native-svg';
import {
    Icon
} from "native-base";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const { width, height } = Dimensions.get('window');

const MyBankCards = (props) => {
    const { userCreditCard, isLoadingCreditCard, onAddUserCard, onDeleteUserCard } = props;

    const isEmptyCard = !userCreditCard;



    return (
        <View>

            <Text style={styles.title}>{allTranslations(localization.financeMyBankCards)}</Text>

            {
                isLoadingCreditCard && (
                    <View style={styles.container}>
                        <Text style={styles.cardTitle}>{allTranslations(localization.purchaseTextLoading)}</Text>
                    </View>
                )
            }

            {
                !isLoadingCreditCard && (
                    <View style={styles.container}>

                        {
                            isEmptyCard ? (
                                <TouchableOpacity style={styles.buttonAddCart} onPress={onAddUserCard}>

                                    <Svg width="38" height="25" viewBox="0 0 38 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Rect width="38" height="25" rx="3" fill="#F2F2F2"/>
                                        <Path d="M17.7781 12.92H12.6261V10.68H17.7781V5.496H20.1781V10.68H25.3621V12.92H20.1781V18.104H17.7781V12.92Z" fill="#ED8E00"/>
                                    </Svg>

                                    <Text style={styles.buttonAddCartText}>{allTranslations(localization.financeLinkCard)}</Text>

                                </TouchableOpacity>
                            ) : (
                                <View style={styles.card}>

                                    <Svg width="38" height="25" viewBox="0 0 38 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Rect width="38" height="25" rx="3" fill="#F2F2F2"/>
                                        <Path d="M22.6728 7.49414H15.9443V18.4836H22.6728V7.49414Z" fill="#FF5F00"/>
                                        <Path d="M16.6376 12.9905C16.6368 11.9323 16.8766 10.8878 17.3391 9.93601C17.8015 8.98422 18.4744 8.15008 19.3068 7.49674C18.2759 6.68649 17.0377 6.18265 15.7339 6.0428C14.4301 5.90294 13.1133 6.13271 11.9339 6.70585C10.7546 7.27899 9.76023 8.17237 9.06457 9.28389C8.36891 10.3954 8 11.6802 8 12.9915C8 14.3027 8.36891 15.5876 9.06457 16.6991C9.76023 17.8106 10.7546 18.704 11.9339 19.2771C13.1133 19.8503 14.4301 20.08 15.7339 19.9402C17.0377 19.8003 18.2759 19.2965 19.3068 18.4862C18.4742 17.8327 17.8011 16.9982 17.3387 16.0461C16.8762 15.0939 16.6365 14.049 16.6376 12.9905Z" fill="#EB001B"/>
                                        <Path d="M30.6147 12.9903C30.6146 14.3017 30.2456 15.5866 29.5498 16.6981C28.8541 17.8097 27.8596 18.7031 26.6801 19.2761C25.5005 19.8492 24.1836 20.0788 22.8797 19.9387C21.5758 19.7987 20.3377 19.2946 19.3068 18.4841C20.1389 17.8302 20.8116 16.9958 21.2741 16.044C21.7367 15.0921 21.9771 14.0477 21.9771 12.9894C21.9771 11.9311 21.7367 10.8866 21.2741 9.93475C20.8116 8.9829 20.1389 8.14854 19.3068 7.49461C20.3377 6.68412 21.5758 6.18003 22.8797 6.03998C24.1836 5.89992 25.5005 6.12954 26.6801 6.7026C27.8596 7.27566 28.8541 8.16902 29.5498 9.28058C30.2456 10.3921 30.6146 11.677 30.6147 12.9884V12.9903Z" fill="#F79E1B"/>
                                    </Svg>


                                    <View style={{ marginLeft: 12, flex: 1 }}>
                                        <Text style={styles.cardTitle}>•••• •••• •••• { userCreditCard.Pan.slice(-4) }</Text>
                                        <Text style={styles.cardDate}>{ userCreditCard.ExpDate.slice(0, 2) }/{ userCreditCard.ExpDate.slice(-2) }</Text>
                                    </View>

                                    <TouchableOpacity style={styles.buttonDeleteCard} onPress={onDeleteUserCard}>
                                        <Icon name="x" type="Feather" style={{ color: '#8152E4', fontSize: 20 }}/>
                                    </TouchableOpacity>

                                </View>
                            )
                        }

                    </View>
                )
            }

        </View>
    )
};

const styles = StyleSheet.create({
    root: {},

    title: {
        fontFamily: 'AtypText_medium',
        fontSize: 24,
        lineHeight: 26,

        marginBottom: 16
    },

    container: {
        backgroundColor: 'white',
        borderRadius: 10,

        paddingVertical: 12,
        paddingHorizontal: 12
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardTitle: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 18,

        marginBottom: 4
    },
    cardDate: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 18,
        opacity: 0.5
    },

    buttonAddCart: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonAddCartText: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 16,

        marginLeft: 12
    },

    buttonDeleteCard: {
        width: 40,
        height: 40,

        justifyContent: 'center',
        alignItems: 'center'
    },

    modal: {
        flex: 1,

        backgroundColor: 'white',
        paddingHorizontal: 24,
        paddingVertical: 18,
    },

    rootStyleModalize: {
        width: width,
        height: height,

        position: 'absolute',
        top: 0
    },

    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 999
    }
});

export default MyBankCards
