import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    Page,
    Input,
    Header
} from '../../../components';
import {
    ScoreCheck,
    ScoreLogoWise
} from '../../../icons';
import commonStyles from "../../../theme/variables/commonStyles";


class PointsTotal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: '',
            description: ''
        }

        this.refUser = this.props.navigation.state.params.ref;
    }

    componentDidMount = () => {
        StatusBar.setBackgroundColor('rgba(255, 255, 255, 1)');
        this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBackgroundColor('rgba(255, 255, 255, 1)');
        });
    }
    componentWillUnmount = () => {
        StatusBar.setBackgroundColor('rgba(255, 255, 255, 0)');
    }

    onChangeForm = (value) => {
        if (value === '.' || value === ',') {
            value = '0.'
        } else {
            value = (!!value) ? parseFloat(value) : '';

        }

        let amount = (value) ? String(value) : '';

        this.setState({
            amount
        })
    }

    onCollectInvoiceClient = () => {
        let cashierContact = this.props.account.contacts.filter((card) => card.type === 'work');

        if (!cashierContact && cashierContact.length <= 0){
            return null
        }
        cashierContact = cashierContact[1];


        let invoice = {
            purchaserContactId: this.refUser.ref,
            cashierContactId: cashierContact._id,
            sumInPoints: this.state.amount,
            description: this.state.description
        };

        this.props.navigation.navigate('TotalData', {
            invoice
        })
    }

    render() {
        return (
            <Page style={styles.page}>
                <Header title={'Создание\nсчета'} styleContainer={styles.headerStyle}  {...this.props}/>

                <ScrollView
                    style={{flex: 1}}
                    contentContainerStyle={[commonStyles.containerBig, styles.scrollView]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.sectionSumma}>
                        <Text style={styles.titleSumma}>Сумма счёта</Text>
                        <Input
                            value={this.state.amount}

                            placeholder="1 000"
                            autoCapitalize="none"
                            keyboardType="decimal-pad"
                            name="amount"
                            type="num"
                            minValue="0"

                            onChangeText={this.onChangeForm}
                        />
                    </View>

                    <View style={styles.sectionSumma}>
                        <Text style={styles.titleSumma}>Описание счета</Text>
                        <Input
                            value={this.state.description}

                            placeholder="Покупка букета цветов"

                            multiline

                            onChangeText={(description) => this.setState({ description })}
                        />
                    </View>
                </ScrollView>
                <View style={styles.containerButtonNext}>
                    <TouchableOpacity
                        style={[
                            styles.buttonNext,

                            (!this.state.amount || !this.state.description) && styles.buttonNextDisabled,
                        ]}
                        onPress={this.onCollectInvoiceClient}

                        disabled={!this.state.amount || !this.state.description}
                    >
                        <Text style={styles.buttonNextText}>Продолжить</Text>
                    </TouchableOpacity>
                </View>
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

    headerStyle: {
        backgroundColor: 'white'
    },

    headerLine: {
        flexDirection: 'row',
        paddingVertical: 10,

        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E8E8E8'
    },
    headerLineLeft: {
        width: 25,
        height: 25,

        marginRight: 16
    },
    headerLineText: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 25,
        letterSpacing: 0.2,
        color: 'black'
    },

    viewHeader: {
        backgroundColor: 'white',
        paddingHorizontal: 30,
        paddingBottom: 5,

        marginBottom: 20,

        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },

    sectionSumma: {
        marginBottom: 48
    },
    titleSumma: {
        marginBottom: 8,

        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 23,
        letterSpacing: 0.2
    },

    sectionInformation: {},
    sectionInformationTitle: {
        fontFamily: 'AtypText_semibold',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.2,

        marginBottom: 8
    },
    sectionInformationDescription: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 17,
        letterSpacing: 0.2,
        color: '#808080'
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
    buttonNextDisabled: {
        opacity: 0.4
    },
    buttonNextText: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: 'white',

        textAlign: 'center'
    }
})

export default PointsTotal
