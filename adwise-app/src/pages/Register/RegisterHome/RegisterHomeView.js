import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import {
    Text,
    Icon
} from 'native-base';
import {
    Page
} from '../../../components/index';
import commonStyles from '../../../theme/variables/commonStyles';
import getHeightStatusBar from "../../../helper/getHeightStatusBar";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

const heightStatusBar = getHeightStatusBar();

class RegisterHome extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    _navigatePhone = () => {
        this.props.navigation.navigate('RegisterPhoneInput');
    }
    _navigateLogin = () => {
        this.props.navigation.navigate('Login')
    }
    _navigationGoHome = () => {
        this.props.navigation.navigate('StartScreen')
    }

    render() {
        return (
            <Page style={[styles.page, { marginTop: heightStatusBar, paddingVertical: 32 }]}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButtonBack} onPress={this._navigationGoHome}>
                        <Icon style={styles.headerButtonBackIcon} name={'arrow-left'} type={'Feather'}/>
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>{ allTranslations(localization.registrationHeaderWelcome) }</Text>
                    <Text style={styles.headerDescription}>{ allTranslations(localization.registrationStageOnePleaseRegister) }</Text>
                </View>

                <ScrollView contentContainerStyle={[commonStyles.container, styles.container]}>
                    <View style={styles.content}>
                        <TouchableOpacity style={styles.buttonRegistrationType} onPress={this._navigatePhone}>
                            <Icon style={styles.buttonRegistrationTypeIcon} name={'phone'} type={'Feather'}/>
                            <Text style={styles.buttonRegistrationTypeText}>{ allTranslations(localization.registrationButtonsByPhone) }</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>{ allTranslations(localization.registrationStageOneAlreadyRegistered) }</Text>
                    <TouchableOpacity style={styles.footerButton} onPress={this._navigateLogin}>
                        <Text style={styles.footerButtonText}>{ allTranslations(localization.registrationButtonsLoginHere) }</Text>
                    </TouchableOpacity>
                </View>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    header: {
        marginBottom: 24,
        position: 'relative'
    },
    headerButtonBack: {
        position: 'absolute',
        left: 0,
        top: 0,

        padding: 16,
        margin: -16,
        marginLeft: 0,

        zIndex: 999
    },
    headerButtonBackIcon: {
        color: '#8152E4',
        fontSize: 32
    },
    headerTitle: {
        fontSize: 30,
        lineHeight: 33,
        fontFamily: 'AtypText_medium',
        textAlign: 'center',

        marginBottom: 16
    },
    headerDescription: {
        fontSize: 18,
        lineHeight: 22,
        fontFamily: 'AtypText',
        textAlign: 'center'
    },

    container: {
        flex: 1,
        paddingHorizontal: 32
    },

    content: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonRegistrationType: {
        backgroundColor: '#ED8E00',
        paddingVertical: 14,
        paddingHorizontal: 34,
        borderRadius: 10,

        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonRegistrationTypeIcon: {
        fontSize: 20,
        color: 'white',

        marginRight: 12
    },
    buttonRegistrationTypeText: {
        fontSize: 20,
        lineHeight: 20,
        color: 'white',

        fontFamily: 'AtypText_medium'
    },

    footer: {
        paddingTop: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerTitle: {
        fontSize: 14,
        lineHeight: 16,
        fontFamily: 'AtypText'
    },
    footerButton: {
        paddingVertical: 8,
        paddingHorizontal: 24
    },
    footerButtonText: {
        fontSize: 14,
        lineHeight: 16,
        fontFamily: 'AtypText',

        color: '#ED8E00'
    },

    typographyHint: {
        fontSize: 18,
        lineHeight: 22,
        textAlign: 'center',

        fontFamily: 'AtypText'
    },
})

export default RegisterHome
