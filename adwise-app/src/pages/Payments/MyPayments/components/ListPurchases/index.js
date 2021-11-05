import React, { PureComponent } from "react";
import {
    View,
    FlatList,
    SafeAreaView
} from "react-native";
import Purchase from "../Purchase";
import PurchaseLoading from "../PurchaseLoading";
import {RefreshControl} from "../../../../../components";

class ListPurchases extends PureComponent {

    onChangeFilter = () => {
        const { filter, pagination, onChangeFilter } = this.props;

        let newFilter = {...filter};
        newFilter.page++;

        if (newFilter.page > pagination.pages) {
            return null
        }

        onChangeFilter(newFilter, true);
    }

    _renderItem = ({ item }) => {
        const { navigation, onSendTips, onAddArchive, onGiveCoupon } = this.props;

        return (
            <Purchase
                purchase={item}
                navigation={navigation}
                onSendTips={onSendTips}
                onAddArchive={onAddArchive}
                onGiveCoupon={onGiveCoupon}
            />
        )
    }

    render() {
        const {
            filter,
            isLoading,
            purchases,
            onRefresh,
            pagination,
            isRefreshing
        } = this.props;

        return (
            <SafeAreaView
                style={{flex: 1}}
            >
                <FlatList
                    data={purchases}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    renderItem={this._renderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{paddingHorizontal: 12}}
                    onEndReached={this.onChangeFilter}
                    ListFooterComponent={() => {
                        if (isLoading || pagination.pages > filter.page) {
                            return (
                                <>

                                    <PurchaseLoading/>
                                    <PurchaseLoading/>

                                </>
                            )
                        }

                        return null
                    }}
                />
            </SafeAreaView>
        )
    }
}



export default ListPurchases
