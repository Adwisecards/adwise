import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
} from "react-native";
import {
    CompanyPageLogo as CompanyPageLogoIcon
} from "../../../../icons";
import {getMediaUrl} from "../../../../common/media";

const OrganizationHeader = (props) => {
    const {
        organizationName,
        organizationColor,
        organizationPicture,
    } = props;

    return (
        <View style={styles.root}>

            <View style={[styles.organizationLogo, Boolean(organizationPicture) && styles.organizationLogoFull]}>

                {

                    Boolean(organizationPicture) ? (

                        <Image
                            style={styles.organizationLogoImage}
                            source={{ uri: getMediaUrl(organizationPicture) }}
                            resizeMode="contain"
                        />

                    ) : (
                        <CompanyPageLogoIcon color={organizationColor}/>
                    )

                }

            </View>

            <Text style={styles.organizationName}>{ organizationName }</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },

    organizationLogo: {
        width: 74,
        height: 74,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    organizationLogoFull: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        backgroundColor: 'white',
        borderRadius: 999,
        overflow: 'hidden',
    },
    organizationLogoImage: {
        width: 80,
        height: 80
    },

    organizationName: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: 'white',
        flex: 1
    }
});

export default OrganizationHeader
