import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    StatusBar,
    SafeAreaView,
    FlatList, Platform
} from 'react-native';
import commonStyles from "../../theme/variables/commonStyles";
import {
    Page,
    RefreshControl,
    HeaderControlsButtons, LoginHeader
} from "../../components";
import {
    ButtonEdit,
    CardSchedule
} from './components';
import i18n from "i18n-js";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import getHeightStatusBar from "../../helper/getHeightStatusBar";
import localization from "../../localization/localization";
import allTranslations from "../../localization/allTranslations";

const heightStatusBar = getHeightStatusBar();

class Scheduler extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],

            isLoading: true,
            refreshing: true
        }

        this.contact = this.props.app.account.contacts[0];
        this.activeCutaway = this.props.app.activeCutaway;
    }

    componentDidMount = () => {
        this.loadListSchedule(false)

        this.props.navigation.addListener('didFocus', () => {
            this.loadListSchedule(false)
        });
    }

    loadListSchedule = (refreshing = true) => {
        this.setState({ refreshing: refreshing })

        let activeCutaway = (this.activeCutaway) ? this.activeCutaway : this.contact._id;

        let url = urls["get-tasks"] + activeCutaway;

        axios('get', url).then((response) => {
            this.setState({
                list: response.data.data.tasks,

                isLoading: false,
                refreshing: false
            })
        })
    }

    toCreatedPage = () => {
        this.props.navigation.navigate('SchedulerCreate');
    }

    removeItem = (id) => {
        axios('delete', urls["delete-task"] + id).then(() => {
            this.loadListSchedule()
        })
    }

    render() {
        return (
            <Page style={[styles.page, {paddingTop: heightStatusBar}]}>
                <LoginHeader
                    title={allTranslations(localization.schedulerTitle)}
                    isShowButtonBack
                    styleRoot={{marginBottom: 20, paddingHorizontal: 14, marginTop: 12}}
                    {...this.props}
                />

                <SafeAreaView style={{ flex: 1 }}>
                    <FlatList
                        data={this.state.list}
                        contentContainerStyle={commonStyles.container}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        renderItem={(item) => (<CardSchedule {...item.item} removeItem={this.removeItem} {...this.props}/>)}
                        keyExtractor={item => item.id}

                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.loadListSchedule}
                            />
                        }

                    />
                </SafeAreaView>

                <ButtonEdit onPress={this.toCreatedPage}/>
            </Page>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerShown: false
        };
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    controlContainer: {
        marginLeft: -12,
        minHeight: 60,
        marginBottom: 15
    },
})

export default Scheduler
