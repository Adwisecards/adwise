import React from "react";
import {
    View,
    Text,
    StyleSheet, FlatList, SafeAreaView
} from "react-native";
import commonStyles from "../../../../../theme/variables/commonStyles";
import CouponCard from "../CouponCard/CouponCard";

const Stage2 = (props) => {
    const {coupons, color} = props;

    const handleOnDelete = (id) => {
        const idx = coupons.findIndex((t) => t._id === id);
        let newCoupons = [...coupons];
        newCoupons.splice(idx, 1);

        props.onChangeCouponsBuy(newCoupons);
    }
    const handleChangeCount = (couponId, count) => {
        const idx = coupons.findIndex((t) => t._id === couponId);
        let newCouponsBuy = [...coupons];
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
                        onDelete={handleOnDelete}
                        isBuy={Boolean(coupons.find((t) => t._id === item._id))}
                        onChangeCount={handleChangeCount}
                    />
                )}
            />
        </SafeAreaView>
    )
};

export default Stage2
