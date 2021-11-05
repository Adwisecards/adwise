import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {Header} from "./components";
import { NavigationActions } from 'react-navigation'
import commonStyles from "../../../theme/variables/commonStyles";
import {Icon} from "native-base";
import {DropDownHolder, ModalLoading, Page} from "../../../components";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";


class OrganizationExchaner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            organization: {},

            isLoadOrganization: true,
            isSubscribeOrganization: false
        }
    }

    componentDidMount = () => {
        this.loadOrganization()
    }

    loadOrganization = () => {
        let { mode, ref, type } = this.props.navigation.state.params;

        axios('get', urls["get-organization-by-invitation"] + ref).then(response => {
            this.setState({
                organization: response.data.data.organization,
                isLoadOrganization: false
            })
        })
    }

    fixExchange = () => {
        this.setState({ isSubscribeOrganization: true })

        let { ref } = this.props.navigation.state.params;
        let organizationId = this.state.organization._id;

        let account = this.props.app.account;
        let accountId = this.props.app.activeCutaway;

        if (!accountId) {
            accountId = account.contacts[0]._id;
        }

        axios('put', urls["subscribe-to-organization"] + organizationId, {
            contactId: accountId,
            invitationId: ref
        }).then(response => {
            this.updateUser(organizationId);
        }).catch(error => {
            this.setState({ isSubscribeOrganization: false });

            DropDownHolder.alert(
                'error',
                allTranslations(localization.notificationTitleError),
                allTranslations(localization.informationWhenExchangingNotificationsFixExchangeMessageError)
            );
        })
    }
    updateUser = (organizationId) => {
        let activeCutaway = this.props.app.activeCutaway;
        let account = {...this.props.app.account};
        let card = {};

        if (activeCutaway){
            card = account.contacts.find((card) => card._id === activeCutaway);
        }else {
            card = account.contacts[0]
        }

        card.subscriptions = [...card.subscriptions, organizationId];

        this.props.updateAccount(account)

        this.setState({
            isSubscribeOrganization: false
        })

        this.props.navigation.replace('CompanyPageMain', {
            organizationId
        })
    }

    render() {
        if (this.state.isLoadOrganization){
            return (
                <Page style={[styles.page]}>
                    <Header/>

                    <View style={[commonStyles.container]}>
                        <View style={styles.containerBorder}>
                            <Text style={styles.typographyUserName}>{allTranslations(localization.informationWhenExchangingMessageLoading)}</Text>
                        </View>
                    </View>
                </Page>
            )
        }

        return (
            <Page style={[styles.page]}>
                <Header
                    organization={this.state.organization}
                />

                <View style={[commonStyles.container]}>
                    <View style={styles.containerBorder}>
                        <Text style={styles.typographyUserName}>{allTranslations(localization.informationWhenExchangingInvitationCompany)} "{ this.state.organization?.name }"</Text>
                    </View>

                    <TouchableOpacity style={styles.buttonExchaner} onPress={this.fixExchange}>
                        <Text style={styles.buttonExchanerText}>{allTranslations(localization.commonSubscribe)}</Text>
                    </TouchableOpacity>
                </View>

                <ModalLoading
                    isOpen={this.state.isSubscribeOrganization}
                />
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    containerBorder: {
        padding: 16,
        borderRadius: 4,
        backgroundColor: 'white'
    },

    typographyUserName: {
        fontSize: 24,
        lineHeight: 26,
        fontFamily: 'AtypText_medium'
    },
    typographyUserActivity: {
        marginTop: 6,

        fontSize: 18,
        lineHeight: 22,
        opacity: 0.6,
        fontFamily: 'AtypText_medium'
    },

    typographySectionTitle: {
        fontFamily: 'AtypText_semibold',
        fontSize: 16,
        lineHeight: 23
    },
    typographySectionDescription: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 19,

        marginTop: 9
    },

    buttonExchaner: {
        marginTop: 32,

        width: '100%',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: 40,

        height: 50,
        borderRadius: 10,
        backgroundColor: '#8152E4'
    },
    buttonExchanerIcon: {
        fontSize: 24,
        color: 'white'
    },
    buttonExchanerText: {
        fontSize: 20,
        lineHeight: 22,
        fontFamily: 'AtypText_medium',
        color: 'white',

        marginLeft: 8
    },
})

export default OrganizationExchaner
