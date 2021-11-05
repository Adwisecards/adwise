import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar, Platform,
} from 'react-native';
import commonStyles from "../../../theme/variables/commonStyles";
import {
    Page,
    Switch,
    HeaderAccounts, DropDownHolder
} from "../../../components";
import {
    Language
} from './components';
import {
    Icon
} from 'native-base';
import getHeightStatusBar from "../../../helper/getHeightStatusBar";
import {amplitudeLogEventWithPropertiesAsync} from "../../../helper/Amplitude";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";

const heightStatusBar = getHeightStatusBar();

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount = async () => {

        await amplitudeLogEventWithPropertiesAsync('user-open-page-settings', {});

    }

    goToPage = (name) => {
        this.props.navigation.navigate(name);
    }

    onUpdateLanguage = async (language) => {

        const response = await axios('put', urls["set-user-language"], { language }).then((res) => {
            return res
        }).catch((err) => {
            return err
        })

        DropDownHolder.alert('success', 'Системное уведомление', 'Язык успешно изменен');

        this.props.updateLanguage(language);

    }

    render() {
        return (
            <Page style={[styles.page]}>

                <HeaderAccounts title={'Настройки'} styleRoot={{ marginBottom: 62 }} {...this.props}/>

                <ScrollView
                    contentContainerStyle={[commonStyles.container, {paddingBottom: 40}]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <Language
                        language={this.props.app.language}
                        updateLanguage={this.onUpdateLanguage}
                    />

                    <View style={styles.section}>
                        <View style={styles.sectionSeparate} />
                        <TouchableOpacity style={styles.sectionItem} onPress={() => this.goToPage('SettingPushNotification')}>
                            <Text style={styles.sectionText}>Настройка уведомлений</Text>
                            <Icon name={'keyboard-arrow-right'} style={{color: '#804fd4'}} type={'MaterialIcons'}/>
                        </TouchableOpacity>
                        <View style={styles.sectionSeparate} />
                        <TouchableOpacity style={styles.sectionItem} onPress={() => this.goToPage('ChangePassword')}>
                            <Text style={styles.sectionText}>Изменить пароль</Text>
                            <Icon name={'keyboard-arrow-right'} style={{color: '#804fd4'}} type={'MaterialIcons'}/>
                        </TouchableOpacity>
                        <View style={styles.sectionSeparate} />
                    </View>

                </ScrollView>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    section: {},
    sectionTitle: {
        fontSize: 16,
        lineHeight: 18,
        opacity: 0.6,
        fontFamily: 'AtypText',

        marginBottom: -4
    },

    sectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20
    },
    sectionText: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 20,
        letterSpacing: 0.01
    },
    sectionSeparate: {
        width: '100%',
        height: 1,
        backgroundColor: '#dddcdd'
    },
})

export default Settings
