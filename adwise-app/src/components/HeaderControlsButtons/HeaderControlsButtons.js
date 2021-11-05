import React, { useState } from 'react';
import {
    View,
    Share,
    StatusBar,
    StyleSheet,
    Dimensions
} from 'react-native';
import ButtonControl from './ButtonControl';
import ModalScanner from './ModalScanner';
import ModalLoading from '../ModalLoading';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
    updateAccount
} from '../../AppState';
import {
    Icon
} from "native-base";
import {
    Scan as ScanIcon,
    Share as ShareIcon,
    Scheduler as SchedulerIcon,
    SearchIcon
} from "../../icons";

import i18n from "i18n-js";
import urls from "../../constants/urls";
import {amplitudeLogEventWithPropertiesAsync} from "../../helper/Amplitude";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";
import SendShare from "../../helper/Share";

const { width } = Dimensions.get('window');

const HeaderControlsButtons = (props) => {
    const {navigation, styleContainer, active} = props;
    const [openModalScanner, setOpenModalScanner] = useState(false);
    const [openLoading, setOpenLoading] = useState(false);

    const handleToScanner = () => {
        setOpenModalScanner(!openModalScanner)
    }
    const handleOrganizations = () => {
        navigation.navigate('Search');
    }
    const handleShare = async () => {
        await setOpenLoading(true);

        let card;
        let url;
        let message;
        let account = props.app.account;
        let activeCutaway = props.app.activeCutaway;

        if (activeCutaway){
            card = account.contacts.find((item) => item._id === activeCutaway);
        }else{
            card = account.contacts[0]
        }

        await setOpenLoading(false);

        await amplitudeLogEventWithPropertiesAsync('user-shared-cutaway', {
            cutawayId: activeCutaway._id
        });

        url = `${ urls["web-site"] }/card/${ card._id }`;
        message = allTranslations(localization.commonUserSharedCards, {
            lastName: card.lastName.value,
            firstName: card.firstName.value,
            url: url
        });

        await SendShare({
            message
        })
    }

    return (
        <View style={styles.root}>
            <View style={[styles.controlContainer, styleContainer]}>
                <View style={styles.button}>
                    <ButtonControl active={active === 'scan'} onPress={handleToScanner} title={allTranslations(localization.commonScan)} Icon={ScanIcon}/>
                </View>
                <View style={styles.button}>
                    <ButtonControl
                        active={active === 'share'}
                        onPress={handleOrganizations}
                        title={allTranslations(localization.commonOrganizations)}
                        Icon={() => (<Icon name="briefcase" type="Feather" style={{fontSize: 20, color: "#8152E4"}}/>)}
                    />
                </View>
            </View>

            <ModalScanner
                isOpen={openModalScanner}
                onClose={handleToScanner}

                setOpenLoading={(openLoading) => setOpenLoading(openLoading)}

                updateAccount={props.updateAccount}
                {...props}
            />

            <ModalLoading
                isOpen={openLoading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {},

    controlContainer: {
        flexDirection: 'row',

        marginLeft: -12
    },

    button: {
        flex: 1,
        maxWidth: ((width - 12) / 2) - 12,

        marginLeft: 12
    }
})

export default compose(
    connect(
        state => ({
            app: state.app
        }),
        dispatch => ({
            updateAccount: (account) => dispatch(updateAccount(account))
        }),
    ),
)(HeaderControlsButtons);
