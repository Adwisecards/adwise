import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import {
    Page,
    Input,
    ModalLoading,
    DropDownHolder
} from '../../../components';
import {
    ScoreLogo,
    ScoreQrCode
} from '../../../icons';

import commonStyles from "../../../theme/variables/commonStyles";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";

const { width } = Dimensions.get('window');

class ScorePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            codeClient: '3378-3132',

            isShowError: false,
            isLoading: false
        }
    }

    componentDidMount = () => {}

    onChangeCodeClient = (codeClient) => {
        this.setState({ codeClient })
    }
    onGetUser = async () => {
        this.setState({ isLoading: true });
        const codeClient = parseInt(this.state.codeClient.replace(/\D+/g,""));

        const ref = await axios('get', `${ urls["get-user-ref"] }${ codeClient }`).then((response) => {
            return response.data.data.ref
        }).catch((error) => {
            return null
        })

        if (!ref){
            this.setState({ isLoading: false });
            DropDownHolder.dropDown.alertWithType('error', 'Ошибка', 'Пользователь не найден');

            return null
        }

        this.setState({ isLoading: false });
        this.props.navigation.navigate('PointsTotal', {
            ref
        });
    }

    render() {
        return (
            <Page style={styles.page}>
                <ScrollView
                    contentContainerStyle={[commonStyles.containerBig, styles.scrollView]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.logoContainer}>
                        <ScoreLogo/>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.textTypography}>{ 'Введите\nкод клиента' }</Text>
                    </View>

                    <View style={styles.containerNumber}>
                        <Input
                            value={this.state.codeClient}
                            autoCapitalize="none"
                            keyboardType="number-pad"
                            placeholder={'XXXX-XXXX'}
                            style={styles.inputNumber}

                            type={'custom'}
                            options={{
                                mask: '9999-9999'
                            }}

                            useMask

                            onChangeText={this.onChangeCodeClient}
                        />

                        {
                            (this.state.isShowError) && (<Text >Обязательно к заполненению</Text>)
                        }

                    </View>
                </ScrollView>

                <View style={styles.containerButtonNext}>
                    <TouchableOpacity
                        style={[
                            styles.buttonNext,

                            (!this.state.codeClient || this.state.codeClient.length !== 9) && styles.buttonNextDisabled,
                        ]}
                        disabled={!this.state.codeClient || this.state.codeClient.length !== 9}

                        onPress={this.onGetUser}
                    >
                        <Text style={styles.buttonNextText}>Продолжить</Text>
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
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    logoContainer: {
        width: width * 0.4,
        height: width * 0.4,

        marginBottom: 60
    },

    textContainer: {
      marginBottom: 32
    },
    textTypography: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 22,
        letterSpacing: 0.1,
        textAlign: 'center'
    },

    containerNumber: {
        flexDirection: 'row',

        width: width * 0.6,

        marginBottom: 24
    },
    inputNumber: {
        height: 50,
        width: '100%'
    },

    buttonScannerQrCode: {
        width: 50,
        height: 50,

        marginLeft: 16,
        padding: 8,

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: 'white',
        borderRadius: 8
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

export default ScorePage
