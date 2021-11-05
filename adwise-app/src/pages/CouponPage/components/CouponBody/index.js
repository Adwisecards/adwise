import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {getMediaUrl} from "../../../../common/media";
import * as Linking from "expo-linking";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const CouponBody = (props) => {
    const {
        picture,
        couponName,
        couponDescription,
        couponDocument,

        cashbackFirstLevel,
        cashbackOtherLevel
    } = props;

    const [heightPicture, setHeightPicture] = useState(50);

    const handleOpenDocument = async () => {
        await Linking.openURL(couponDocument);
    }

    return (
        <>

            <View style={styles.root}>

                {
                    Boolean( picture ) && (

                        <Image
                            source={{ uri: getMediaUrl(picture) }}
                            style={[styles.couponImage, { height: heightPicture }]}
                            resizeMode="cover"
                            onLoad={({ nativeEvent } ) => setHeightPicture(nativeEvent?.source?.height || 100)}
                        />

                    )
                }

                <Text style={styles.couponName}>{ couponName }</Text>

                <Text style={styles.couponDescription}>{ couponDescription }</Text>

                {
                    Boolean(couponDocument) && (
                        <TouchableOpacity style={styles.buttonDocument} onPress={handleOpenDocument}>
                            <Text style={styles.buttonDocumentText}>{ allTranslations(localization.couponTermsAction) }</Text>
                        </TouchableOpacity>
                    )
                }

            </View>

            <Text style={styles.referalsLevel}>
                { allTranslations(localization.couponCashbackInformation, {
                    cashbackFirstLevel: cashbackFirstLevel,
                    cashbackOtherLevel: cashbackOtherLevel
                }) }
            </Text>

        </>
    )
}

const styles = StyleSheet.create({
    root: {
        borderRadius: 9,
        backgroundColor: 'white',

        padding: 18
    },

    couponImage: {
        width: '100%',
        height: 'auto',
        marginBottom: 20,
        borderRadius: 5
    },

    couponName: {
        fontFamily: 'AtypText_semibold',
        fontSize: 23,
        lineHeight: 28,
        color: 'black',
        marginBottom: 12
    },
    couponDescription: {
        fontFamily: 'AtypText',
        fontSize: 15,
        lineHeight: 19,
        color: 'black'
    },

    buttonDocument: {
        marginTop: 8
    },
    buttonDocumentText: {
        color: '#1184ff',
        fontSize: 15,
        fontFamily: 'AtypText_semibold'
    },

    referalsLevel: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 23,
        color: 'white',
        textAlign: 'center',
        opacity: 0.7,

        marginTop: 16
    }
});

export default CouponBody
