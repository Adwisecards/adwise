import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
} from "react-native";
import moment from "moment";
import {
    CompanyPageLogo
} from "../../../../../icons";

const HeaderBody = (props) => {
    const {
        logo,
        name,
        color,
        paidAt,
        createdAt,
        completedAt
    } = props;

    return (
        <View style={styles.root}>

            <View style={styles.organization}>
                <View style={styles.organizationLogo}>
                    {
                        Boolean(logo) ? (
                            <Image
                                style={{flex: 1}}
                                source={{uri: logo}}
                            />
                        ) : (
                            <CompanyPageLogo color={color}/>
                        )
                    }
                </View>
                <Text style={styles.organizationName}>{name}</Text>
            </View>

            <View style={styles.times}>
                {
                    createdAt && (
                        <View style={styles.timeRow}>
                            <Text style={styles.timeRowTitle}>Создан</Text>
                            <Text style={styles.timeRowValue}>{moment(createdAt).format('DD.MM.YY HH:mm')}</Text>
                        </View>
                    )
                }

                {
                    paidAt && (
                        <View style={styles.timeRow}>
                            <Text style={styles.timeRowTitle}>Оплачен</Text>
                            <Text style={styles.timeRowValue}>{moment(paidAt).format('DD.MM.YY HH:mm')}</Text>
                        </View>
                    )
                }

                {
                    completedAt && (
                        <View style={styles.timeRow}>
                            <Text style={styles.timeRowTitle}>Завершён</Text>
                            <Text style={styles.timeRowValue}>{moment(completedAt).format('DD.MM.YY HH:mm')}</Text>
                        </View>
                    )
                }
            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24
    },

    organization: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    organizationLogo: {
        width: 42,
        height: 42,
        borderRadius: 999,
        overflow: 'hidden',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#EAEBF0'
    },
    organizationName: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 15,
        color: '#25233E',

        flex: 1,
        marginLeft: 12,
    },

    times: {
        marginLeft: 24,
        marginBottom: -2
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 2
    },
    timeRowTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 8,
        lineHeight: 10,
        color: '#808080'
    },
    timeRowValue: {
        fontFamily: 'AtypText',
        fontSize: 8,
        lineHeight: 10,
        color: '#808080',
        marginLeft: 6
    }
});

export default HeaderBody
