import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    StatusBar,
} from 'react-native';
import commonStyles from "../../theme/variables/commonStyles";
import {HeaderAccounts, Page} from "../../components";
import {
    ExchangeRequests,
    ExchangePurchases
} from './components';
import getHeightStatusBar from "../../helper/getHeightStatusBar";

const heightStatusBar = getHeightStatusBar();

class Message extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount = () => {}

    render() {
        return (
            <Page style={[styles.page]}>
                <HeaderAccounts title={'Сообщения'} styleRoot={{ marginBottom: 20 }} {...this.props}/>

                <ScrollView
                    contentContainerStyle={commonStyles.container}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <ExchangeRequests list={(!!this.props.app.account) ? this.props.app.account.requests : []} {...this.props}/>
                </ScrollView>
            </Page>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerShow: false,
        };
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})

export default Message
