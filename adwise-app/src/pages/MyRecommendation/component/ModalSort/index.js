import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    Icon
} from "native-base";
import {Modalize} from "react-native-modalize";

const sorter = [
    {
        title: 'Популярные',
        filter: {sortBy: 'clientLength', order: -1}
    },
    {
        title: 'Количество купонов',
        filter: {sortBy: 'couponLength', order: -1}
    },
    {
        title: 'Наименование А - Я',
        filter: {sortBy: 'name', order: 1}
    },
    {
        title: 'Наименование Я - А',
        filter: {sortBy: 'name', order: -1}
    },
    {
        title: 'Максимальный кэшбэк',
        filter: {sortBy: 'cashback', order: -1}
    },
    {
        title: 'Минимальный кэшбэк',
        filter: {sortBy: 'cashback', order: 1}
    },
];

const ModalSort = (props) => {
    const { filter, innerRef, onChangeFilter } = props;

    const handleChangeSort = (props) => {
        props.page = 1;
        onChangeFilter(props, true);
    }

    return (
        <Modalize ref={innerRef} adjustToContentHeight={true}>

            <View style={styles.root}>

                <Text style={styles.title}>Сортировка по:</Text>

                <View style={{marginBottom: -8}}>
                    {
                        sorter.map((item) => {
                            const isActive = Boolean(filter.sortBy === item.filter.sortBy && filter.order === item.filter.order);

                            return (
                                <TouchableOpacity style={[styles.buttonSort, isActive && {color: 'black'}]} onPress={() => handleChangeSort(item.filter)}>
                                    <Text style={styles.buttonSortText}>{item.title}</Text>

                                    {
                                        isActive && (
                                            <Icon name="check" type="Feather" style={{color: '#8152E4', fontSize: 20}}/>
                                        )
                                    }
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>

            </View>

        </Modalize>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: "white",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 24
    },

    title: {
        fontFamily: "AtypText_semibold",
        fontSize: 18,
        lineHeight: 22,
        color: "black",
        marginBottom: 8
    },

    buttonSort: {
        width: '100%',
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    buttonSortText: {
        fontFamily: 'AtypText',
        fontSize: 16,
        color: '#808080'
    },
});

export default ModalSort
