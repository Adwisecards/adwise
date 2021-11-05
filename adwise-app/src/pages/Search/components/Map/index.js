import React, {PureComponent} from "react";
import {
    View,
    Text,
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from "react-native";
import MapView, {
    Marker
} from 'react-native-maps';
import {
    Icon
} from "native-base";
import {
    Location as LocationIcon
} from "../../../../icons";
import LottieView from 'lottie-react-native';
import MapViewDirections from "react-native-maps-directions";
import InformationPoint from "./InformationPoin";
import * as Location from "expo-location";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";
import variables from "../../../../constants/variables";
import {MarkerUser} from "../../../../components";
import * as Linking from "expo-linking";

const {width} = Dimensions.get("window")

class MapSection extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            initialRegion: {
                latitude: 56.838011,
                longitude: 60.597465,
                latitudeDelta: 0.08,
                longitudeDelta: 0.01,
            },
            activePoint: {},
            myLocation: {},
            routeLaid: {},

            isLoadingLocation: true,
            isNotPermission: false
        };

        this.refMap = React.createRef();
    }

    componentDidMount = async () => {
        await this.checkPermission();
    }

    checkPermission = async () => {
        const {status} = await Location.requestPermissionsAsync();

        if (status !== 'granted') {
            this.setState({isNotPermission: true});

            return null
        }

        await this.onMyLocation();
    }

    onBringCloserMap = async () => {
        this.refMap?.current?.getCamera().then((cam) => {
            if (Platform.OS === 'ios') {
                cam.altitude -= (cam.altitude / 100) * 20;
            } else {
                cam.zoom += 1;
            }


            this.refMap?.current?.animateCamera(cam);
        });
    }
    onMoveAwayMap = async () => {
        this.refMap?.current?.getCamera().then((cam) => {
            if (Platform.OS === 'ios') {
                cam.altitude += (cam.altitude / 100) * 20;
            } else {
                cam.zoom -= 1;
            }
            this.refMap?.current?.animateCamera(cam);
        });
    }
    onMyLocation = async () => {
        let initialRegion = {};
        let myLocation = {};
        const location = await Location.getCurrentPositionAsync({});
        initialRegion.latitude = location?.coords?.latitude;
        initialRegion.longitude = location?.coords?.longitude;
        initialRegion.latitudeDelta = this.refMap?.current?.__lastRegion?.latitudeDelta || 0.08;
        initialRegion.longitudeDelta = this.refMap?.current?.__lastRegion?.longitudeDelta || 0.01;

        myLocation.latitude = location?.coords?.latitude;
        myLocation.longitude = location?.coords?.longitude;
        myLocation.latitudeDelta = 0.08;
        myLocation.longitudeDelta = 0.01;

        this.refMap?.current.animateToRegion(initialRegion);
        this.refMap?.current.fitToElements(true);

        this.setState({myLocation, initialRegion, isLoadingLocation: false});
    }
    onGetDirections = async (organization) => {
        this.setState({isLoadingLocation: true});

        let routeLaid = {};
        const location = await Location.getCurrentPositionAsync({})

        routeLaid.origin = {latitude: location?.coords?.latitude || 0, longitude: location?.coords?.longitude || 0};
        routeLaid.destination = {
            latitude: organization?.address?.coords[0],
            longitude: organization?.address?.coords[1]
        };

        this.setState({
            routeLaid,
            activePoint: {},
            isLoadingLocation: false
        })
    }

    onOpenInformation = (activePoint) => {
        this.setState({activePoint});
    }

    _openSettingLocation = async () => {
        if (Platform.OS === 'ios') {
            await Linking.openURL(`app-settings:`);
        } else {
            await Linking.openSettings();
        }
    }
    _routeOrganization = ({_id}) => {
        this.props.navigation.navigate('CompanyPageMain', {
            organizationId: _id
        })
    }
    _getCoordsMarker = (coordinates, skip, index) => {
        const {coordinateMarkers} = this.props;
        let newCoordinates = {...coordinates};

        const isChangePosition = Boolean(coordinateMarkers.find((t) => {
            if (t?.address?.coords[0] === coordinates.latitude && t?.address?.coords[1] === coordinates.longitude && t._id !== skip) {
                return true
            }

            return null
        }));

        if (isChangePosition) {
            newCoordinates.latitude = (newCoordinates.latitude + 0.0008 * Math.cos(2 * Math.PI * index / 10))
            newCoordinates.longitude = (newCoordinates.longitude + 0.0008 * Math.cos(2 * Math.PI * index / 10))
        }

        return newCoordinates
    }

    render() {
        const {
            onTapMarker,
            coordinateMarkers
        } = this.props;
        const {
            routeLaid,
            myLocation,
            activePoint,
            initialRegion,
            isNotPermission,
            isLoadingLocation
        } = this.state;

        if (isNotPermission) {
            return (
                <View style={[styles.root, styles.rootPermission]}>

                    <View style={styles.locationIcon}>
                        <LocationIcon/>
                    </View>

                    <Text style={styles.locationPermissionTitle}>{allTranslations(localization.permissionsTitle)}</Text>
                    <Text
                        style={styles.locationPermissionMessage}>{allTranslations(localization.permissionsLocationMessage)}</Text>

                    <TouchableOpacity style={styles.buttonFilled} onPress={this._openSettingLocation}>
                        <Text
                            style={styles.buttonFilledText}>{allTranslations(localization.contactsButtonOpenSetting)}</Text>
                    </TouchableOpacity>

                </View>
            )
        }

        return (
            <View style={styles.root}>

                <MapView
                    ref={this.refMap}
                    tintColor="#8152E4"
                    style={{flex: 1}}
                    initialRegion={initialRegion}
                    showsUserLocation={false}
                    followsUserLocation={true}
                    loadingEnabled={true}
                >

                    {
                        coordinateMarkers.map((organization, idx) => {
                            const coordinate = this._getCoordsMarker({
                                latitude: organization?.address?.coords[0],
                                longitude: organization?.address?.coords[1]
                            }, organization._id, idx);

                            return (
                                <Marker
                                    key={`marker-shop-${idx}`}
                                    pinColor="red"
                                    coordinate={coordinate}

                                    onPress={() => this.onOpenInformation({...organization, coordinate})}
                                />
                            )
                        })
                    }

                    {
                        Boolean(Object.keys(myLocation).length > 0) && (
                            <MarkerUser
                                coordinate={myLocation}
                            />
                        )
                    }

                    {
                        (Object.keys(routeLaid).length > 0) && (
                            <MapViewDirections
                                origin={routeLaid?.origin}
                                destination={routeLaid?.destination}
                                apikey={variables["google-api-key"]}
                                strokeWidth={3}
                                strokeColor="#8152E4"
                            />
                        )
                    }

                </MapView>

                {(isLoadingLocation) && (
                    <View style={styles.containerLoading}>
                        <View style={{width: 500, height: 500}}>
                            <LottieView
                                source={require('../../../../../assets/lottie/loading/modal_loading.json')}
                                autoPlay
                                loop
                            />
                        </View>
                    </View>
                )}

                <View style={styles.leftAbsolute}>
                    <View>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.onBringCloserMap} style={styles.button}>
                            <Icon name="plus" type="Feather" style={styles.buttonIcon}/>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.onMoveAwayMap} style={styles.button}>
                            <Icon name="minus" type="Feather" style={styles.buttonIcon}/>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.onMyLocation} style={styles.button}>
                            <Icon name="navigation" type="Feather"
                                  style={[styles.buttonIcon, {marginBottom: -4, marginLeft: -4}]}/>
                        </TouchableOpacity>
                    </View>
                </View>


                <InformationPoint
                    isOpen={Object.keys(activePoint).length > 0}

                    logo={activePoint.picture}
                    title={activePoint?.name || ''}
                    description={activePoint?.briefDescription || ''}
                    address={activePoint?.address?.address || ''}

                    onGetDirections={() => this.onGetDirections(activePoint)}
                    onClose={() => this.setState({activePoint: {}})}
                    onClickLogo={() => this._routeOrganization(activePoint)}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        marginHorizontal: 12,
        marginBottom: 12,
        position: "relative",
        backgroundColor: "white",
        borderRadius: 8,
        overflow: "hidden",
        justifyContent: "center",

        flex: 1
    },
    rootPermission: {
        justifyContent: "center",
        alignItems: "center"
    },

    leftAbsolute: {
        flexDirection: "column",
        position: "absolute",
        right: 8,
        zIndex: 50,

        alignItems: "center"
    },

    button: {
        width: 55,
        height: 55,
        borderRadius: 999,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16
    },
    buttonIcon: {
        color: "#8152E4",
        fontSize: 30
    },

    buttonFilled: {
        height: 48,
        paddingHorizontal: 25,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#8152E4"
    },
    buttonFilledText: {
        fontFamily: "AtypText_medium",
        fontSize: 20,
        lineHeight: 22,
        color: 'white'
    },

    locationIcon: {
        width: width * 0.5,
        height: width * 0.5,
        marginBottom: 16
    },
    locationPermissionTitle: {
        fontFamily: "AtypText_medium",
        fontSize: 28,
        lineHeight: 38,
        textAlign: "center",
        color: "black",
        marginBottom: 18
    },
    locationPermissionMessage: {
        marginBottom: 18,

        fontFamily: "AtypText",
        fontSize: 20,
        lineHeight: 26,
        textAlign: "center",
        color: "#808080",
        maxWidth: "80%"
    },

    containerLoading: {
        justifyContent: "center",
        alignItems: "center",

        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        backgroundColor: "rgba(255, 255, 255, 0.9)"
    }
})

export default MapSection
