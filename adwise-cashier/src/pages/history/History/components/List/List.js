import React from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    SectionList,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import {
    RefreshControl
} from '../../../../../components';
import moment from "moment";
import Dash from "react-native-dash";
import commonStyles from "../../../../../theme/variables/commonStyles";
import {formatCode, formatMoney} from "../../../../../helper/format";
import PurchaseLoading from "../PurchaseLoading";
import {hexToRGBA} from "../../../../../helper/converting";

const Item = (props) => {
    const {item} = props;

    const _getStatusColor = () => {
        if (!item.canceled && item.confirmed && !item.complete) {
            return "#61AE2C"
        }
        if (!item.canceled && !item.confirmed && !item.processing) {
            return "#D8004E"
        }
        if (!item.canceled && item.processing && !item.confirmed) {
            return "#ED8E00"
        }
        if (!item.canceled && item.confirmed && item.complete) {
            return "#8152E4"
        }
    }
    const _getStatusTitle = () => {
        if (!item.canceled && item.confirmed && !item.complete) {
            return "Оплачен"
        }
        if (!item.canceled && !item.confirmed && !item.processing) {
            return "Неоплачен"
        }
        if (!item.canceled && item.processing && !item.confirmed) {
            return "Ожидание оплаты"
        }
        if (!item.canceled && item.confirmed && item.complete) {
            return "Завершен"
        }
    }
    const _getStatusTitleSecondary = () => {
        if (!item.canceled && item.confirmed && !item.complete) {
            return "Выдать заказ"
        }
        if (!item.canceled && item.processing && !item.confirmed) {
            return Boolean(item.type === 'cashless') ? "Онлайн" : "Наличные"
        }
    }
    const handleOpenHistoryPurchase = () => {
        props.navigation.navigate('HistoryPurchase', {
            purchaseId: item._id
        })
    }

    const isCoupons = Boolean(item?.coupons && item.coupons.length > 1);

    return (
        <TouchableOpacity style={stylesCard.card} onPress={handleOpenHistoryPurchase}>
            <View style={stylesCard.cardLeft}>
                <View style={{flex: 1}}>
                    <Text style={stylesCard.cardPurchaseCode}>Заказ {formatCode(item?.ref?.code)}</Text>
                    {
                        isCoupons ? (
                            <>
                                <Text style={stylesCard.cardPurchaseName}>Товаров и
                                    услуг {item.coupons.length} шт</Text>
                            </>
                        ) : (
                            <>
                                <Text style={stylesCard.cardPurchaseName}>{item.coupon.name}, 1
                                    шт</Text>
                            </>
                        )
                    }
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                    <View
                        style={[stylesCard.purchaseStatus]}
                    >
                        <View style={{backgroundColor: _getStatusColor()}}>
                            <Text style={[stylesCard.purchaseStatusText]}>{_getStatusTitle()}</Text>
                        </View>
                        {
                            Boolean(_getStatusTitleSecondary()) && (
                                <View style={{backgroundColor: hexToRGBA(_getStatusColor(), 0.55)}}>
                                    <Text style={[stylesCard.purchaseStatusText]}>{_getStatusTitleSecondary()}</Text>
                                </View>
                            )
                        }
                    </View>
                </View>
            </View>
            <View style={stylesCard.cardSeparate}>
                <Dash
                    dashGap={2}
                    dashLength={4}
                    dashThickness={4}
                    style={stylesCard.cardSeparateDash}
                    dashStyle={{borderRadius: 100}}
                    dashColor={'white'}
                />
            </View>
            <View style={stylesCard.cardRight}>
                <View style={{flex: 1}}>
                    <Text style={stylesCard.cardOrganizationName}>{item.coupon.organizationName}</Text>
                    <Text style={stylesCard.cardDateCreate}>{moment(item.timestamp).format('DD.MM.YYYY / HH:mm')}</Text>
                </View>

                <Text style={stylesCard.cardPrice}>{formatMoney(item.sumInPoints)} ₽</Text>
            </View>
        </TouchableOpacity>
    )
}

