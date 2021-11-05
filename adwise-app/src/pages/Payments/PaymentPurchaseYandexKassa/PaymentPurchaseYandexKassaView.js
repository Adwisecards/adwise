import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    WebView
} from "react-native-webview";
import {Page} from "../../../components";


class PaymentPurchaseYandexKassa extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        }

        this.webView = React.createRef();
        this.paymentUrl = this.props.navigation.state.params.paymentUrl;
    }

    componentDidMount = () => {}

    onLoadingWebView = () => {}

    onShouldStartLoadWithRequest = (props) => {
        if (props.url.indexOf('successful-payment') > -1) {
            this.props.navigation.goBack();

            return null
        }

        return true
    }

    render() {
        const injectedJavaScript = `
        document.getElementsByClassName('layout-wrapper')[0].style.display = 'none'
        document.getElementsByClassName('layout-wrapper')[1].style.display = 'none'        
        document.getElementsByClassName('payment-scenario__bottom')[0].style.display = 'none'        
        `;

        return (
            <View style={styles.page}>
                <WebView
                    ref={this.webView}
                    style={{flex: 1 }}
                    source={{
                        uri: this.paymentUrl,
                        method: 'GET'
                    }}
                    originWhitelist={['https://securepay.tinkoff.ru', 'http://securepay.tinkoff.ru', '*']}
                    onLoad={this.onLoadingWebView}
                    scalesPageToFit={false}
                    startInLoadingState={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    injectedJavaScript={injectedJavaScript}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    onNavigationStateChange={this.onShouldStartLoadWithRequest}
                />
            </View>
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
        flex: 1,
        backgroundColor: 'red'
    },
})

export default PaymentPurchaseYandexKassa
