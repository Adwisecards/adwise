import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    StatusBar,
    Dimensions,
    Clipboard,
    TouchableOpacity,
} from 'react-native';
import {Page} from "../../../components";
import {
    Icon
} from 'native-base';
import {
    ModalQrCode,
    DropDownHolder
} from '../../../components';
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import {amplitudeLogEventWithPropertiesAsync} from "../../../helper/Logging";

const headerStatusBar = StatusBar.currentHeight;

const {width} = Dimensions.get('window');

class Invitation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpenScann: false
        }
    }


    onOpenScanner = async () => {
        await amplitudeLogEventWithPropertiesAsync("open-scan-purchase", {})

        this.setState({
            isOpenScann: true
        })
    }

    onScanner = async (purchaseId) => {
        await amplitudeLogEventWithPropertiesAsync("scan-purchase", {
            purchaseId: purchaseId,
        })

        this.props.navigation.navigate('HistoryPurchase', {
            purchaseId: purchaseId
        })
    }

    copyingCode = async (code) => {
        await Clipboard.setString(code);

        DropDownHolder.dropDown.alertWithType('success', 'Успешно', 'Код компании добавлен в буфер обмена')
    }

    render() {
        return (
            <Page style={[styles.page, {paddingTop: headerStatusBar}]}>

                <View style={styles.container}>

                    <Icon
                        type="AntDesign"
                        name="qrcode"
                        style={{
                            fontSize: 80,
                            color: '#8152E4',
                            marginBottom: 0
                        }}
                    />

                    <TouchableOpacity style={styles.buttonOpenScanner} onPress={this.onOpenScanner}>
                        <Text style={styles.buttonOpenScannerText}>Сканировать</Text>
                    </TouchableOpacity>

                </View>

                <ModalQrCode
                    isOpen={this.state.isOpenScann}

                    onEventScann={this.onScanner}
                    onClose={() => this.setState({isOpenScann: false})}
                />
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

    container: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonOpenScanner: {
        paddingHorizontal: 24,
        paddingVertical: 16,

        backgroundColor: '#8152E4',

        borderRadius: 6,

        marginTop: 24
    },
    buttonOpenScannerText: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 20,
        color: 'white',
        textAlign: 'center'
    },
})

export default Invitation
