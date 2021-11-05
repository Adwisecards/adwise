import React, {Component} from 'react';
import {
    StyleSheet
} from 'react-native';
import {
    Page
} from "../../components";
import { WebView } from 'react-native-webview';


class PersonalBusinessCardWallet extends Component {
    render() {
        const { contact } = this.props.navigation.state.params;

        return (
            <Page style={styles.page}>

                <WebView
                    // source={{ uri: `https://adwise.cards/wallet-contact/${ contact._id }` }}
                    source={{ uri: `http://14.0.0.161:3000/wallet-contact/${ contact._id }` }}
                    style={{ flex: 1 }}
                />

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})

export default PersonalBusinessCardWallet
