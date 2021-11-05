import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    BackHandler
} from 'react-native';
import {
    DropDownHolder,
    Page
} from "../../../components";
import {
    ScoreSuccessIcon
} from '../../../icons/index';
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";

const { width } = Dimensions.get('window');

class ScoreSuccess extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.purchaseId = this.props.navigation.state.params.purchaseId;
    }

    componentDidMount = async () => {
        this.onGetPurchase()
    }

    onGetPurchase = async () => {
        const purchase = await axios('get', `${ urls["get-purchase"] }${ this.purchaseId }`).then((response) => {
            return response.data.data
        }).catch((error) => {
            const { data } = error.response;

            if (!data) {
                DropDownHolder.dropDown.alertWithType('error', 'Ошибка', 'Сервер недоступен');
                return null
            }

            DropDownHolder.dropDown.alertWithType('error', 'Ошибка', `${ data.error.message } \n${ data.error.details }`);

            return null
        });

        if (!purchase){
            return null
        }
    }

    render() {
        return (
            <Page style={styles.page}>

                <View style={styles.container}>
                    <View style={styles.logoContainer}>
                        <ScoreSuccessIcon />
                    </View>

                    <Text style={styles.textSuccess}>{'Оплата успешно\nпроведена'}</Text>
                </View>

                <View style={styles.containerButtonNext}>
                    <TouchableOpacity style={styles.buttonNext} onPress={this.onMakePayment}>
                        <Text style={styles.buttonNextText}>Завершить</Text>
                    </TouchableOpacity>
                </View>
            </Page>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerShow: false,
            gesturesEnabled: false,
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

    logoContainer: {
        width: width * 0.5,
        height: width * 0.5,

        marginBottom: 26
    },

    textSuccess: {
        fontFamily: 'AtypText_medium',
        fontSize: 24,
        lineHeight: 29,
        letterSpacing: 0.1,
        textAlign: 'center'
    },

    containerButtonNext: {
        paddingHorizontal: 30,
        paddingVertical: 16
    },
    buttonNext: {
        width: '100%',
        paddingVertical: 13,
        backgroundColor: '#8152E4',
        borderRadius: 10
    },
    buttonNextText: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: 'white',

        textAlign: 'center'
    }
})

export default ScoreSuccess
