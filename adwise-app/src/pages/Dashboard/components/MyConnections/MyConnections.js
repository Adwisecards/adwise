import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import {Icon} from "native-base";
import {
    ModalUsers,
    MyConnectionCard
} from '../../../../components';

import i18n from 'i18n-js';
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const { width } = Dimensions.get('window');

const widthCard = ((width - 12) / 2);

const MyConnections = (props) => {
    const {hideTitle, list, navigation} = props;
    const [dataOpenCard, setDataOpenCard] = useState(null);

    const handleOpenCard = (props) => {
        navigation.navigate('CutawayUserInformation', {
            id: props._id
        })
    }

    const handleToMyConnection = () => {
        navigation.navigate('MyConnection')
    }

    if (list.length < 1) {
        return (
            <View style={styles.root}>
                <View style={styles.rootTop}>
                    <Text style={styles.rootTitle}>{allTranslations(localization.dashboardConnectionsTitle)} <Text style={{ color: '#8152E4' }}>{list.length}</Text></Text>
                </View>

                <Text style={styles.notData}>{allTranslations(localization.dashboardConnectionsEmpty)}</Text>
            </View>
        )
    }

    let gridList = [...list].slice(0, 4);

    return (
        <View style={styles.root}>
            {
                (!hideTitle) && (
                    <TouchableOpacity onPress={handleToMyConnection} style={styles.rootTop}>
                        <Text style={styles.rootTitle}>{allTranslations(localization.dashboardConnectionsTitle)} <Text style={{ color: '#8152E4' }}>{list.length}</Text></Text>

                        <View style={styles.buttonGo} onPress={handleToMyConnection}>
                            <Icon type={'Feather'} name={'arrow-right'} style={{color: '#8152E4'}}/>
                        </View>
                    </TouchableOpacity>
                )
            }

            <View style={styles.grid}>
                {
                    gridList.map((contact, idx) => (
                        <View key={`contact-${ idx }`} style={[styles.card, {width: widthCard}]}>
                            <MyConnectionCard contactId={contact} onPress={handleOpenCard}/>
                        </View>
                    ))
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {},
    rootTop: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    rootTitle: {
        fontSize: 18,
        lineHeight: 25,
        fontFamily: 'AtypText',
        color: '#000000'
    },

    buttonGo: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        marginRight: -4
    },
    buttonGoIcon: {
        flex: 1
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: -12
    },
    card: {
        marginBottom: 12
    },

    notData: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 26,
        color: '#808080'
    },
});

export default MyConnections
