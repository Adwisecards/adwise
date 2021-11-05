import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    FlatList,
    SafeAreaView
} from 'react-native';
import {
    Page,
    Input,
    LoginHeader,
    ModalLoading
} from '../../components'
import {
    Icon
} from 'native-base';
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location';
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import {setItemAsync} from "../../helper/SecureStore";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const LoadingCitySearch = (props) => {
    return (
        <View style={styles.loadingCitySearch}></View>
    )
}

class SelectedCity extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchValue: '',

            loginHeaderParams: {},

            listCities: [],

            isLoadingMyPosition: false,
            isLoadingSearch: false
        }

        this.performanceSearch = null;
    }

    componentDidMount = () => {
        this.updateHeaderParams()
        this.onUpdateStatusBar()

        this.props.navigation.addListener('didFocus', () => {
            this.updateHeaderParams()
            this.onUpdateStatusBar()
        });
        this.props.navigation.addListener('willFocus', () => {
            this.onUpdateStatusBarDefault()
        });
    }
    onUpdateStatusBar = () => {
        StatusBar.setBackgroundColor('rgba(255, 255, 255, 0)');
        StatusBar.setBarStyle('dark-content', false);
        StatusBar.setTranslucent(true);
    }
    onUpdateStatusBarDefault = () => {
        StatusBar.setBackgroundColor('rgba(255, 255, 255, 0)');
        StatusBar.setBarStyle('dark-content', false);
        StatusBar.setTranslucent(true);
    }

    updateHeaderParams = () => {
    }

    onSearch = async () => {
        if (this.state.searchValue.length < 3 ){
            return null
        }


        let url = `${ urls["get-address-suggestions"] }?search=${ this.state.searchValue }`;
        const response = await axios('get', url).then(res => { return res.data.data.addressSuggestions });

        this.setState({
            listCities: response,
            isLoadingSearch: false
        })
    }
    onGetAddressFromLocation = async () => {
        const myLocation = await this.onMyPosition();

        if (!myLocation){
            return null
        }

        let coords = {
            lat: myLocation.coords.latitude,
            lon: myLocation.coords.longitude
        }
        let url = `${ urls["get-address-from-coords"] }?lat=${ coords.lat }&long=${ coords.lon }`;

        const address = await axios('get', url).then((response) => { return response.data.data.address });

        this.setState({
            listCities: [address],
            isLoadingSearch: false
        })
    }

    onSelectCity = async (city) => {
        await setItemAsync('current_city', city);
        this.props.updateCurrentCity(city);
        this.props.navigation.goBack();
    }

    onMyPosition = async () => {
        this.setState({isLoadingMyPosition: true})

        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({isLoadingMyPosition: false})
            return null
        }

        let location = await Location.getCurrentPositionAsync({}).then(res => {
            return res
        }).catch(error => {
            return null
        });

        this.setState({
            isLoadingMyPosition: false
        })

        return location
    }

    onChangeParamsSearch = ( searchValue ) => {
        this.setState({ searchValue }, async () => {
            clearTimeout(this.performanceSearch);

            this.performanceSearch = setTimeout(async () => {
                this.setState({ isLoadingSearch: true })
                await this.onSearch()
            }, 1000)
        })
    }

    _renderFlatItem = ({item}) => {
        return (
            <ItemFlatList
                item={item}
                onPress={this.onSelectCity}
            />
        )
    }

    render() {
        return (
            <Page>
                <LoginHeader
                    isShowButtonBack={true}
                    title={allTranslations(localization.selectedCityTitle)}
                    linkGoBack={'Dashboard'}

                    {...this.props}
                />

                <View style={styles.rootContainer}>
                    <View style={styles.inputSearchContainer}>
                        <Input
                            value={this.state.searchValue}
                            styleInput={styles.inputSearch}
                            stylePlaceholder={{textAlign: 'center'}}
                            placeholder={allTranslations(localization.selectedCityPlaceholder)}

                            onChangeText={this.onChangeParamsSearch}
                        />
                    </View>

                    <TouchableOpacity style={styles.myPositionContainer} onPress={this.onGetAddressFromLocation}>
                        <Icon name={'room'} type={'MaterialIcons'} style={{color: '#ED8E00'}}/>
                        <Text style={styles.myPositionTitle}>Моё местоположение</Text>
                    </TouchableOpacity>

                    <SafeAreaView style={styles.safeAreaView}>
                        <FlatList
                            data={this.state.listCities}
                            renderItem={this._renderFlatItem}
                            keyExtractor={(item, idx) => `${item.id}-${idx}`}


                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        />
                    </SafeAreaView>
                </View>

                <ModalLoading
                    isOpen={this.state.isLoadingMyPosition}
                />
            </Page>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        };
    };
}

const ItemFlatList = (props) => {
    const {item, onPress} = props;
    return (
        <TouchableOpacity style={styles.itemFlatList} onPress={() => onPress(item)}>
            <Text style={styles.itemFlatListText}>{item.addressString}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    rootContainer: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 20
    },

    inputSearchContainer: {
        width: '100%',
        height: 50,
        marginBottom: 24
    },
    inputSearch: {
        width: '100%',
        height: 50,
        paddingLeft: 16,
        paddingRight: 16,
    },

    loadingCitySearch: {
        width: 50,
        height: 50
    },

    myPositionContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 30
    },
    myPositionTitle: {
        fontSize: 18,
        lineHeight: 20,
        fontFamily: 'AtypText',
        marginLeft: 6
    },

    itemFlatList: {
        marginBottom: 16
    },
    itemFlatListText: {
        fontSize: 16,
        lineHeight: 23,
        fontFamily: 'AtypText_medium'
    },

    safeAreaView: {
        flex: 1,
        marginTop: 0
    }
})

export default SelectedCity
