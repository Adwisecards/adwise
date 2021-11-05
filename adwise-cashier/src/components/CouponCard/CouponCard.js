import React from "react";
import {
    View,

    Text,

    Image,

    StyleSheet,

    TouchableOpacity
} from 'react-native';
import {
    Icon
} from 'native-base';
import Dash from "react-native-dash";
import {formatMoney} from "../../helper/format";


const CouponCard = (props) => {
    const {item, buyItems, onChangeBuyItems} = props;

    if (item.quantity <= 0) {
        return null
    }

    const buyItem = buyItems.find((itemList) => itemList._id === item._id);

    const handleBuyCoupon = () => {
        if (buyItem){
            return null
        }

        let newBuyItems = [...buyItems];

        newBuyItems.push({
            _id: item._id,
            count: 1
        });

        onChangeBuyItems(newBuyItems)
    }

    const handleMinusCount = () => {
        if (buyItem.count <= 1){
            let newBuyItems = [...buyItems];
            const index = newBuyItems.findIndex((itemList) => itemList._id === item._id);

            newBuyItems.splice(index, 1);

            onChangeBuyItems(newBuyItems)

            return null
        }

        buyItem.count--;
        onChangeBuyItems(buyItems)
    }
    const handlePlusCount = () => {
        const stock = item.quantity;

        buyItem.count++

        if (buyItem.count >= stock){
            buyItem.count = stock;
        }

        onChangeBuyItems(buyItems)
    }

    return (
        <TouchableOpacity
            style={[
                styles.card,

                (buyItem) && styles.cardActive
            ]}

            activeOpacity={buyItem ? 1 : 0.2}

            onPress={handleBuyCoupon}
        >
            <View style={styles.container}>

                <View style={styles.cardLogoContainer}>
                    <View style={styles.cardLogo}>
                        <Image style={{flex: 1, borderRadius: 999}} source={{uri: item.organizationPicture}}
                               resizeMode="cover"/>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <Text style={styles.couponName}>{item.name}</Text>

                    <Text style={styles.couponPrice}>{formatMoney(item.price)} ₽</Text>
                </View>

                <View style={styles.cardDash}>
                    <Dash
                        dashGap={3}
                        dashLength={3}
                        dashThickness={3}
                        style={{
                            width: 1,
                            flex: 1,
                            flexDirection: 'column',
                            borderRadius: 100,
                            marginTop: -8,
                            marginBottom: -8
                        }}
                        dashStyle={{borderRadius: 100}}
                        dashColor={'#c0c0c0'}
                    />
                </View>

                <View style={styles.cardRight}>
                    <Text style={styles.couponCashback}>{item.offer.percent}%</Text>
                    <Text style={styles.couponCashbackText}>Кэшбэк</Text>
                </View>
            </View>
            {
                (buyItem) && (
                    <View style={styles.controls}>

                        <Text style={styles.controlsTitle}>Количество</Text>

                        <View style={styles.controlsRight}>
                            <TouchableOpacity style={styles.controlButton} onPress={handleMinusCount}>
                                <Icon name="minus" type="Feather" style={styles.controlButtonIcon}/>
                            </TouchableOpacity>

                            <Text style={styles.controlCount}>{ buyItem.count }</Text>

                            <View style={{opacity: (buyItem.count >= item.quantity) ? 0.4 : 1}}>
                                <TouchableOpacity style={[styles.controlButton]} onPress={handlePlusCount}>
                                    <Icon name="plus" type="Feather" style={styles.controlButtonIcon}/>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                )
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 8,

        borderWidth: 2,
        borderRadius: 5,
        borderStyle: 'solid',
        borderColor: 'white',

        backgroundColor: 'white'
    },
    cardActive: {
        backgroundColor: '#ED8E00',
        borderColor: '#ED8E00'
    },

    container: {
        overflow: 'hidden',

        flexDirection: 'row',

        backgroundColor: 'white',

        borderRadius: 5,

        padding: 4,

        minHeight: 90
    },

    cardLogoContainer: {
        backgroundColor: '#7fc2ff',
        width: 70,
        borderRadius: 3,

        justifyContent: 'center',
        alignItems: 'center'
    },
    cardLogo: {
        width: 50,
        height: 50,
        borderRadius: 999,
        backgroundColor: 'white',

        padding: 2,

        elevation: 2
    },

    cardBody: {
        flex: 1,

        paddingVertical: 8,
        paddingHorizontal: 14
    },

    cardDash: {
        width: 4,

    },

    cardRight: {
        paddingVertical: 12,
        paddingHorizontal: 16
    },

    couponName: {
        fontSize: 15,
        lineHeight: 18,
        fontFamily: 'AtypDisplay_medium',

        marginBottom: 24
    },
    couponPrice: {
        fontSize: 15,
        lineHeight: 18,
        fontFamily: 'AtypDisplay_medium',

        color: '#8152E4'
    },

    couponCashback: {
        fontFamily: 'AtypDisplay_medium',
        fontSize: 26,
        lineHeight: 31,
        color: '#8152E4',
        letterSpacing: 1
    },
    couponCashbackText: {
        fontFamily: 'AtypDisplay_medium',
        fontSize: 14,
        lineHeight: 17,
        color: '#8152E4',

        marginBottom: 10
    },

    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        padding: 8,

        backgroundColor: '#ED8E00'
    },
    controlsTitle: {
        fontFamily: 'AtypDisplay_medium',
        fontSize: 15,
        lineHeight: 18,
        color: 'white'
    },

    controlsRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    controlCount: {
        width: 50,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 19,
        color: 'white',
        fontFamily: 'AtypDisplay_medium'
    },

    controlButton: {
        width: 35,
        height: 25,

        justifyContent: 'center',
        alignItems: 'center',

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 6
    },
    controlButtonIcon: {
        fontSize: 20,
        color: 'white'
    },
});

export default CouponCard
