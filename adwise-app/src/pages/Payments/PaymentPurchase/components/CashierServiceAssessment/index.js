import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet
} from "react-native";
import {
    PersonalSmallCard as PersonalSmallCardIcon,
    RatingStar as RatingStarIcon
} from "../../../../../icons";

const CashierServiceAssessment = (props) => {
    const { cashier, employee } = props;

    console.log('cashier: ', cashier);

    return (
        <View style={styles.root}>

            <Text style={styles.title}>Ваша оценка обслуживания</Text>

            <View style={styles.sectionCashier}>

                <View style={styles.cashierLogo}>
                    {
                        Boolean(cashier?.picture?.value) ? (
                            <Image
                                source={{uri: cashier?.picture?.value}}
                                style={{flex: 1}}
                            />
                        ) : (
                            <PersonalSmallCardIcon width="100%" height="100%" color="#808080"/>
                        )
                    }
                </View>

                <View>

                    <Text style={styles.cashierCaption}>Вас обслуживал</Text>

                    <Text style={styles.cashierName}>{`${cashier?.firstName?.value || ''} ${cashier?.lastName?.value || ''}`}</Text>

                </View>

            </View>

            <View style={styles.ratings}>
                {
                    [1, 2, 3, 4, 5].map((item) => (
                        <View style={styles.rating}>
                            <RatingStarIcon
                                color={Boolean(item <= employee.rating) ? '#8152E4' : '#E8E8E8'}
                            />
                        </View>
                    ))
                }
            </View>

            <Text style={styles.message}>{employee.comment}</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        marginTop: 12,
        paddingVertical: 20,
        paddingHorizontal: 12,

        backgroundColor: 'white',
        borderRadius: 10,
    },

    title: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: '#808080',
        textAlign: 'center',

        marginBottom: 20
    },

    // Секция кассира
    sectionCashier: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
    },
    cashierLogo: {
        width: 42,
        height: 42,
        borderRadius: 999,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#EBEBEB',
        backgroundColor: '#E8E8E8',
        overflow: 'hidden',
        marginRight: 12
    },
    cashierCaption: {
        fontFamily: 'AtypText',
        fontSize: 12,
        lineHeight: 13,
        color: '#808080',
        marginBottom: 2
    },
    cashierName: {
        fontFamily: 'AtypText_medium',
        fontSize: 15,
        lineHeight: 17,
        color: '#25233E'
    },
    // -------

    ratings: {
        flexDirection: 'row',
        marginLeft: -16,
        marginBottom: 16
    },
    rating: {
        width: 30,
        height: 30,
        marginLeft: 16
    },

    message: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 17,
        color: '#25233E'
    }
});

export default CashierServiceAssessment
