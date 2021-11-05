import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    Icon
} from "native-base";
import {
    DropDownHolder,
    ModalLoading
} from "../../../../../components";
import {Portal} from 'react-native-portalize';
import {Modalize} from "react-native-modalize";
import {getMediaUrl} from "../../../../../common/media";
import {formatMoney} from "../../../../../helper/format";
import {compose} from "recompose";
import {connect} from "react-redux";
import {updateFavorites} from "../../../../../AppState";
import currency from "../../../../../constants/currency";
import axios from "../../../../../plugins/axios";
import urls from "../../../../../constants/urls";
import imageCouponBigPlug from "../../../../../../assets/graphics/plugs/coupon_popup_big_plug.png";

const ModalCoupon = (props) => {
    const {coupon, innerRef, onClose, global} = props;
    const imageUrl = Boolean(coupon?.pictureMedia) ? getMediaUrl(coupon?.pictureMedia) : "";

    const [tables, setTabled] = useState([]);
    const [isFavorite, setFavorite] = useState(false);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {

        // Сборка таблицы купона
        let data = [
            {
                name: "Стоимость",
                value: `${formatMoney(coupon?.price)} ${currency.rub}`,
                color: ""
            },
            {
                name: "Кэшбэк",
                value: `${ coupon?.offerPercent || 0 } %`,
                color: "#61AE2C"
            },
            {
                name: "1 уровень реф. сети",
                value: `${coupon?.distributionSchema?.first} %`,
                color: ""
            },
            {
                name: "2 - 21 уровень реф. сети",
                value: `${coupon?.distributionSchema?.other} %`,
                color: ""
            },
            {
                name: "Номер акции",
                value: coupon?.ref?.code,
                color: ""
            },
            {
                name: "Продавец",
                value: coupon?.organizationName,
                color: ""
            },
        ];
        setTabled(data);

        // Находит ли купон в избранном
        const couponsFavorites = global?.couponsFavorites || [];
        let favorite = Boolean(couponsFavorites.find((t) => t._id === coupon._id));
        setFavorite(favorite);
    }, [coupon]);

    const handleChangeFavorites = async () => {
        await setLoading(true);

        const urlKey = Boolean(isFavorite) ? 'coupons-remove-coupon-from-user-favorite-list' : 'coupons-add-coupon-to-user-favorite-list';
        const response = await axios('put', urls[urlKey], {
            couponId: coupon?._id
        }).then((response) => {
            return response.data.data
        }).catch((error) => {
            return {
                error: error.response
            }
        });
        const favorites = await axios('get', urls["coupons-get-user-favorite-coupons"]).then((res) => {
            return res.data.data.coupons
        }).catch(() => {
            return []
        });

        props.updateFavorites(favorites);

        DropDownHolder.alert(
            "success",
            "Системное уведомление",
            Boolean(isFavorite) ? "Купон успешно удален из избранного" : "Купон успешно добавлен из избранного",
            5000,
            true
        )

        await setLoading(false);
        await setFavorite(Boolean(favorites.find((t) => t._id === coupon._id)));
    }

    return (
        <Portal>
            <Modalize
                ref={innerRef}
                adjustToContentHeight={true}
                onClose={onClose}
                rootStyle={styles.backdrop}
                childrenStyle={styles.childrenStyle}
                snapPoint={100}
            >

                <View style={styles.root}>

                    <View style={styles.imageContainer}>
                        <Image
                            style={{width: '100%', height: '100%'}}
                            resizeMode="cover"
                            source={imageUrl ? {uri: imageUrl} : imageCouponBigPlug}
                        />

                        <TouchableOpacity style={styles.buttonFavorite} onPress={handleChangeFavorites}>
                            <Icon style={styles.buttonFavoriteIcon} type="AntDesign"
                                  name={isFavorite ? 'heart' : 'hearto'}/>
                        </TouchableOpacity>

                    </View>

                    <Text style={styles.couponName}>{coupon.name}</Text>

                    <Text style={styles.couponDescription}>{coupon.description}</Text>

                    <View>
                        {
                            tables.map((row, idx) => (
                                <View key={`coupon-table-row-${idx}`}>

                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableName, Boolean(row.color) && {color: row.color}]}>{row.name}</Text>
                                        <Text style={[styles.tableValue, Boolean(row.color) && {color: row.color}]}>{row.value}</Text>
                                    </View>

                                    {
                                        Boolean(tables.length - 1 > idx) && (
                                            <View style={styles.tableLine}/>
                                        )
                                    }

                                </View>
                            ))
                        }
                    </View>

                </View>

                <ModalLoading
                    isOpen={isLoading}
                />

            </Modalize>
        </Portal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(80, 52, 140, 0.8)'
    },
    childrenStyle: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        overflow: 'hidden'
    },

    root: {
        backgroundColor: 'white',
        padding: 24
    },

    imageContainer: {
        width: '100%',
        height: 160,
        overflow: "hidden",
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E9E9E9',

        marginBottom: 24
    },

    couponName: {
        fontFamily: "AtypText_medium",
        fontSize: 18,
        lineHeight: 23,
        color: 'black',
        marginBottom: 16
    },
    couponDescription: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 18,
        color: '#808080',
        marginBottom: 30
    },

    table: {},
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    tableName: {
        fontFamily: "AtypText_medium",
        fontSize: 12,
        lineHeight: 17,
        color: '#808080'
    },
    tableValue: {
        fontFamily: "AtypText",
        fontSize: 12,
        lineHeight: 17,
        color: '#25233E'
    },
    tableLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#EAEBF0',
        marginVertical: 4
    },

    buttonFavorite: {
        width: 30,
        height: 30,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EADEFE',

        position: 'absolute',
        right: 10,
        top: 10
    },
    buttonFavoriteIcon: {
        fontSize: 15,
        color: '#8152E4'
    }
});

export default compose(
    connect(
        state => ({
            global: state.app
        }),
        dispatch => ({
            updateFavorites: (favorites) => dispatch(updateFavorites(favorites)),
        }),
    ),
)(ModalCoupon)
