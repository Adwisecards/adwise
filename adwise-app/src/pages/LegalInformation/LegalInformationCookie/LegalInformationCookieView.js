import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {HeaderAccounts, Page} from "../../../components";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";


class LegalInformationCookie extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount = () => {}

    render() {
        return (
            <Page style={styles.page}>
                <HeaderAccounts title={allTranslations(localization.legalInformationCookiePolicy)} {...this.props}/>
            </Page>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '',
        };
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})

export default LegalInformationCookie
