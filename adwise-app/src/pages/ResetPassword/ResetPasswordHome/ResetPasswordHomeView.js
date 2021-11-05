import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {
    Icon
} from 'native-base';
import {LoginHeader, Page} from "../../../components";

import commonStyles from "../../../theme/variables/commonStyles";
import * as Linking from "expo-linking";
import variables from "../../../constants/variables";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";


class ResetPasswordHome extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount = () => {}

    _routeSupport = () => {
        Linking.openURL(`tg://resolve?domain=${variables["telegram-bot"]}&start=tgorg`);
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <Page style={styles.page}>
                <LoginHeader
                    title={allTranslations(localization.resetPasswordHomeTitle)}
                    linkGoBack={'Login'}
                    styleTitle={{ textAlign: 'left' }}
                    styleContainerTitle={{ alignItems: 'flex-start' }}
                    isShowButtonBack
                    {...this.props}
                />

                <ScrollView contentContainerStyle={[commonStyles.containerBig, styles.container]}>
                    <View style={[styles.section, { marginBottom: 60 }]}>
                        <Icon style={styles.sectionIcon} name={'phone'} type={'Feather'}/>

                        <TouchableOpacity style={styles.sectionButton} onPress={() => navigate('ResetPasswordPhone')}>
                            <Text  style={styles.sectionButtonText}>{allTranslations(localization.resetPasswordHomeButtonReset)}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <TouchableOpacity style={styles.buttonSupport} onPress={this._routeSupport}>
                    <Text style={styles.buttonSupportText}>{allTranslations(localization.commonContactSupport)}</Text>
                </TouchableOpacity>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    imageBackground: {
        flex: 1,
        position: 'absolute',
        resizeMode: "cover",
        justifyContent: "center"
    },

    container: {
        flex: 1,
        justifyContent: 'center'
    },

    section: {
        alignItems: 'center'
    },
    sectionIcon: {
        fontSize: 35,
        color: '#ED8E00',
        marginBottom: 32
    },
    sectionButton: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#8152E4'
    },
    sectionButtonText: {
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 44,
        height: 50,
        color: 'white',
        fontFamily: 'AtypText'
    },

    buttonSupport: {
        marginBottom: 30
    },
    buttonSupportText: {
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 30,
        color: '#ED8E00'
    }
})

export default ResetPasswordHome
