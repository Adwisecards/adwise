import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Icon
} from 'native-base';
import {
    ArrowLeftCommon as ArrowLeftCommonIcon,
    LineNavigationBottom as LineNavigationBottomIcon
} from "../../../../icons";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const PagesNavigations = (props) => {
    const { active, color, organizationId, isDisable } = props;

    const handleGoBack = () => {
        props.navigation.goBack();
    }
    const handleToPage = (page) => {
        const isCompanyLoading = Boolean(props?.company?.company?._id) || false;

        if (!isCompanyLoading || isDisable){
            return null
        }

        props.navigation.navigate(page, {
            organizationId
        })
    }

    return (
        <View style={styles.container}>

            <View style={styles.left}>
                <TouchableOpacity style={styles.buttonBack} onPress={handleGoBack}>
                    <View style={{ width: 20, height: 20 }}>
                        <ArrowLeftCommonIcon color={color}/>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.right}>

                <TouchableOpacity style={styles.navigation} onPress={() => handleToPage('CompanyPageMain')}>
                    <Text style={[styles.navigationName, (active === 0) && styles.navigationNameActive]}>{allTranslations(localization.companyPagesTabInfo)}</Text>

                    {(active === 0) && (<View style={[styles.lineActiveNavigation, { backgroundColor: color }]}/>)}
                </TouchableOpacity>

                <TouchableOpacity style={styles.navigation} onPress={() => handleToPage('AboutCompany')}>
                    <Text style={[styles.navigationName, (active === 1) && styles.navigationNameActive]}>{allTranslations(localization.companyPagesTabAbout)}</Text>

                    {(active === 1) && (<View style={[styles.lineActiveNavigation, { backgroundColor: color }]}/>)}
                </TouchableOpacity>

                <TouchableOpacity style={styles.navigation} onPress={() => handleToPage('ContactsCompany')}>
                    <Text style={[styles.navigationName, (active === 2) && styles.navigationNameActive]}>{allTranslations(localization.companyPagesTabContacts)}</Text>

                    {(active === 2) && (<View style={[styles.lineActiveNavigation, { backgroundColor: color }]}/>)}
                </TouchableOpacity>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: 'white',
        borderRadius: 10,

        paddingHorizontal: 18,
        paddingVertical: 10,

        marginBottom: 12,

        minHeight: 44
    },

    left: {
        marginRight: 18
    },
    right: {
        flex: 1,

        flexDirection: 'row',
        alignItems: 'center',

        marginLeft: -18,
    },

    buttonBack: {
        justifyContent: 'center',
        alignItems: 'center',

        width: 30,
        height: 30,

        marginVertical: -10,
        marginLeft: -10
    },

    navigation: {
        position: 'relative',
        height: 44,

        marginVertical: -10,
        marginLeft: 18,

        justifyContent: 'center'
    },
    navigationName: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 18,

        textAlign: 'center'
    },
    navigationNameActive: {
        fontFamily: 'AtypText_medium'
    },

    lineActiveNavigation: {
        position: 'absolute',

        height: 3,

        backgroundColor: '#8252E4',

        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,

        left: 0,
        right: 0,
        bottom: 0
    }
});

const styles1 = StyleSheet.create({
    root: {
        flexDirection: 'row',
        alignItems: 'center',

        overflow: 'hidden',

        backgroundColor: 'white',
        borderRadius: 10,

        marginBottom: 12,

        paddingHorizontal: 18,
        paddingVertical: 0
    },

    buttonBack: {
        marginLeft: -18,
        marginVertical: -12,
        paddingVertical: 0,
        paddingHorizontal: 18
    },

    navigations: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1
    },

    navigation: {
        position: 'relative',
        paddingVertical: 14
    },
    navigationActive: {},
    navigationText: {
        fontSize: 16,
        lineHeight: 18,
        fontFamily: 'AtypText',
        opacity: 0.6
    },
    navigationTextActive: {
        opacity: 1,
        fontFamily: 'AtypText_medium'
    },

    lineBottom: {
        position: 'absolute',
        width: '100%',
        height: 10,
        borderRadius: 100,
        bottom: -7
    },
});

export default PagesNavigations
