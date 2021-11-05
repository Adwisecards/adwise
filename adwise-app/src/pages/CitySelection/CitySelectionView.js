import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import {
    Page,
    ModalLoading
} from "../../components";
import getHeightStatusBar from "../../helper/getHeightStatusBar";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";
import {logEvent} from "../../helper/Analytics";

const heightStatusBar = getHeightStatusBar();

class CitySelection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeCity: props?.app?.account?.address?.city || "",

            cities: [],

            isLoading: true,
            isOpenLoading: false
        }
    }

    componentDidMount = () => {
        this.getListCities()
    }

    getListCities = () => {
        axios("get", urls["cities-get-organization-cities"]).then((response) => {
            this.setState({
                cities: response.data.data.organizationCities,
                isLoading: false
            })
        })
    }

    onChangeCity = (activeCity) => {
        this.setState({activeCity});
    }
    onSave = async () => {
        this.setState({isOpenLoading: true});
        const city = this.state.activeCity;

        const response = await axios('put', urls["cities-set-user-city"], {
            city: city
        }).catch((error) => {
            console.log('error: ', error.response)
        });
        const account = await axios('get', urls["get-me"]);

        this.props.updateAccount(account?.data?.data?.user);
        this.props.navigation.goBack();

        await logEvent('user-set-city', {
            city
        });

        this.setState({ isOpenLoading: false });
    }

    render() {
        const {cities, activeCity, isLoading, isOpenLoading} = this.state;

        return (
            <Page style={styles.page}>
                <Text style={styles.title}>{allTranslations(localization.citySelectionTitle)}</Text>
                <Text style={styles.caption}>{allTranslations(localization.citySelectionCaption)}</Text>

                <View style={styles.citiesContainer}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{padding: 8}}
                        showsVerticalScrollIndicator={false}
                    >
                        <TabCity
                            city="Все города"
                            isActive={undefined === activeCity}

                            onChange={() => this.onChangeCity(undefined)}
                        />
                        {
                            cities.map((city, idx) => (
                                <TabCity
                                    key={`city-line-${idx}`}
                                    city={city}
                                    isActive={city === activeCity}

                                    onChange={this.onChangeCity}
                                />
                            ))
                        }
                    </ScrollView>

                    {
                        isLoading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator
                                    size="large"
                                    color="#8152E4"
                                />
                            </View>
                        )
                    }
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.buttonContained} onPress={this.onSave}>
                        <Text style={styles.buttonContainedText}>{allTranslations(localization.citySelectionButtonSave)}</Text>
                    </TouchableOpacity>
                </View>

                <ModalLoading
                    isOpen={isOpenLoading}
                />
            </Page>
        );
    }
}

const TabCity = (props) => {
    const {city, isActive} = props;

    return (
        <TouchableOpacity
            style={[styles.tabCity, isActive && styles.tabCityActive]}
            onPress={() => props.onChange(city)}
        >
            <Text style={[styles.tabCityCity, isActive && styles.tabCityCityActive]}>
                <Text style={{textTransform: "uppercase"}}>{city[0]}</Text>{city.slice(1)}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: heightStatusBar + 32,
        paddingBottom: 16,
    },

    title: {
        fontFamily: "AtypText_medium",
        fontSize: 28,
        lineHeight: 31,
        textAlign: 'center',
        color: "black",

        marginBottom: 16
    },
    caption: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 20,
        textAlign: 'center',
        color: "#000000",

        marginBottom: 40
    },

    citiesContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        flex: 1,
        backgroundColor: 'white',
        marginBottom: 40,
        marginHorizontal: 23
    },

    tabCity: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8
    },
    tabCityActive: {
        backgroundColor: '#f3ecfe',
    },
    tabCityCity: {
        fontFamily: 'AtypText',
        fontSize: 20,
        lineHeight: 28,
        color: '#808080'
    },
    tabCityCityActive: {
        color: "#000000"
    },

    footer: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonContained: {
        height: 50,
        width: 260,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8152E4',
        borderRadius: 10
    },
    buttonContainedText: {
        fontFamily: "AtypText_medium",
        fontSize: 20,
        color: 'white'
    },

    loadingContainer: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        justifyContent: "center",
        alignItems: "center"
    }
})

export default CitySelection
