import React, {PureComponent} from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity, Platform
} from "react-native";
import MapView, {
    Marker,
    PROVIDER_GOOGLE
} from 'react-native-maps';
import {
    Icon
} from "native-base";
import {
    Location as LocationIcon
} from "../../../../../icons";
import LottieView from 'lottie-react-native';
import * as IntentLauncher from "expo-intent-launcher";
import MapViewDirections from "react-native-maps-directions";
import variables from "../../../../../constants/variables";
import * as Location from "expo-location";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import {MarkerUser} from "../../../../../components";

const { width } = Dimensions.get("window")

class MapSection extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            myLocation: {},
            initialRegion: {},

            isLoadingLocation: true,
            isNotPermission: false,
            isMapReady: false,
            isInitial: true
        };

        this.refMap = React.createRef();
    }

    componentDidMount = async () => {
        await this.checkPermission();
    }
    componentDidUpdate = () => {
        const { routeLaid } = this.props;
        const { isInitial, myLocation, isMapReady } = this.state;

        if (Object.keys(routeLaid).length > 0 && Object.keys(myLocation).length > 0 && isMapReady && isInitial) {
            this.refMap.current.fitToElements(true);
            this.setState({isInitial: false})
        }
    }

    checkPermission = async () => {
        const { status } = await Location.requestPermissionsAsync();

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
        let myLocation = {};
        const location = await Location.getCurrentPositionAsync({});
        const initialRegion = {
            latitude: location?.coords?.latitude,
            longitude: location?.coords?.longitude,
            latitudeDelta: this.refMap?.current?.__lastRegion?.latitudeDelta || 0.08,
            longitudeDelta: this.refMap?.current?.__lastRegion?.longitudeDelta || 0.01,
        };

        myLocation.latitude = location?.coords?.latitude;
        myLocation.longitude = location?.coords?.longitude;
        myLocation.latitudeDelta = 0.08;
        myLocation.longitudeDelta = 0.01;

        this.setState({
            myLocation,
            initialRegion,
            isLoadingLocation: false
        });
    }

    _openSettingLocation = () => {
        IntentLauncher.startActivityAsync(IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS);
    }

    onUserLocationChange = (myLocation) => {
        this.setState({myLocation})
    }

    render() {
        const {
            isRouteLaid,
            company,
            coordinateMarkers,
            routeLaid,

            onTapMarker
        } = this.props;
        const {
            myLocation,
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
                    <Text style={styles.locationPermissionMessage}>{allTranslations(localization.permissionsLocationMessage)}</Text>

                    <TouchableOpacity style={styles.buttonFilled} onPress={this._openSettingLocation}>
                        <Text style={styles.buttonFilledText}>{allTranslations(localization.contactsButtonOpenSetting)}</Text>
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

                    onUserLocationChange={this.onUserLocationChange}
                    onMapReady={() => this.setState({isMapReady: true})}
                >

                    {
                        Boolean(Object.keys(myLocation).length > 0) && (
                            <MarkerUser
                                coordinate={myLocation}
                            />
                        )
                    }

                    {
                        coordinateMarkers.map((coordinate, idx) => (
                            <Marker
                                key={`marker-shop-${idx}`}
                                pinColor="red"
                                coordinate={coordinate}

                                onPress={(coordinate) => onTapMarker(coordinate)}
                            />
                        ))
                    }

                    {
                        isRouteLaid && (
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
                                source={require('../../../../../../assets/lottie/organization/map-loading-location.json')}
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
                            <Icon name="navigation" type="Feather" style={[styles.buttonIcon, {marginBottom: -4, marginLeft: -4}]}/>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
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