const List = (props) => {
    const {
        purchases,
        view,
        filter,
        pagination,
        isLoading,
        onRefresh,
        isResetFilter,
        isRefreshing,
        onChangeFilter,
        sectionLoadStage,
        isFilter
    } = props;

    const handleChangeFilter = () => {
        let newFilter = {...filter};
        newFilter.page++;

        if (isFilter && newFilter.page > pagination.pages) {
            return null
        }
        if (!isFilter && sectionLoadStage > 2) {
            return null
        }

        onChangeFilter(newFilter, true);
    }

    const _renderItem = (element) => {
        return (
            <Item view={view} {...element} {...props}/>
        )
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <SectionList
                style={{flex: 1}}
                contentContainerStyle={commonStyles.container}

                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                stickySectionHeadersEnabled={false}

                sections={purchases}
                extraData={purchases}
                keyExtractor={(item, idx) => `purchases-${item._id}-${idx}`}

                renderItem={_renderItem}
                onEndReached={handleChangeFilter}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }

                renderSectionHeader={(data) => {
                    const {section} = data;

                    return (
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>{section.title}</Text>
                        </View>
                    )
                }}
                ListHeaderComponent={() => {
                    if (!isResetFilter) {
                        return null
                    }

                    return (
                        <View style={{marginBottom: 24}}>
                            <ActivityIndicator color="#8152E4" size="large"/>
                        </View>
                    )
                }}
                ListFooterComponent={() => {

                    if (isFilter) {

                        if ( isLoading || pagination.pages > filter.page ) {

                            return  (

                                <>
                                    <PurchaseLoading/>
                                    <PurchaseLoading/>

                                    <Text style={styles.paginationCurrentPage}>Страница: {filter.page}</Text>
                                </>

                            )

                        }

                    }

                    if (!isFilter) {

                        if ( isLoading || sectionLoadStage <= 2 ) {

                            return  (
                                <>
                                    <PurchaseLoading/>
                                    <PurchaseLoading/>

                                    <Text style={styles.paginationCurrentPage}>Страница: {filter.page}</Text>
                                </>
                            )

                        }

                    }

                    return null

                }}
            />

        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    flatList: {},

    header: {
        marginBottom: 12
    },
    headerTitle: {
        fontFamily: "AtypText_medium",
        fontSize: 18,
        lineHeight: 26,
        color: '#25233E'
    },

    item: {
        padding: 20,

        backgroundColor: 'white',

        borderRadius: 10,

        marginBottom: 16
    },
    itemTitle: {
        fontFamily: 'AtypText',
        fontSize: 20,
        lineHeight: 22,

        marginBottom: 8
    },
    itemPrice: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 20,

        marginBottom: 16
    },
    itemFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemDate: {
        fontFamily: 'AtypText',
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: 0.2,
        color: '#9FA3B7'
    },
    itemStatus: {
        fontFamily: 'AtypText_medium',
        fontSize: 11,
        lineHeight: 13,
        letterSpacing: 0.1
    },
    itemStatusSuccess: {
        color: '#94D36C'
    },
    itemStatusError: {
        color: '#FF9494'
    },

    billStatus: {
        fontFamily: 'AtypText_medium',
        fontSize: 11,
        lineHeight: 13,
        letterSpacing: 0.1
    },
    billStatusConfirmed: {
        color: '#94D36C'
    },
    billStatusNotConfirmed: {
        color: '#FF9494'
    },
    billStatusProcessing: {
        color: '#ED8E00'
    },

    buttonLoadMore: {
        width: '100%',
        height: 50,
        backgroundColor: '#8152E4',
        borderRadius: 6,

        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonLoadMoreText: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 18,
        color: 'white'
    },

    paginationCurrentPage: {
        marginVertical: 12,

        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 14,
        color: '#808080',
        textAlign: 'right'
    },
});
const stylesCard = StyleSheet.create({
    card: {
        borderRadius: 10,

        flexDirection: 'row',

        overflow: 'hidden',

        backgroundColor: 'white',

        marginBottom: 12,

        elevation: 2
    },

    cardLeft: {
        width: '60%',

        paddingHorizontal: 16,
        paddingVertical: 14
    },
    cardRight: {
        padding: 12,

        width: '40%',
        backgroundColor: '#F7F7F7'
    },
    cardSeparate: {
        width: 5,
        height: '100%',
        zIndex: 999,
        marginRight: -3.5
    },
    cardSeparateDash: {
        flexDirection: 'column',
        position: 'absolute',
        top: -16,
        bottom: -16
    },

    cardOrganizationName: {
        marginBottom: 6,

        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 13,
        color: 'black',
        opacity: 0.4
    },
    cardDateCreate: {
        marginBottom: 24,

        fontFamily: 'AtypText',
        fontSize: 11,
        lineHeight: 13,
        color: 'black',
        opacity: 0.4
    },
    cardPrice: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 22,
        color: 'black'
    },
    cardPurchaseCode: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 18,

        marginBottom: 4
    },
    cardPurchaseName: {
        marginBottom: 24,

        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 16,
        color: 'black',
    },

    billStatus: {
        fontFamily: 'AtypText_medium',
        fontSize: 11,
        lineHeight: 13,
        letterSpacing: 0.1
    },
    billStatusConfirmed: {
        color: '#94D36C'
    },
    billStatusNotConfirmed: {
        color: '#FF9494'
    },
    billStatusProcessing: {
        color: '#ED8E00'
    },

    purchaseStatus: {
        flexDirection: 'row',
        borderRadius: 36,
        overflow: 'hidden'
    },
    purchaseStatusText: {
        flex: 1,
        fontFamily: 'AtypText_medium',
        fontSize: 10,
        lineHeight: 10,
        color: 'white',

        marginHorizontal: 6,
        marginVertical: 3
    }
});

export default List
