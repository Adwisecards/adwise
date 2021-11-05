import React from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView
} from "react-native";

import commonStyles from "../../../../../theme/variables/commonStyles";
import CouponCard from "../CouponCard/CouponCard";


const Stage1 = (props) => {
    const {coupons, couponsBuy, color} = props;


    const handleOnBuy = (coupon) => {
        let newCouponsBuy = [...couponsBuy, coupon];
        props.onChangeCouponsBuy(newCouponsBuy);
    }
    const handleOnDelete = (id) => {
        const idx = couponsBuy.findIndex((t) => t._id === id);
        let newCouponsBuy = [...couponsBuy];
        newCouponsBuy.splice(idx, 1);

        props.onChangeCouponsBuy(newCouponsBuy);
    }

    const handleChangeCount = (couponId, count) => {
        const idx = couponsBuy.findIndex((t) => t._id === couponId);
        let newCouponsBuy = [...couponsBuy];
        newCouponsBuy[idx]['count'] = count;

        props.onChangeCouponsBuy(newCouponsBuy);
    }

    return (
        <SafeAreaView
            style={[commonStyles.container, {flex: 1}]}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <FlatList
                data={coupons}

                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}

                renderItem={({item}) => (
                    <CouponCard
                        {...item}
                        color={color}
                        count={couponsBuy.find((t) => t._id === item._id)?.count || 0}
                        isBuy={Boolean(couponsBuy.find((t) => t._id === item._id))}
                        onAdd={handleOnBuy}
                        onDelete={handleOnDelete}
                        onChangeCount={handleChangeCount}
                    />
                )}
            />
        </SafeAreaView>
    )
};

export default Stage1
