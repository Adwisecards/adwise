import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    History
} from "./components";
import {
    Page,
    HeaderAccounts
} from "../../../components";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";


class FinanceAllHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [],

            filter: {
                page: 1,
                limit: 50
            },

            isLoading: true,
            isShowButtonMore: true,
        }
    }

    componentDidMount = () => {
        this.gitOperations();
    }

    gitOperations = () => {
        const search = this.getFilter();
    }
    getFilter = () => {
        let filterList = [];
        const filter = {...this.state.filter};

        Object.keys(filter).map((key) => {
           filterList.push(`${ key }=${ filter[key] }`)
        });

        return `?${ filterList.join('&') }`
    }

    onLoadMore = () => {
        let filter = {...this.state.filter};

        filter.page++;

        this.setState({
            filter
        }, () => {
            this.gitOperations();
        });
    }
    onRefresh = () => {
        let filter = {...this.state.filter};

        filter.page = 1;

        this.setState({
            filter
        }, () => {
            this.gitOperations();
        });
    }

    render() {
        const {
            rows,
            filter,
            isLoading,
            isShowButtonMore
        } = this.state;

        return (
            <Page style={styles.page}>

                <HeaderAccounts
                    title={allTranslations(localization.companyPagesOperationsHistory)}
                    styleRoot={{ marginBottom: 16 }}

                    { ...this.props }
                />

                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                >

                    <History
                        items={rows}
                        filter={filter}
                        isLoading={isLoading}
                        isShowButtonMore={isShowButtonMore}

                        onRefresh={this.onRefresh}
                        onLoadMore={this.onLoadMore}
                    />

                </ScrollView>

            </Page>
        );
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})

export default FinanceAllHistory
