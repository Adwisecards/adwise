import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    RoundContainerStubs
} from '../../../../components'
import i18n from 'i18n-js';

const RecommendationCard = (props) => {
    const { navigation, organizationId } = props;

    const color = '#F35647';

    const handleToCompany = () => {
        navigation.navigate('CompanyPageMain')
    }

    return (
        <TouchableOpacity style={styles.root} onPress={handleToCompany}>
            <View style={styles.rootLeft}>
                <View style={[styles.rootLogo, { backgroundColor: color }]}>
                    <RoundContainerStubs
                        styleRoot={{ width: 58, height: 58 }}
                    >
                        <Image
                            style={styles.rootLogoImage}
                            resizeMode='contain'
                            source={{ uri: 'https://s3-alpha-sig.figma.com/img/bd51/711d/6b52da1651be9d8c617072037d9f3cf4?Expires=1602460800&Signature=hUbZZGlzpHkyEn04yQKLx9jDc00DOjyNmOQd6cjClhZRlPD1WyyAD1sWcCaJG85EqzRvShPFO4ID0up4kNGsOQbhYrZ-cdYMlGiqHX0ySTmdVmgpo05qqE-6jnmDBlHB3YfUGK93V8QlU0bDa92M7FTNum92Zrg0ABYq-imSwH-Gxyb~31wwghpNTVgF8bpC2XdW496ZOlVknBoJIbG9Gm0wDSNm8Tmja~-lGigD-Fbupi0lIoceasUMbS3KqFIjn9EQ3icEGTrymij5pB8DfEgjAfwbBemjuV4PBbo~ABKyekrDQ-7dYIuHxurBaIOwHY8DeHX5ETrx1jHTI0PNag__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA' }}
                        />
                    </RoundContainerStubs>
                </View>
                <View style={styles.rootContent}>
                    <Text style={styles.title}>Ресторан Сушкоф</Text>
                    <Text style={styles.description}>Служба доставки японской кухни и фирменной неамериканской пиццы</Text>

                    <View style={[styles.viewInformation, { backgroundColor: color }]}>
                        <Text style={styles.viewInformationTitle}>Ваш бонус</Text>
                        <Text style={styles.viewInformationValue}>+150 баллов за каждый заказ</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        flexDirection: 'row',
        flexShrink: 1,
        marginBottom: 12,
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden'
    },
    rootLeft: {
        flexDirection: 'row',
        flexShrink: 1,
        paddingRight: 4
    },

    rootLogo: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 82,
        minHeight: 50,
        marginRight: 12,
        marginLeft: -12,
        marginVertical: -12
    },
    rootLogoImage: {
        flex: 1,
        width: '100%'
    },
    rootContent: {
        flexShrink: 1
    },

    rootSocials: {
        flexDirection: 'row',
        marginLeft: -8
    },

    title: {
        fontFamily: 'AtypText_semibold',
        fontWeight: '600',
        fontSize: 13,
        lineHeight: 16,
        marginBottom: 4
    },
    description: {
        fontFamily: 'AtypText_medium',
        opacity: 0.5,
        fontSize: 10,
        lineHeight: 13,

        marginBottom: 4
    },

    viewInformation: {
        marginTop: 12,

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4
    },
    viewInformationTitle: {
        fontSize: 8,
        lineHeight: 10,
        color: 'white',
        textTransform: 'uppercase',
        fontFamily: 'AtypText_medium',
        opacity: 0.6,
        marginRight: 6
    },
    viewInformationValue: {
        fontSize: 10,
        lineHeight: 13,
        color: 'white',
        fontFamily: 'AtypText_medium'
    }
});

export default RecommendationCard
