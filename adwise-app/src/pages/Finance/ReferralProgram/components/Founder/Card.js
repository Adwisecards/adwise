import React, {useEffect, useState} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    CompanyPageLogo,
    CompanyPageBackground
} from '../../../../../icons';
import {
    RoundContainerStubs
} from '../../../../../components';
import axios from "../../../../../plugins/axios";
import urls from "../../../../../constants/urls";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const FounderCard = (props) => {
    const { clickable } = props;
    const [organization, setOrganization] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (Object && Object.keys(props.item).length > 0) {
            handleLoadOrganization(props.item.organization)
        }
    }, [props.item]);

    const handleLoadOrganization = (organizationId) => {
        axios('get', `${urls["get-organization"]}${organizationId}`).then((response) => {
            setOrganization(response.data.data.organization);
            setLoading(false);
        })
    }
    const handleOnPress = () => {
        props.onPress(organization.name)
    }

    const color = (organization && organization.colors) ? organization.colors.primary : '#5FB008';

    if (isLoading) {
        return (
            <View style={[styles.card]}>
                <View style={styles.cardLeft}>
                    <View style={styles.cardLeftPugContent}>
                        <View style={[styles.cardLeftPug, { backgroundColor: "#8152e4" }]}/>

                        <View style={[styles.cardLeftLogo, { backgroundColor: '#DCDCDC' }]}/>
                    </View>
                </View>
                <View style={styles.cardRight}>
                    <View style={styles.loadingCompanyName}/>

                    <View style={styles.cardFooter}>
                        <View style={styles.loadingTotalPercentage}/>
                        <View style={styles.loadingCountPercentage}/>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={clickable ? 0.2 : 1}
            onPress={clickable ? handleOnPress : null}
        >
            <View style={styles.cardLeft}>
                <View style={styles.cardLeftPugContent}>
                    <View style={[styles.cardLeftPug, { backgroundColor: color }]}/>

                    {
                        organization.picture ? (
                            <Image source={{uri: organization.picture}} style={styles.cardLeftLogo} resizeMode="cover"/>
                        ) : (
                            <CompanyPageLogo color={color}/>
                        )
                    }
                </View>
            </View>
            <View style={styles.cardRight}>
                <Text
                    style={styles.typographyCompanyName}
                    numberOfLines={2}
                >{ organization.name }</Text>

                <View style={styles.cardFooter}>
                    <Text style={styles.typographyTotalPercentage}>{ allTranslations(localization.referralProgramFounderFounderCardTotalPercentage) }</Text>
                    <Text style={[styles.typographyCountPercentage, {color: color}]}>{`${ organization.cashback }%`}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',

        flexDirection: 'row',

        minHeight: 70
    },
    cardLeft: {
        width: '30%'
    },
    cardRight: {
        flex: 1,
        padding: 8
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginTop: 'auto'
    },

    cardLeftPugContent: {
        justifyContent: 'center',
        alignItems: 'center',

        position: 'relative',
        flex: 1,
        paddingHorizontal: 8
    },
    cardLeftPug: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,

        width: 'auto',
        height: 'auto',
    },
    cardLeftLogo: {
        width: 40,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 999,
        overflow: 'hidden',

        justifyContent: 'center',
        alignItems: 'center'
    },

    typographyCompanyName: {
        fontFamily: 'AtypText_semibold',
        fontSize: 13,
        lineHeight: 14,

        marginBottom: 8
    },
    loadingCompanyName: {
        height: 16,
        width: '60%',
        backgroundColor: '#DCDCDC',
        borderRadius: 4,

        marginBottom: 8
    },
    typographyTotalPercentage: {
        fontFamily: 'AtypText_medium',
        fontSize: 10,
        lineHeight: 10,
        opacity: 0.5,

        marginRight: 4
    },
    loadingTotalPercentage: {
        height: 10,
        width: '50%',
        backgroundColor: '#DCDCDC',
        borderRadius: 4,
        opacity: 0.5,

        marginRight: 4
    },
    typographyCountPercentage: {
        fontFamily: 'AtypText_semibold',
        fontSize: 18,
        lineHeight: 24,

        flex: 1,
        textAlign: 'right'
    },
    loadingCountPercentage: {
        height: 18,
        width: '30%',
        backgroundColor: '#DCDCDC',
        borderRadius: 4,
        opacity: 0.5,
    },
    typography: {},
});

export default FounderCard
