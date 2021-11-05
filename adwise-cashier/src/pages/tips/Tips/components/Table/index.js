import React from "react";
import {
    View,
    Text,
    StyleSheet, TouchableOpacity,
} from "react-native";
import moment from "moment";

const Table = (props) => {
    const { tips, isShowButtonMore, filter, onLoadMore } = props;

    return (
        <View>

            <View style={styles.root}>

                {
                    Boolean(tips.length <= 0) && (
                        <Text style={styles.textEmpty}>Чаевые не найдены</Text>
                    )
                }

                {
                    tips.map((tip, idx) => {
                        const isLast = Boolean(idx === tips.length - 1);

                        return (
                            <View>
                                <View style={styles.row}>
                                    <View style={styles.rowDate}>
                                        <Text style={styles.rowDateText}>{ moment(tip.timestamp).format('DD.MM.YYYY') }</Text>
                                    </View>

                                    <View style={styles.rowRight}>
                                        <Text style={styles.rowName}>Чаевые</Text>
                                        <Text style={styles.rowSum}>+{ tip.sum } ₽</Text>
                                    </View>

                                </View>

                                {
                                    !isLast && (
                                        <View style={styles.separate}></View>
                                    )
                                }
                            </View>
                        )
                    })
                }

            </View>

            <View>
                {
                    isShowButtonMore && (
                        <TouchableOpacity style={styles.buttonLoadMore} onPress={onLoadMore}>
                            <Text style={styles.buttonLoadMoreText}>Загрузить еще</Text>
                        </TouchableOpacity>
                    )
                }
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,

        paddingVertical: 5,
        paddingHorizontal: 12,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 12

    },
    rowDate: {
        width: 80,
        marginRight: 6
    },
    rowDateText: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 14
    },
    rowRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowName: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 15
    },
    rowSum: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 18,
        color: '#ED8E00'
    },

    separate: {
        width: '100%',
        height: 1,
        backgroundColor: '#E8E8E8'
    },

    buttonLoadMore: {
        width: '100%',
        height: 50,
        backgroundColor: '#8152E4',
        borderRadius: 6,

        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 18
    },
    buttonLoadMoreText: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 18,
        color: 'white'
    },
    textEmpty: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 24,
        color: 'black',
        textAlign: "center",
        marginVertical: 12
    }
});

export default Table
