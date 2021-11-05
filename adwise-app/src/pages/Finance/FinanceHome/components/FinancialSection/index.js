import React, { PureComponent } from "react";
import {
    View,
    Text,
    ScrollView
} from "react-native";
import commonStyles from "../../../../../theme/variables/commonStyles";
import {RefreshControl} from "../../../../../components";
import {History, MyFinances} from "../../../FinancialSection/components";

class FinancialSection extends PureComponent{
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <ScrollView
                contentContainerStyle={[commonStyles.container, {paddingTop: 20}]}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}

                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.onRefresh}
                    />
                }
            >

                <View style={{ marginBottom: 40 }}>
                    <MyFinances
                        {...this.state.information}
                        {...this.props}

                        onCreateWithdrawalFunds={this.onCreateWithdrawalFunds}
                    />
                </View>

                <History
                    items={this.state.information.operations}

                    {...this.props}
                />

            </ScrollView>
        )
    }
}

export default FinancialSection
