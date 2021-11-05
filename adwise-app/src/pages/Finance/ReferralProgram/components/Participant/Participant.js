import React, { useState, useEffect } from 'react';
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
import FounderCard from '../Founder/Card';
import axios from "../../../../../plugins/axios";
import urls from "../../../../../constants/urls";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const {width} = Dimensions.get('window');

const Participant = (props) => {
    const [listParticipant, setListParticipant] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        handleLoadParticipant();
    }, []);

    const handleLoadParticipant = () => {
        axios('get', urls["get-other-level-subscriptions"]).then((response) => {
            setListParticipant(response.data.data.subscriptions);
            setIsLoading(false)
        })
    }
    const handleRouteAll = () => {
        props.navigation.navigate('AllUsersReferralProgram', {
            title: allTranslations(localization.financeTitleLevel2_21),
            url: urls["get-other-level-subscriptions"]
        })
    }

    if (isLoading){
        return (
            <View style={styles.root}>
                <View style={styles.header}>
                    <Text style={styles.title}>{allTranslations(localization.financeTitleLevel2_21)}</Text>
                </View>

                <Text style={[styles.title, { fontSize: 15 }]}>{allTranslations(localization.commonLoadingMessage)}</Text>
            </View>
        )
    }
    if (!isLoading && listParticipant.length <= 0){
        return (
            <View style={styles.root}>
                <View style={styles.header}>
                    <Text style={styles.title}>{allTranslations(localization.financeTitleLevel2_21)}</Text>
                </View>

                <Text style={[styles.title, { fontSize: 15 }]}>{allTranslations(localization.commonNotData)}</Text>
            </View>
        )
    }

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.title}>{allTranslations(localization.financeTitleLevel2_21)}</Text>

                <TouchableOpacity style={styles.buttonToAll} onPress={handleRouteAll}>
                    <Icon name={'arrow-right'} type={'Feather'} style={{ color: '#8152E4', fontSize: 20 }}/>
                </TouchableOpacity>
            </View>

            <SafeAreaView style={{flex: 1}}>
                <FlatList
                    contentContainerStyle={{marginLeft: -12}}

                    data={listParticipant}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}

                    numColumns={2}
                    horizontal={false}

                    renderItem={(item) => {
                        return (
                            <View style={{width: ((width - 12) / 2) - 12, marginLeft: 12, marginBottom: 12}}>
                                <FounderCard item={item.item} onPress={null} notMargin/>
                            </View>
                        )
                    }}
                />
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {},

    header: {
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

export default Participant
