import React, {PureComponent} from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from "react-native";

const {width} = Dimensions.get('window');

class OrganizationCard extends PureComponent {
    render() {
        const { organization, routeOrganization } = this.props;

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}

                onPress={() => routeOrganization(organization._id)}
            >

                <View style={[styles.cardHeader, {backgroundColor: organization.colors.primary}]}>

                    <View style={styles.organizationLogo}>
                        {
                            Boolean(organization?.picture) ? (
                                <Image
                                    source={{uri: organization.picture}}
                                    style={{width: 48, height: 48}}
                                />
                            ) : null
                        }
                    </View>

                    <View>
                        <Text style={styles.organizationCashbackTitle}>Кэшбэк</Text>
                        <Text style={styles.organizationCashbackValue}>{organization?.cashback || 0}%</Text>
                    </View>

                </View>

                <View style={styles.cardBody}>

                    <Text style={styles.organizationName}>{organization?.name}</Text>

                    <Text
                        style={styles.organizationBriefDescription}
                        numberOfLines={4}
                    >{organization?.briefDescription}</Text>

                </View>

            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        width: ((width - 24) / 2) - 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        overflow: 'hidden',
        marginLeft: 12,
        marginBottom: 12
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',

        height: 64,
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    cardBody: {
        paddingVertical: 10,
        paddingHorizontal: 12
    },

    organizationLogo: {
        width: 48,
        height: 48,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginRight: 12,
        overflow: 'hidden',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    organizationCashbackTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 17,
        color: 'white'
    },
    organizationCashbackValue: {
        fontFamily: 'AtypText_semibold',
        fontSize: 20,
        lineHeight: 23,
        color: 'white'
    },

    organizationName: {
        fontFamily: 'AtypText_medium',
        fontSize: 13,
        lineHeight: 16,
        color: '#000000',

        marginBottom: 4
    },
    organizationBriefDescription: {
        fontFamily: 'AtypText_medium',
        fontSize: 10,
        lineHeight: 12,
        color: '#25233E',
        opacity: 0.5
    },
});

export default OrganizationCard
