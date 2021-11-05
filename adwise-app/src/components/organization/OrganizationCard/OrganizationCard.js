import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity, ActivityIndicator
} from 'react-native';
import RoundContainerStubs from "../../plugs/RoundContainerStubs/RoundContainerStubs";
import {
    CompanyPageLogo
} from '../../../icons';
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import localization from "../../../localization/localization";
import allTranslations from "../../../localization/allTranslations";

const OrganizationCard = (props) => {
    const {navigation, organizationId, notAjax, followingUserId, organizationInit} = props;
    const [isLoading, setLoading] = useState(true);
    const [organization, setOrganization] = useState({});

    useEffect(() => {
        if (!notAjax) {
            handleLoadOrganization()
        } else {
            setLoading(false)
            setOrganization(organizationInit)
        }
    }, [])

    const handleLoadOrganization = () => {
        axios('get', urls["get-organization"] + organizationId).then((response) => {
            setOrganization(response.data.data.organization)
            setLoading(false)
        })
    }

    const handleToCompany = () => {
        if (!notAjax) {
            navigation.navigate('CompanyPageMain', {
                organizationId,
                followingUserId
            })
        } else {
            navigation.navigate('CompanyPageMain', {
                organizationId: organizationInit._id,
                followingUserId
            })
        }
    }

    if (isLoading) {
        return (
            <View style={styles.root}>
                <View style={styles.rootLeft}>
                    <View style={[styles.rootLogo, {backgroundColor: '#DCDCDC'}]}>
                        <View style={{width: 58, height: 58, borderRadius: 999, backgroundColor: '#cacaca'}}/>
                    </View>
                </View>
                <View style={[{flex: 1}]}>
                    <View style={styles.titleLoading}/>
                    <View style={styles.descriptionLoading}/>

                    <View style={{alignItems: 'flex-start'}}>
                        <View style={[styles.percentInfoLoading, {backgroundColor: '#DCDCDC'}]}/>
                    </View>

                </View>
            </View>
        )
    }

    const color = organization.colors.primary;
    const companyName = organization.name;

    return (
        <TouchableOpacity style={styles.root} onPress={handleToCompany}>
            <View style={styles.rootLeft}>
                <View style={[styles.rootLogo, {backgroundColor: color}]}>
                    <RoundContainerStubs
                        styleRoot={{width: 58, height: 58}}
                    >
                        {
                            (organization.picture) ? (
                                <Image
                                    style={styles.rootLogoImage}
                                    resizeMode='cover'
                                    source={{uri: organization.picture}}
                                />
                            ) : (
                                <CompanyPageLogo color={'#0085FF'}/>
                            )
                        }
                    </RoundContainerStubs>
                </View>
                <View style={styles.rootContent}>
                    <Text style={styles.title}>{companyName}</Text>
                    <Text style={styles.description}>{organization.briefDescription}</Text>

                    <View style={{alignItems: 'flex-start'}}>
                        <View style={[styles.percentInfo, {backgroundColor: color}]}>
                            <Text style={[styles.percentInfoText, {opacity: 0.6, textTransform: 'uppercase', marginRight: 8 }]}>
                                {allTranslations(localization.companyPagesYourCashback)}
                            </Text>
                            <Text style={[styles.percentInfoText, {fontSize: 12}]}>{organization.cashback}%</Text>
                        </View>
                    </View>

                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    root: {
        minHeight: 80,

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
        width: 58,
        height: 58,

        borderRadius: 999
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
    titleLoading: {
        height: 13,
        width: '50%',
        marginBottom: 4,

        borderRadius: 4,
        backgroundColor: '#DCDCDC'
    },
    description: {
        fontFamily: 'AtypText_medium',
        opacity: 0.5,
        fontSize: 10,
        lineHeight: 13,

        marginBottom: 4
    },
    descriptionLoading: {
        height: 10,
        width: '45%',
        opacity: 0.5,

        marginBottom: 4,
        borderRadius: 4,
        backgroundColor: '#DCDCDC'
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
    },

    percentInfo: {
        flexDirection: 'row',
        marginTop: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: '#0085FF'
    },
    percentInfoLoading: {
        height: 17,

        flexDirection: 'row',
        marginTop: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4
    },
    percentInfoText: {
        fontSize: 10,
        lineHeight: 13,
        color: 'white'
    },
});

OrganizationCard.defaultProps = {
    notAjax: false
}

export default OrganizationCard
