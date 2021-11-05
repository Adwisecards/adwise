import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,

    SafeAreaView,
    FlatList
} from 'react-native';
import {
    Page,
    HeaderAccounts
} from "../../../components";
import {
    Language
} from "./components";
import {setItemAsync} from "../../../helper/SecureStore";
import {
    LangRu as LangRuIcon,
    LangUk as LangUkIcon,
    LangEs as LangEsIcon,
    LangPt as LangPtIcon
} from "../../../icons";
import i18n from "i18n-js";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";


class LanguageSelection extends Component {
    constructor(props) {
        super(props);

        this.state = {}

        this.languageList = [
            {
                key: "ru",
                title: "Русский",
                icon: LangRuIcon
            },
            {
                key: "en",
                title: "English",
                icon: LangUkIcon
            },
            // {
            //     key: "es",
            //     title: "España",
            //     icon: LangEsIcon
            // },
            {
                key: "pt",
                title: "Português",
                icon: LangPtIcon
            }
        ];
    }

    componentDidMount = () => {}

    onSetLanguage = async (key) => {
        await setItemAsync('application_language', key);
        i18n.locale = key;
        this.props.updateLanguage(key);
    }

    render() {
        return (
            <Page style={styles.page}>
                <HeaderAccounts
                    title="Select application language"

                    hideBackButton
                />

                <SafeAreaView style={{ flex: 1 }}>
                    <FlatList
                        data={this.languageList}
                        contentContainerStyle={{ padding: 16 }}

                        renderItem={(props) => <Language languageListCount={this.languageList.length} onSetLanguage={this.onSetLanguage} {...props}/>}
                    />
                </SafeAreaView>

            </Page>
        );
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})

export default LanguageSelection
