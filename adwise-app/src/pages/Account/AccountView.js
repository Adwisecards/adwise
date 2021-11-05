import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView
} from 'react-native';
import {
    Page,
    ModalLoading
} from '../../components';
import {
    User,
    Menu,
    Application
} from './components';
import commonStyles from "../../theme/variables/commonStyles";
import {deleteItemAsync} from "../../helper/SecureStore";

import accountAboutApp from '../../../assets/graphics/account/account_about_app.png';
import accountFeedback from '../../../assets/graphics/account/account_feedback.png';
import accountSettings from '../../../assets/graphics/account/account_settings.png';
import accountLegalInformation from '../../../assets/graphics/account/account_legal_information.png';
import acountArchiveOrders from "../../../assets/graphics/account/archive_orders.png";
import acountContacts from "../../../assets/graphics/account/contacts.png";
import acountExit from "../../../assets/graphics/account/exit.png";
import acountHiddenCoupons from "../../../assets/graphics/account/hidden_coupons.png";

import getHeightStatusBar from "../../helper/getHeightStatusBar";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";

const heightStatusBar = getHeightStatusBar();

class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalLoading: false
        }
    }

    getListMenu = () => {
        return [
            {
                title: allTranslations(localization.accountMenuFeedback),
                icon: accountFeedback,
                Path: 'Feedback'
            },
            {
                title: allTranslations(localization.accountMenuContacts),
                icon: acountContacts,
                Path: 'Contacts'
            },
            {
                title: allTranslations(localization.accountMenuAboutApp),
                icon: accountAboutApp,
                Path: 'AboutApp'
            },
            {
                title: allTranslations(localization.accountMenuLegalInformationHome),
                icon: accountLegalInformation,
                Path: 'LegalInformationHome'
            },
            {
                title: allTranslations(localization.accountMenuSettings),
                icon: accountSettings,
                Path: 'Settings'
            },
            {
                title: allTranslations(localization.accountMenuMyPaymentsArchive),
                icon: acountArchiveOrders,
                Path: 'MyPaymentsArchive'
            },
            {
                title: allTranslations(localization.accountMenuCouponsDisabled),
                icon: acountHiddenCoupons,
                Path: 'CouponsDisabled'
            },
            {
                title: allTranslations(localization.accountMenuExit),
                icon: acountExit,
                Path: null,
                isExitAccount: true
            }
        ]
    }
    userExit = async () => {
        this.setState({isModalLoading: true});

        await axios("get", urls["users-logout"]).catch((error) => {
            console.log('error: ', error)
        });
        await deleteItemAsync('jwt');

        this.props.updateAccount(null);
        this.props.updateActiveCutaway('');

        this.setState({isModalLoading: false});
    }

    render() {
        const account = this?.props?.app?.account || null;

        if (!account) {
            return null
        }

        return (
            <Page style={[styles.page, {paddingTop: heightStatusBar}]}>
                <ScrollView
                    contentContainerStyle={[commonStyles.container, {paddingBottom: 40}]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <User account={account} {...this.props}/>

                    <Menu
                        list={this.getListMenu()}
                        onUserExit={this.userExit}

                        {...this.props}
                    />

                    <Application/>

                    <ModalLoading
                        isOpen={this.state.isModalLoading}
                    />
                </ScrollView>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})

export default Account
