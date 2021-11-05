import React, { useState, useEffect } from "react";
import {
    View,

    Text,

    Image,

    StyleSheet,

    TouchableOpacity
} from 'react-native';
import axios from "../../../../plugins/axios";
import urls from "../../../../constants/urls";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const CardUser = (props) => {
    const { subscriberId, organization } = props;
    const [ subscriber, setSubscriber ] = useState({});
    const [ isLoading, setLoading ] = useState(true);
    const [ isError, setError ] = useState(true);

    useEffect(() => {
        handleOnLoadSubscriber()
    }, []);

    const handleOnLoadSubscriber = () => {
        axios('get', `${ urls["get-user"] }${ subscriberId }`).then((response) => {
            setLoading(false);
            setError(false);
            setSubscriber(response.data.data.user);
        }).catch((error) => {

        });
    }

    if (isError) {
        return null
    }
    if (isLoading){
        return null
    }

    const cashbackPercent = organization.distributionSchema.first;

    return (
        <TouchableOpacity style={styles.card}>

            <View style={styles.cardLeft}>
                <Image style={{ flex: 1 }} source={{ uri: subscriber.picture }}/>
            </View>

            <View style={styles.cardRight}>

                <Text style={styles.cardTitle}>{ `${ subscriber.firstName }\n${ subscriber.lastName }` }</Text>

                <Text style={styles.cardPercentTitle}>{allTranslations(localization.financePercent)}</Text>

                <Text style={styles.cardPercentValue}>{ cashbackPercent }%</Text>

            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        overflow: 'hidden',

        flexDirection: 'row',

        backgroundColor: 'white',

        borderRadius: 10,
    },
    cardLeft: {
        width: 55,
    },
    cardRight: {
        padding: 8
    },

    cardTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 13,
        lineHeight: 14,

        marginBottom: 8
    },
    cardPercentTitle: {
        fontSize: 10,
        lineHeight: 10,
        opacity: 0.5
    },
    cardPercentValue: {
        fontSize: 18,
        lineHeight: 22,
        opacity: 0.5
    },
})

export default CardUser
