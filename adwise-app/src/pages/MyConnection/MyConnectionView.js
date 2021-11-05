import React, {Component} from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SectionList,
    SafeAreaView,
    FlatList,
    Dimensions, Platform
} from 'react-native';
import {Header} from "../Dashboard/components";
import commonStyles from "../../theme/variables/commonStyles";
import {
    HeaderControlsButtons,
    LoginHeader,
    Page,
    RefreshControl,
    MyConnectionCard, ModalPersonal, ModalUsers
} from "../../components";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import getHeightStatusBar from "../../helper/getHeightStatusBar";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const {width} = Dimensions.get('window');
const heightStatusBar = getHeightStatusBar();

class MyConnection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contactModal: null,

            listConnections: [],

            isUpdateConnection: true,
            openModalContacts: false
        };

        this.refFlatSection = React.createRef();
    }

    componentDidMount = () => {
        this.initMyConnection();
    }

    initMyConnection = () => {
        let activeCutaway = this.props.app.activeCutaway;
        let contacts = this.props.app.account.contacts[0]._id;

        let activeId = (activeCutaway) ? activeCutaway : contacts;

        axios('get', urls["get-contact"] + activeId).then((response) => {
            let contact = response.data.data.contact.contacts;

            this.setState({
                listConnections: contact,
                isUpdateConnection: false
            })
        })
    }

    onUpdateConnection = () => {
        this.setState({
            isUpdateConnection: true
        }, () => {
            this.initMyConnection()
        })
    }

    onOpenShare = (props) => {
        this.props.navigation.navigate('CutawayUserInformation', {
            id: props._id
        })
    }

    render() {
        return (
            <Page style={styles.page}>
                <Header navigation={this.props.navigation}/>

                <View style={[commonStyles.container, {flex: 1}]}>
                    <LoginHeader
                        title={allTranslations(localization.dashboardConnectionsTitle)}
                        linkGoBack={'Dashboard'}
                        isShowButtonBack {...this.props}
                        styleRoot={{marginBottom: 20, paddingHorizontal: 0, marginTop: 0}}
                    />

                    <SafeAreaView style={{flex: 1}}>
                        <FlatList
                            ref={this.refFlatSection}

                            contentContainerStyle={{marginLeft: -12}}

                            data={this.state.listConnections}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}

                            onScrollToIndexFailed={(err) => console.log(err)}
                            numColumns={2}
                            horizontal={false}

                            renderItem={(item) => {
                                return (
                                    <View style={{width: ((width - 12) / 2) - 12, marginLeft: 12, marginBottom: 12}}>
                                        <MyConnectionCard contactId={item.item} onPress={this.onOpenShare} notMargin/>
                                    </View>
                                )
                            }}

                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isUpdateConnection}
                                    onRefresh={this.onUpdateConnection}
                                />
                            }
                        />
                    </SafeAreaView>
                </View>
            </Page>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerShow: false
        };
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})

export default MyConnection
