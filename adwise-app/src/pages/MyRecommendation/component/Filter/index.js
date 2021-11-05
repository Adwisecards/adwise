import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    FlatList
} from "react-native";
import {
    Icon
} from "native-base";

const Filter = (props) => {
    const { filter, categories, onChange, onChangeOpen } = props;

    const [searchCategory, setSearchCategory] = useState("");
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        onChangeOpen(isOpen);
    }, [isOpen]);

    const handleOnChange = ({ name, value }) => {
        let newFilter = {...filter};
        newFilter[name] = value;
        newFilter.page = 1;
        onChange(newFilter, true);
    }
    const handleOnChangeMultiple = ({ name, value }) => {
        let isActive = filter[name].includes(value);
        let newFilter = {...filter};
        newFilter.page = 1;

        if (isActive) {
            newFilter[name].splice(filter[name].indexOf(value), 1);
        } else {
            newFilter[name].push(value);
        }

        onChange(newFilter, true);
    }

    const _getCategories = () => {
        const list = categories.filter((category) => {
            if (!searchCategory) {
                return category
            }

            if (!!searchCategory && category.name.toLowerCase().indexOf(searchCategory.toLowerCase()) > -1) {
                return category
            }
        })

        console.log('list: ', list);

        return list
    }
    const _getTitleCategory = () => {
        if (filter.category.length > 0) {
            return filter.category.map((category) => {
                return categories.find((_cat) => _cat._id === category).name
            }).join(', ');
        }

        return 'Выберите тип услуги'
    }

    return (
        <View style={styles.root}>

            <View style={styles.header}>
                <View style={styles.organization}>
                    <Icon
                        style={styles.organizationIcon}
                        type="Feather"
                        name="search"
                    />
                    <TextInput
                        value={filter.search}
                        style={styles.organizationInput}
                        placeholder="Поиск организаций"
                        placeholderTextColor="#c0c0c0"
                        onChangeText={(value) => handleOnChange({name: 'search', value})}
                    />
                </View>
            </View>

            <TouchableOpacity onPress={() => setOpen(!isOpen)} style={styles.categories}>

                <Text
                    style={styles.categoriesTitle}
                    numberOfLines={1}
                >
                    {_getTitleCategory()}
                </Text>

                <Icon
                    style={styles.categoriesIcon}
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    type="Feather"
                />

            </TouchableOpacity>

            {
                isOpen && (
                    <View style={[styles.categoriesDropDown, ]}>

                        <View style={styles.categoriesDropDownInput}>
                            <Icon
                                style={styles.organizationIcon}
                                type="Feather"
                                name="search"
                            />
                            <TextInput
                                value={searchCategory}
                                style={styles.organizationInput}
                                placeholder="Поиск по услугам"
                                placeholderTextColor="#c0c0c0"
                                onChangeText={(value) => setSearchCategory(value)}
                            />
                        </View>

                        <View style={{flex: 1}}>
                            <FlatList
                                data={_getCategories()}
                                numColumns={2}
                                horizontal={false}
                                columnWrapperStyle={{marginLeft: -6}}
                                renderItem={(data) => {
                                    const { item: category } = data;
                                    const isActive = Boolean(filter.category.includes(category._id));

                                    return (
                                        <TouchableOpacity
                                            style={[styles.categoriesDropDownListItem, isActive && {backgroundColor: '#8152E4'}]}
                                            onPress={() => handleOnChangeMultiple({name: 'category', value: category._id})}
                                        >
                                            <Text style={[styles.categoriesDropDownListItemText, isActive && {color: 'white'}]}>{category.name}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>

                    </View>
                )
            }

        </View>
    )
}

const styles = StyleSheet.create({

    root: {
        paddingHorizontal: 12,
        marginBottom: 8
    },

    header: {
        flexDirection: 'row',
        marginBottom: 12
    },

    organization: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        backgroundColor: 'white',
        borderRadius: 4
    },
    organizationIcon: {
        fontSize: 15,
        color: '#ED8E00',
        marginLeft: 8
    },
    organizationInput: {
        fontFamily: 'AtypText',
        fontSize: 12,
        color: 'black',
        paddingHorizontal: 8,
        flex: 1
    },

    categories: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,

        backgroundColor: 'white',

        borderRadius: 4
    },
    categoriesTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 13,
        lineHeight: 19,
        color: '#8152E4',
        flex: 1,
        marginRight: 8
    },
    categoriesIcon: {
        fontSize: 20,
        color: '#8152E4'
    },
    categoriesDropDown: {
        position: "absolute",
        top: '100%',
        left: 12,
        right: 12,
        padding: 12,
        borderRadius: 4,
        marginTop: 4,
        backgroundColor: 'white',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    categoriesDropDownInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#EAEBF0',
        height: 30,
        borderRadius: 4,
        marginBottom: 6
    },
    categoriesDropDownList: {},
    categoriesDropDownListItem: {
        flex: 1,
        backgroundColor: '#F2F3F9',
        borderRadius: 4,
        padding: 10,
        marginLeft: 6,
        marginBottom: 6
    },
    categoriesDropDownListItemText: {
        fontFamily: 'AtypText_medium',
        fontSize: 13,
        lineHeight: 14,
        color: '#25233E'
    }
});

export default Filter
