import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    Page,
    ModalQrCode
} from "../../../components";
import {
    PurchaseTypeCoupon as PurchaseTypeCouponIcon
} from '../../../icons';

import queryString from "query-string";
import * as Linking from "expo-linking";
import commonStyles from "../../../theme/variables/commonStyles";
import {amplitudeLogEventWithPropertiesAsync} from "../../../helper/Logging";

class PurchaseHome extends Component {

    componentDidMount = async () => {
        const url = await Linking.getInitialURL();

        await this.startApp(url);

        await this.switchUrlApp(url);
        await Linking.addEventListener('url', (event) => {
            (async () => {
                await this.switchUrlApp(event.url);
            })();
        });

    }

    startApp = async (url) => {
        await amplitudeLogEventWithPropertiesAsync("start-app", {
            url: url,
        })
    }

    switchUrlApp = async (url) => {
        const mode = (true) ? 'prod' : 'develop';

        if (!url) {
            return null
        }

        let paramsLink = null;
        let path = null;
        let queryParams = null;

        if (mode === 'prod') {
            paramsLink = url.split('?');
            path = paramsLink[0].split('//')[1];
            queryParams = queryString.parse(paramsLink[1]);
        } else {
            paramsLink = url.split('?');
            path = paramsLink[0].split('/')[4];
            queryParams = queryString.parse(paramsLink[1]);
        }



        switch (path) {
            case 'purchase': {
                if (!queryParams.purchaseId) {
                    return null
                }

                this.props.navigation.navigate('HistoryPurchase', {
                    purchaseId: queryParams.purchaseId
                });

                return null
            }
            default: {
                return null
            }
        }
    }

    _routeToCreateBillCoupon = () => {
        this.props.navigation.navigate('PurchaseCreateCoupon')
    }

    render() {
        const { app } = this.props;
        const workCard = app.account.contacts.find(t => t.type === 'work');

        if (!workCard) {
            return (
                <Page style={styles.page}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={[commonStyles.container, { flex: 1 }]}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.body}>
                            <Text style={styles.organizationName}>Вы не являетесь кассиром.</Text>
                        </View>

                    </ScrollView>
                </Page>
            )
        }

        const organization = workCard.organization;

        return (
            <Page style={styles.page}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={[commonStyles.container, { flex: 1 }]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{'Создание заказа'}</Text>
                    </View>

                    <View style={styles.body}>
                        <View styles={styles.element}>
                            <View style={styles.elementIconContainer}>
                                <PurchaseTypeCouponIcon/>
                            </View>

                            <TouchableOpacity style={styles.elementButton} onPress={this._routeToCreateBillCoupon}>
                                <Text style={styles.elementButtonText}>Акция</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <Text style={styles.organizationName}>{ organization.name }</Text>
                </View>

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    header: {
        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 40,
        marginBottom: 40
    },
    headerTitle: {
        fontFamily: 'AtypDisplay',
        fontSize: 18,
        lineHeight: 22,
        textAlign: 'center',
        letterSpacing: 1
    },

    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    element: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    elementIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 24
    },
    elementIcon: {},
    elementButton: {
        backgroundColor: '#8152E4',

        borderRadius: 10,

        paddingVertical: 12,
        paddingHorizontal: 24,

        minWidth: 230
    },
    elementButtonText: {
        fontFamily: 'AtypDisplay_medium',
        fontSize: 20,
        lineHeight: 24,
        color: 'white',
        textAlign: 'center'
    },

    organizationName: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 24,
        textAlign: 'center',
        opacity: 0.8
    },

    footer: {
        paddingVertical: 12
    }
})

export default PurchaseHome
