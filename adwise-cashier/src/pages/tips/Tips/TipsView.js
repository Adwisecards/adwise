import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    Header,
    Page,
    RefreshControl
} from "../../../components";
import {
    Table,
    Information
} from "./components";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";


class Tips extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tips: [],

            filter: {
                limit: 20,
                page: 1
            },
            stats: {},

            isLoading: true,
            isPermission: true,
            isLoadingMore: true,
            isShowButtonMore: false,
        };

        this.workCards = props.app.account.contacts.find((t) => t.type === 'work');
    }

    componentDidMount = () => {
        const isPermission = this.workCards?.organization?.tips;

        if (!isPermission) {
            this.setState({isPermission});

            return null
        }

        this.getListTips();
        this.getStatsTips();
    }

    getListTips = (isRefreshing = false) => {
        const {account} = this.props.app;
        const {contacts} = account;
        const workContact = contacts.find((t) => t.type === 'work') || {};
        const search = this.getFilter();

        axios('get', `${ urls["tips-get-cashier-tips"] }/${ workContact._id }${ search }`).then((response) => {
            const resTips = response.data.data.tips;
            let tips = [...this.state.tips];

            if (isRefreshing) {
                tips = [];
            }

            tips = [...tips, ...resTips]

            this.setState({
                tips,
                isShowButtonMore: Boolean(resTips.length === this.state.filter.limit),
                isLoading: false
            })
        }).catch((error) => {
            console.log('error: ', error.response)
        });
    }
    getFilter = () => {
        let filterList = [];
        let filter = {...this.state.filter};

        Object.keys(filter).map((key) => {
            const value = filter[key];

            if (key) {
                filterList.push(`${ key }=${ value }`)
            }
        });

        return `?${ filterList.join('&') }`
    }

    getStatsTips = () => {
        const {account} = this.props.app;
        const {contacts} = account;
        const workContact = contacts.find((t) => t.type === 'work') || {};

        axios('get', `${ urls["tips-get-cashier-tips-statistics"] }/${ workContact._id }`).then((response) => {
            this.setState({
                stats: response.data.data
            })
        })
    }

    onRefresh = () => {
        let filter = {...this.state.filter};

        filter.page = 1;

        this.setState({
            filter,
            isLoading: true
        }, () => {
           this.getListTips(true);
           this.getStatsTips();
        });
    }

    onLoadMore = () => {
        let filter = {...this.state.filter};

        filter.page++

        this.setState({ filter }, () => {
            this.getListTips();
        });
    }

    render() {
        if (!this.workCards) {
            return (
                <Page styleContainer={styles.page}>

                    <View style={{ padding: 18 }}>
                        <ScrollView contentContainerStyle={styles.scrollView}  showsVerticalScrollIndicator={false}>

                            <View style={styles.item}>
                                <Text style={styles.itemTitle}>Вы не являетесь кассиром организации.</Text>
                            </View>

                        </ScrollView>
                    </View>

                </Page>
            )
        }

        const { isPermission } = this.state;
        if (!isPermission) {
            return (
                <Page style={styles.page}>

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Чаевые</Text>
                    </View>

                    <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
                        <Text style={[styles.textLoading, { marginBottom: 12 }]}>У вашей организации не подключенны чаевые.</Text>
                        <Text style={styles.textLoading}>Что бы включить чаевые обратитесь к управляющему организации.</Text>
                    </View>

                </Page>
            )
        }

        return (
            <Page style={styles.page}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Чаевые</Text>
                </View>

                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={this.state.isLoading} onRefresh={this.onRefresh} />
                    }
                >

                    <View style={{ marginBottom: 16 }}>
                        <Information stats={this.state.stats}/>
                    </View>

                    {
                        Boolean(!this.state.isLoading) ? (
                            <View>
                                <Table
                                    tips={this.state.tips}
                                    filter={this.state.filter}

                                    isShowButtonMore={this.state.isShowButtonMore}

                                    onLoadMore={this.onLoadMore}
                                />
                            </View>
                        ) : (
                           <View>
                               <Text style={styles.textLoading}>Идет загрузка...</Text>
                           </View>
                        )
                    }

                </ScrollView>

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,

        paddingTop: 18
    },

    header: {
        marginBottom: 12
    },
    headerTitle: {
        fontFamily: 'AtypDisplay',
        fontSize: 18,
        lineHeight: 22,
        textAlign: 'center'
    },

    textLoading: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 20
    },
})

export default Tips
