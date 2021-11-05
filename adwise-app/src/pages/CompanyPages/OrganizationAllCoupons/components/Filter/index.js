import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    Icon
} from "native-base";
import {Portal} from "react-native-portalize";
import {Modalize} from "react-native-modalize";

const Filter = (props) => {
    const {filter, onChange, categories} = props;
    const refModalize = useRef();

    const handleOnChange = ({name, value}) => {
        let newFilter = {...filter};
        newFilter[name] = value;
        onChange(newFilter);

        refModalize.current?.close();
    }

    const _openCategories = () => {
        refModalize.current?.open();
    }

    return (
        <View style={styles.root}>

            <View style={styles.formItem}>

                <TextInput
                    value={filter.name}
                    style={styles.formItemInput}
                    placeholder="Поиск"
                    onChangeText={(value) => handleOnChange({name: 'name', value})}
                />

                <Icon
                    name="search"
                    type="Feather"
                    style={{color: '#ED8E00', fontSize: 15}}
                />

            </View>
            <TouchableOpacity style={[styles.formItem, {marginTop: 8}]} onPress={_openCategories}>

                <Text style={[styles.category, {flex: 1}]}>{ filter.category?.name || 'Выберите категорию' }</Text>

                <Icon
                    name="chevron-down"
                    type="Feather"
                    style={{color: '#0084FF', fontSize: 15}}
                />

            </TouchableOpacity>

            <Portal>
                <Modalize
                    ref={refModalize}
                    adjustToContentHeight={true}
                    rootStyle={styles.backdrop}
                    childrenStyle={styles.childrenStyle}
                    snapPoint={100}
                >
                    <View style={styles.modalizeRoot}>

                        <Text style={styles.modalizeTitle}>Выберите категорию</Text>

                        <View style={styles.modalizeCategories}>
                            {
                                categories.map((category, idx) => {
                                    const isActive = Boolean(category._id === filter.category?._id);

                                    return (
                                        <TouchableOpacity
                                            style={styles.modalizeCategory}
                                            key={`category-${idx}`}
                                            onPress={() => handleOnChange({name: "category", value: category})}
                                        >

                                            <View style={[styles.modalizeCategoryIcon, isActive && styles.modalizeCategoryIconActive]}>
                                                {isActive && (
                                                    <Icon name="check" type="Feather" style={{fontSize: 12, color: 'white'}}/>
                                                )}
                                            </View>

                                            <Text style={styles.modalizeCategoryName}>{category.name}</Text>

                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>

                        {
                            Boolean(filter.category?._id) && (
                                <TouchableOpacity style={styles.modalizeCategoriesReset} onPress={() => handleOnChange({name: "category", value: {}})}>
                                    <Text style={styles.modalizeCategoriesResetText}>Сбросить</Text>
                                </TouchableOpacity>
                            )
                        }

                    </View>
                </Modalize>
            </Portal>

        </View>
    )
}

const styles = StyleSheet.create({

    root: {
        paddingHorizontal: 12,
        marginTop: 12,
        marginBottom: 12
    },

    formItem: {
        height: 40,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 14,
    },
    formItemInput: {
        flex: 1,
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 20
    },

    category: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 20,
        color: 'black'
    },

    backdrop: {
        backgroundColor: 'rgba(80, 52, 140, 0.8)'
    },
    childrenStyle: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        overflow: 'hidden'
    },

    modalizeRoot: {
        backgroundColor: 'white',
        padding: 24
    },
    modalizeTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 23,
        color: 'black',
        marginBottom: 16
    },
    modalizeCategories: {},
    modalizeCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 4,
        paddingVertical: 8
    },
    modalizeCategoryIcon: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ED8E00',
        marginRight: 8,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalizeCategoryIconActive: {
        borderColor: '#8152E4',
        backgroundColor: '#8152E4'
    },
    modalizeCategoryName: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 18,
    },
    modalizeCategoriesReset: {
        paddingVertical: 6,
        paddingHorizontal: 32,
        borderRadius: 8,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#8152E4'
    },
    modalizeCategoriesResetText: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 18,
        color: '#8152E4'
    },
});

export default Filter
