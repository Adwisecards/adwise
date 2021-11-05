import React, {useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions
} from "react-native";
import {
    Coupon,
    CouponLoading
} from "../../../../components";
import Carousel, {
    Pagination
} from "react-native-snap-carousel";
import localization from "../../../../localization/localization";
import allTranslations from "../../../../localization/allTranslations";

const {width} = Dimensions.get('window');

const PinnedCoupons = (props) => {
    const {items} = props;

    if (Boolean(!items || items.length <= 0)) {
        return null
    }

    const [activeIndexPagination, setActiveIndexPagination] = useState(0);

    const handleSnapToItem = (index) => {
        setActiveIndexPagination(index);
    }
    const _renderSliderItem = (item) => {
        return (
            <Coupon
                {...item.item}
                {...props.props}

                isHideSwipe
            />
        )
    };

    return (
        <View style={styles.root}>

            <View style={styles.header}>
                <Text style={styles.title}>{ allTranslations(localization.myCouponsSectionsFixedTitle) }</Text>
            </View>

            <View style={{marginHorizontal: -12}}>

                <Carousel
                    data={items}
                    itemWidth={width - 24}
                    sliderWidth={width}
                    renderItem={_renderSliderItem}

                    onSnapToItem={handleSnapToItem}
                />

            </View>

            <View>
                <Pagination
                    activeDotIndex={activeIndexPagination}
                    dotsLength={items.length}

                    dotColor="#8152E4"
                    inactiveDotColor="#C4C4C4"
                    inactiveDotOpacity={1}

                    containerStyle={styles.paginationContainerStyle}
                    dotContainerStyle={styles.paginationDotContainerStyle}
                    dotStyle={styles.paginationDotStyle}
                    inactiveDotStyle={styles.paginationDotStyle}
                />
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    root: {
        marginBottom: 32
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 12
    },
    title: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 25,
        color: '#000000'
    },

    paginationDotStyle: {
        width: 8,
        height: 8
    },
    paginationContainerStyle: {
        marginTop: 8,
        paddingVertical: 0
    },
    paginationDotContainerStyle: {
        marginHorizontal: 3
    },

    cardEmpty: {
        marginHorizontal: 12,
        padding: 16,
        borderRadius: 10,
        backgroundColor: 'white'
    },
    cardEmptyText: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 20,
        color: '#000000'
    },
});

export default PinnedCoupons
