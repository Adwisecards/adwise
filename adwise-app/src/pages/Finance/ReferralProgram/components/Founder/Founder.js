import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    SafeAreaView
} from 'react-native';
import {
    Icon
} from 'native-base';
import FounderCard from './Card';
import axios from "../../../../../plugins/axios";
import urls from "../../../../../constants/urls";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import commonStyles from "../../../../../theme/variables/commonStyles";

const {width} = Dimensions.get('window');

const Founder = (props) => {
    const [listFounder, setListFounder] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            await handleOnLoadFounder();
        })();
    }, []);

    const handleOnLoadFounder = async () => {
        const firstLevelSubscriptions = await axios('get', urls["get-first-level-subscriptions"]).then((response) => {
            return response.data.data.subscriptions
        }).catch((error) => {
            return []
        });
        const otherLevelSubscriptions = await axios('get', urls["get-other-level-subscriptions"]).then((response) => {
            return response.data.data.subscriptions
        }).catch((error) => {
            return []
        });

        setListFounder([...firstLevelSubscriptions, ...otherLevelSubscriptions]);
        setIsLoading(false);
    }
    const handleRouteAll = () => {
        props.navigation.navigate('AllUsersReferralProgram', {
            title: allTranslations(localization.referralProgramFounderTitle),
            urls: [urls["get-first-level-subscriptions"], urls["get-other-level-subscriptions"]],
            itemsClickable: true
        })
    }

    const handleToReferralNetworkMember = ({ organization }, headerTitle) => {
        props.navigation.navigate('ReferralNetwork', {
            organization,
            headerTitle
        });
    }

    if (isLoading){
        return (
            <View style={[styles.root, commonStyles.container]}>
                <View style={styles.header}>
                    <Text style={styles.title}>{ allTranslations(localization.referralProgramFounderTitle) }</Text>
                </View>

                <Text style={[styles.title, { fontSize: 15 }]}>{ allTranslations(localization.commonLoadingMessage) }</Text>
            </View>
        )
    }
    if (!isLoading && listFounder.length <= 0){
        return (
            <View style={[styles.root, commonStyles.container]}>
                <View style={styles.header}>
                    <Text style={styles.title}>{ allTranslations(localization.referralProgramFounderTitle) }</Text>
                </View>

                <Text style={[styles.title, { fontSize: 15 }]}>{ allTranslations(localization.referralProgramFounderNotData) }</Text>
            </View>
        )
    }

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    { allTranslations(localization.referralProgramFounderTitle) }
                </Text>

                <TouchableOpacity style={styles.buttonToAll} onPress={handleRouteAll}>
                    <Icon name={'arrow-right'} type={'Feather'} style={{ color: '#8152E4', fontSize: 20 }}/>
                </TouchableOpacity>
            </View>

            <View style={[commonStyles.container, {marginLeft: -12, flex: 1, flexDirection: "row", flexWrap: "wrap" }]}>
                {
                    listFounder.map((item, idx) => {

                        return (
                            <View key={`founder-card-${ idx }`} style={{width: ((width - 12) / 2) - 12, marginLeft: 12, marginBottom: 12}}>
                                <FounderCard item={item} onPress={(headerTitle) => handleToReferralNetworkMember(item, headerTitle)} notMargin clickable/>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },

    header: {
        marginHorizontal: 15,
        marginBottom: 8,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    title: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 18,
    },

    buttonToAll: {
        margin: -8,
        padding: 8
    },
});

export default Founder
