import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
    ImageBackground
} from 'react-native';
import {
    Page,
    Header,
    ModalLoading,
    DropDownHolder
} from '../../../components';
import commonStyles from "../../../theme/variables/commonStyles";
import {formatMoney} from "../../../helper/format";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";

class TotalData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        }

        this.invoice = this.props.navigation.state.params.invoice;
    }

    componentDidMount = () => {
        StatusBar.setBackgroundColor('rgba(255, 255, 255, 0)');
        this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBackgroundColor('rgba(255, 255, 255, 0)');
        });
    }

    onCreatePurchase = async () => {
        this.setState({ isLoading: true });

        const response = await axios('post', urls["create-purchase"], this.invoice).then((response) => {
            return response.data.data
        }).catch((error) => {
            const { data } = error.response;

            if (!data) {
                DropDownHolder.dropDown.alertWithType('error', 'Ошибка', 'Сервер недоступен');
                return null
            }

            DropDownHolder.dropDown.alertWithType('error', 'Ошибка', `${ data.error.message } \n${ data.error.details }`);

            return null
        })

        if (!response){
            this.setState({ isLoading: false })
            DropDownHolder.dropDown.alertWithType('error', 'Ошибка', 'Покупка не произведена');
            return null
        }

        this.props.navigation.replace('ScoreSuccess', {
            purchaseId: response.purchaseId
        });
    }

    render() {
        return (
            <Page style={styles.page}>
                <Header title={'Итоговые данные'} { ...this.props }/>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={[commonStyles.containerBig, styles.scrollView]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.containerCheck}>
                        <View style={styles.itemCheck}>
                            <View style={styles.itemLeft}>
                                <Text style={styles.itemTitle}>Сумма счёта</Text>
                            </View>
                            <View style={styles.itemRight}>
                                <Text style={styles.itemValue}>{ formatMoney(this.invoice.sumInPoints) } ₽</Text>
                            </View>
                        </View>

                        {
                            false && (
                                <View style={styles.itemCheck}>
                                    <View style={styles.itemLeft}>
                                        <Text style={styles.itemTitle}>Кэшкбэк </Text>
                                    </View>
                                    <View style={styles.itemRight}>
                                        <Text style={styles.itemValue}>115 баллов</Text>
                                    </View>
                                </View>
                            )
                        }


                        <View style={[styles.itemCheck, { borderBottomWidth: 0 }]}>
                            <Text style={styles.totalText}>К оплате: { formatMoney(this.invoice.sumInPoints) } ₽</Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.containerButtonNext}>
                    <TouchableOpacity style={styles.buttonNext} onPress={this.onCreatePurchase}>
                        <Text style={styles.buttonNextText}>Провести оплату</Text>
                    </TouchableOpacity>
                </View>

                <ModalLoading
                    isOpen={this.state.isLoading}
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

    scrollView: {
        paddingBottom: 50
    },

    containerCheck: {
        borderRadius: 10,
        paddingVertical: 3,
        paddingBottom: 10,
        paddingHorizontal: 16,
        backgroundColor: 'white'
    },
    containerCheckButton: {
        height: 14,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -14
    },

    itemCheck: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        paddingVertical: 10,

        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E8E8E8'
    },
    itemLeft: {},
    itemRight: {},
    itemTitle: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 25,
        letterSpacing: 0.2,
        color: '#808080'
    },
    itemValue: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 25,
        letterSpacing: 0.2,
        color: '#000000'
    },

    totalText: {
        fontFamily: 'AtypText_semibold',
        fontSize: 18,
        lineHeight: 26,
        letterSpacing: 0.2
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

export default TotalData
