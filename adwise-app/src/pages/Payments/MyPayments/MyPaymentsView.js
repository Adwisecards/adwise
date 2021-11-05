import React, {Component} from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import {
    Page,
    ModalLoading,
    DropDownHolder,
    FormSendingTips,
    ModalSelectFriend
} from "../../../components";
import {
    Header as HeaderComponent,
    Filter as FilterComponent,
    ListPurchases as ListPurchasesComponent,
    DialogUpdatePurchases as DialogUpdatePurchasesComponent
} from "./components";
import moment from "moment";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import {getPageFromCount} from "../../../common/pagination";
import WS from "react-native-websocket";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import * as Linking from "expo-linking";
import getError from "../../../helper/getErrors";

class MyPayments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            purchases: [],

            filter: {
                page: 1,
                limit: 20,

                type: [],
                dateFrom: "",
                dateTo: "",
                organizationName: "",
            },
            pagination: {
                pages: 0
            },
            tipsPurchase: {},
            sendPurchase: {},

            isLoading: true,
            isRefreshing: false,
            isOpenFilter: false,
            isModalLoading: false,
            isOpenFormSendingTips: false
        };

        this.refModalSelectFriend = React.createRef();
        this.refDialogUpdatePurchasesComponent = React.createRef();
    }

    componentDidMount = async () => {
        await this.getPurchases();
    }

    // Логика получения покупок
    getPurchases = async (isMore = false) => {

        this.setState({isLoading: true});

        const filter = this.getFilter();
        const purchasesOld = [...this.state.purchases];

        const {
            purchases: purchasesNew,
            count,
            error
        } = await axios('get', `${urls["get-user-purchases"]}${filter}`).then((response) => {
            return response.data.data
        }).catch((error) => {
            return {
                error: true
            }
        });

        if (error) {


            return null
        }

        let purchases = [];
        let pagination = {...this.state.pagination};
        pagination.pages = getPageFromCount(count, this.state.filter.limit);

        if (isMore) {
            purchases.push(...purchasesOld);
        }

        this.setState({
            purchases: [...purchases, ...purchasesNew],
            pagination,
            isLoading: false,
            isRefreshing: false,
        });

    }
    onRefresh = async () => {
        let filter = {...this.state.filter};
        filter.page = 1;

        this.setState({filter, isRefreshing: true}, async () => {
            await this.getPurchases();

            this.refDialogUpdatePurchasesComponent.current?.close();
        });
    }
    getFilter = () => {
        let filter = [];

        Object.keys(this.state.filter).map((key) => {
            let value = this.state.filter[key];

            if (
                !!value &&
                key !== 'type' &&
                key !== 'dateFrom' &&
                key !== 'dateTo'
            ) {
                filter.push(`${key}=${value}`);
            }

            if (
                key === 'type' &&
                value.length > 0
            ) {
                value.map((value) => {
                    filter.push(`types[]=${value}`)
                })
            }

            if (
                !!value && Boolean(
                key === 'dateFrom' ||
                key === 'dateTo'
                )
            ) {
                filter.push(`${key}=${moment(value).format('YYYY-MM-DD')}`);
            }


        })

        return `?${filter.join('&')}`
    }

    // Логика изменения фильтра
    onChangeFilter = (filter, isMore = false) => {
        let purchases = [...this.state.purchases];

        this.setState({
            filter,
            isLoading: true,
            purchases: isMore ? purchases : []
        }, async () => {
            await this.getPurchases(isMore);
        })
    }

    // Логика добавление в архив
    onAddArchive = async (purchase) => {
        this.setState({isModalLoading: true});

        const response = await axios('put', `${urls["set-purchase-archived"]}/${purchase._id}`, {
            archived: true
        }).then((response) => {
            return true
        }).catch((error) => {
            return null
        })

        this.setState({isModalLoading: false});

        if (!response) {
            DropDownHolder.alert('error', 'Системное уведомление', 'Невозможно добавить покупку в архив')

            return null
        }

        DropDownHolder.alert('success', 'Системное уведомление', 'Вы успешно заархивировали покупку');

        await this.onRefresh();
    }

    // Логика оставление чаевых
    onSendTips = async (body) => {

        this.setState({isModalLoading: true});

        body.userId = this.props.app.account._id;

        const response = await axios('post', urls["tips-send-tips"], body).then((response) => {
            return response.data.data.payment
        }).catch((error) => {
            return null
        });

        if (!response) {
            this.setState({isModalLoading: false, tipsPurchase: {}});

            DropDownHolder.alert('error', allTranslations(localization.notificationTitleSystemNotification), allTranslations(localization.paymentsNotificationsTipsError));

            return null
        }

        this.setState({isModalLoading: false, tipsPurchase: {}});

        await Linking.openURL(response.paymentUrl);
    }
    onOpenSendTips = (tipsPurchase) => {
        this.setState({
            tipsPurchase
        })
    }

    // Логика дарения купона
    onGiveCoupon = async (purchase, contact) => {

        if (!contact) {
            this.setState({
                sendPurchase: purchase
            });

            this.refModalSelectFriend.current?.open();

            return null
        }

        this.setState({isModalLoading: true});

        this.refModalSelectFriend.current?.close();

        const body = {
            purchaseId: purchase._id,
            receiverContactId: contact
        };
        const response = await axios('put', urls["finance-share-purchase"], body).then((response) => {
            return true
        }).catch((error) => {
            const errorBody = getError(error.response);
            DropDownHolder.alert('error', errorBody.title, errorBody.message);

            return null
        })

        this.setState({isModalLoading: false});

        if (!response) {
            return null
        }

        DropDownHolder.alert('success', 'Успешно', 'Покупка успешно отправлена')

        await this.onRefresh();
    }

    _openUpdatePage = () => {
        const isFocus = this.props.navigation?.isFocused();

        if (!isFocus) {
            return null
        }

        this.refDialogUpdatePurchasesComponent.current?.open();
    }

    render() {
        const {
            filter,
            purchases,
            isLoading,
            isRefreshing,
            pagination,
            isOpenFilter,
            tipsPurchase,
            sendPurchase,
            isModalLoading
        } = this.state;

        return (
            <Page style={styles.page}>

                <HeaderComponent
                    title="Мои заказы"
                />

                <FilterComponent
                    filter={filter}
                    onChange={this.onChangeFilter}
                    onChangeOpen={(isOpenFilter) => this.setState({isOpenFilter})}
                />

                <View pointerEvents={isOpenFilter ? 'none' : 'auto'} style={{flex: 1}}>
                    <ListPurchasesComponent
                        purchases={purchases}
                        isRefreshing={isRefreshing}
                        onRefresh={this.onRefresh}
                        isLoading={isLoading}
                        filter={filter}
                        pagination={pagination}
                        onChangeFilter={this.onChangeFilter}

                        navigation={this.props.navigation}
                        onSendTips={this.onOpenSendTips}
                        onAddArchive={this.onAddArchive}
                        onGiveCoupon={this.onGiveCoupon}
                    />
                </View>

                <FormSendingTips
                    isOpen={Object.keys(tipsPurchase).length > 0}
                    purchase={tipsPurchase}

                    onClose={() => this.setState({tipsPurchase: {}})}
                    onSendTips={this.onSendTips}
                />

                <ModalLoading
                    isOpen={isModalLoading}
                />

                <ModalSelectFriend
                    initialRef={this.refModalSelectFriend}
                    onSend={(contactId) => this.onGiveCoupon(sendPurchase, contactId)}
                />

                <DialogUpdatePurchasesComponent
                    innerRef={this.refDialogUpdatePurchasesComponent}
                    onUpdate={this.onRefresh}
                />

                <WS
                    ref={ref => { this.webSocket = ref }}
                    url={`${urls["web-socket"]}${this.props.app.account._id}`}
                    onMessage={(event) => {
                        const messages = JSON.parse(event.data);

                        if (
                            messages.type === 'purchaseCreated' ||
                            messages.type === 'purchaseConfirmed' ||
                            messages.type === 'purchaseCompleted'
                        ) {
                            this._openUpdatePage();
                        }
                    }}
                    reconnect
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

export default MyPayments
