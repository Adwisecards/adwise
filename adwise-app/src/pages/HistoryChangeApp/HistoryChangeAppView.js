import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import {
    Page,
    HeaderAccounts
} from "../../components";
import {
    HistoryCard
} from "./components";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import Constants from "expo-constants";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";


class HistoryChangeApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [],
        };

        this.versionApp = Constants.manifest.version;
    }

    componentDidMount = () => {
        this.getListVersion();
    }

    getListVersion = () => {

        axios('get', urls["versions-get-versions"]).then((response) => {
           const resVersions = response.data.data.versions;

           const history = [...resVersions, ...this.state.history];

           this.setState({ history });
        });

    }

    render() {
        return (
            <Page style={styles.page}>
                <HeaderAccounts title={allTranslations(localization.historyChangeAppTitle)} styleRoot={{marginBottom: 32}} {...this.props}/>

                <SafeAreaView style={styles.container}>
                    <FlatList
                        data={this.state.history}

                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}

                        renderItem={(item) => <HistoryCard versionApp={this.versionApp} {...item}/>}
                    />
                </SafeAreaView>

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    container: {
        flex: 1,
        paddingHorizontal: 24
    }
})

export default HistoryChangeApp
