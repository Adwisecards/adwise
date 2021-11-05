import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Icon
} from "native-base";
import {Page} from "../components";
import {
    MapSection as MapSectionComponent,
    InformationPoint as InformationPointComponent
} from "./components";

import * as Location from 'expo-location';
import getHeightStatusBar from "../../../helper/getHeightStatusBar";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

const heightStatusBar = getHeightStatusBar();

class CompanyMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activePoint: {},
            routeLaid: {},

            permission: true
        }
    }

    componentDidMount = async () => {
        await this.onGetDirections();
    }

    onTapMarker = (props) => {
        this.setState({
            activePoint: props
        })
    }
    onGetDirections = async (props) => {
        let routeLaid = {};
        const { company } = this.props;
        const location = await Location.getCurrentPositionAsync({})

        routeLaid.origin = {latitude: location?.coords?.latitude || 0, longitude: location?.coords?.longitude || 0};
        routeLaid.destination = {latitude: company?.address?.coords[0], longitude: company?.address?.coords[1]};

        this.setState({
            activePoint: {},
            routeLaid
        })
    }

    _routeGoBack = () => {
        this.props.navigation.goBack();
    }

    render() {
        const { activePoint, routeLaid, permission } = this.state;
        const { company } = this.props;
        const organizationColor = company?.colors?.primary;
        const coordinateMarkers = [{latitude: company?.address?.coords[0], longitude: company?.address?.coords[1]}];

        return (
            <Page style={styles.page} color={organizationColor}>

                <View style={styles.header}>
                    <TouchableOpacity style={styles.buttonBack} onPress={this._routeGoBack}>
                        <Icon name="arrow-left" type="Feather" style={styles.buttonBackIcon}/>
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>{allTranslations(localization.companyPagesMapTitle)}</Text>
                </View>

                <View style={styles.container}>
                    <MapSectionComponent
                        isRouteLaid={Boolean(Object.keys(routeLaid).length > 0)}
                        routeLaid={routeLaid}

                        company={company}
                        coordinateMarkers={coordinateMarkers}

                        onTapMarker={this.onTapMarker}
                    />

                    <InformationPointComponent
                        isOpen={Object.keys(activePoint).length > 0}

                        logo={company.picture}
                        title={company?.name || ''}
                        description={company?.briefDescription || ''}
                        address={company?.address?.address || ''}

                        onGetDirections={this.onGetDirections}
                        onClose={() => this.setState({activePoint: {}})}
                    />

                </View>

            </Page>
        );
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    container: {
        flex: 1,
        padding: 8
    },

    header: {
        flexDirection: "row",
        alignItems: "center",

        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,

        paddingTop: heightStatusBar + 12,
        paddingHorizontal: 16,
        paddingVertical: 12,

        backgroundColor: 'white'
    },
    headerTitle: {
        fontFamily: "AtypText_medium",
        fontSize: 18,
        lineHeight: 18,
        color: "black"
    },

    buttonBack: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16
    },
    buttonBackIcon: {
        color: "#8152E4"
    },
})

export default CompanyMap
