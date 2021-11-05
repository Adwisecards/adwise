import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from "react-native";
import {Icon} from "native-base";

const Filter = (props) => {
    const {filter, onChange, onChangeOpen, couponsCategories} = props;

    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        onChangeOpen(isOpen);
    }, [isOpen]);

    const handleOnChange = ({ name, value }) => {
        let newFilter = {...filter};
        value = Boolean(newFilter[name] === value) ? "" : value;
        newFilter[name] = value;
        newFilter.page = 1;
        onChange(newFilter, true);
    }
    const handleOnChangeMultiple = ({name, value}) => {
        let isActive = filter[name].includes(value);
        let newFilter = {...filter};
        newFilter.page = 1;

        if (isActive) {
            newFilter[name].splice(filter[name].indexOf(value), 1);
        } else {
            newFilter[name].push(value);
        }

        onChange(newFilter);
    }
    const handleOnReset = () => {
        let newFilter = {...filter};
        newFilter.active = "";
        newFilter.availability = "";
        newFilter.sort = "";
        newFilter.categories = [];

        onChange(newFilter);
    }
    const _getActiveSortTitle = () => {
        if (filter.sort.indexOf('cashback') > -1) {
            return "Кэшбэк"
        } else {
            return "Стомость"
        }
    }
    const _getActiveSortValue = () => {
        if (filter.sort.indexOf('-') > -1) {
            return "Минимальная"
        } else {
            return "Максимальная"
        }
    }

    const isActiveFilter = Boolean(filter.active !== '' || filter.availability !== '' || !!filter.sort || filter.categories.length > 0);

    return (
        <View style={styles.root}>

            <View style={styles.header}>

                <View style={styles.coupon}>
                    <Icon
                        style={styles.couponIcon}
                        type="Feather"
                        name="search"
                    />
                    <TextInput
                        value={filter.coupon}
                        style={styles.couponInput}
                        placeholder="Поиск по вашим купонам"
                        placeholderTextColor="#c0c0c0"
                        onChangeText={(value) => handleOnChange({name: 'coupon', value})}
                    />
                </View>

            </View>

            <TouchableOpacity onPress={() => setOpen(!isOpen)} style={styles.categories}>

                <View style={{flex: 1}}>
                    {
                        !isActiveFilter ? (
                            <Text style={styles.categoriesTitle} numberOfLines={1}>Фильтровать</Text>
                        ) : (
                            <View>

                                {
                                    Boolean(filter.active !== '') && (
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={styles.categoriesActiveTitle} numberOfLines={1}>Активен</Text>
                                            <Text style={styles.categoriesActiveValue} numberOfLines={1}>{filter.active ? 'Да' : 'Нет'}</Text>
                                        </View>
                                    )
                                }

                                {
                                    Boolean(filter.availability !== '') && (
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={styles.categoriesActiveTitle} numberOfLines={1}>Наличие</Text>
                                            <Text style={styles.categoriesActiveValue} numberOfLines={1}>{filter.availability ? 'Да' : 'Нет'}</Text>
                                        </View>
                                    )
                                }

                                {
                                    Boolean(filter.categories.length > 0) && (
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={styles.categoriesActiveTitle} numberOfLines={1}>Категория</Text>
                                            <Text style={styles.categoriesActiveValue} numberOfLines={1}>
                                                { filter.categories.map((item) => { return couponsCategories.find((t) => t.value === item).title }).join(', ') }
                                            </Text>
                                        </View>
                                    )
                                }

                                {
                                    Boolean(filter.sort !== '') && (
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={styles.categoriesActiveTitle} numberOfLines={1}>{_getActiveSortTitle()}</Text>
                                            <Text style={styles.categoriesActiveValue} numberOfLines={1}>{_getActiveSortValue()}</Text>
                                        </View>
                                    )
                                }

                            </View>
                        )
                    }
                </View>

                <Icon
                    style={styles.categoriesIcon}
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    type="Feather"
                />

            </TouchableOpacity>

            {
                isOpen && (
                    <View style={styles.dropDown}>

                        <ScrollView style={{maxHeight: 350}}>

                            <View style={[styles.dropDownSection, {marginTop: 0}]}>
                                <Text style={styles.dropDownSectionTitle}>Активен</Text>

                                <View style={styles.dropDownSectionItems}>
                                    {
                                        actives.map((item) => {
                                            const isActive = Boolean(filter.active === item.value);

                                            return (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.dropDownSectionItem,
                                                        isActive && {backgroundColor: '#8152E4'}
                                                    ]}
                                                    onPress={() => handleOnChange({name: "active", value: item.value})}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.dropDownSectionItemText,
                                                            isActive && {color: 'white'}
                                                        ]}
                                                    >{item.title}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                            </View>

                            <View style={[styles.dropDownSection]}>
                                <Text style={styles.dropDownSectionTitle}>Наличие</Text>
                                <View style={styles.dropDownSectionItems}>
                                    {
                                        availabilitis.map((item) => {
                                            const isActive = Boolean(filter.availability === item.value);

                                            return (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.dropDownSectionItem,
                                                        isActive && {backgroundColor: '#8152E4'}
                                                    ]}
                                                    onPress={() => handleOnChange({name: "availability", value: item.value})}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.dropDownSectionItemText,
                                                            isActive && {color: 'white'}
                                                        ]}
                                                    >{item.title}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                            </View>

                            <View style={[styles.dropDownSection]}>
                                <Text style={styles.dropDownSectionTitle}>Категория</Text>

                                <View style={styles.dropDownSectionItems}>
                                    {
                                        couponsCategories.map((category) => {
                                            const isActive = filter.categories.includes(category.value);

                                            return (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.dropDownSectionItem,
                                                        isActive && {backgroundColor: '#8152E4'}
                                                    ]}
                                                    onPress={() => handleOnChangeMultiple({name: 'categories', value: category.value})}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.dropDownSectionItemText,
                                                            isActive && {color: 'white'}
                                                        ]}
                                                    >{category.title}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                            </View>

                            <View style={[styles.dropDownSection]}>
                                <Text style={styles.dropDownSectionTitle}>Сортировать по кэшбэку</Text>
                                <View style={styles.dropDownSectionItems}>
                                    {
                                        casbacks.map((item) => {
                                            const isActive = Boolean(filter.sort === item.value);

                                            return (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.dropDownSectionItem,
                                                        isActive && {backgroundColor: '#8152E4'}
                                                    ]}
                                                    onPress={() => handleOnChange({name: 'sort', value: item.value})}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.dropDownSectionItemText,
                                                            isActive && {color: 'white'}
                                                        ]}
                                                    >{item.title}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                            </View>

                            <View style={[styles.dropDownSection]}>
                                <Text style={styles.dropDownSectionTitle}>Сортировать по стоимости</Text>
                                <View style={styles.dropDownSectionItems}>
                                    {
                                        prices.map((item) => {
                                            const isActive = Boolean(filter.sort === item.value);

                                            return (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.dropDownSectionItem,
                                                        isActive && {backgroundColor: '#8152E4'}
                                                    ]}
                                                    onPress={() => handleOnChange({name: 'sort', value: item.value})}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.dropDownSectionItemText,
                                                            isActive && {color: 'white'}
                                                        ]}
                                                    >{item.title}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                            </View>

                        </ScrollView>

                        {
                            isActiveFilter && (
                                <TouchableOpacity style={styles.buttonReset} onPress={() => handleOnReset()}>
                                    <Text style={styles.buttonResetText}>Сбросить</Text>
                                </TouchableOpacity>
                            )
                        }

                    </View>
                )
            }

        </View>
    )
}

const actives = [
    {
        title: "Да",
        value: true
    },
    {
        title: "Нет",
        value: false
    },
];
const availabilitis = [
    {
        title: "Да",
        value: true
    },
    {
        title: "Нет",
        value: false
    },
];
const casbacks = [
    {
        title: "Максимальный",
        value: 'cashback'
    },
    {
        title: "Минимальный",
        value: '-cashback'
    },
];
const prices = [
    {
        title: "Сначала дороже",
        value: 'price'
    },
    {
        title: "Сначала дешевле",
        value: '-price'
    },
];

const styles = StyleSheet.create({

    root: {
        paddingHorizontal: 12,
        marginBottom: 8
    },

    header: {
        flexDirection: 'row',
        marginBottom: 12
    },

    coupon: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        backgroundColor: 'white',
        borderRadius: 4
    },
    couponIcon: {
        fontSize: 15,
        color: '#ED8E00',
        marginLeft: 8
    },
    couponInput: {
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

    categoriesActiveTitle: {
        fontFamily: "AtypText_medium",
        fontSize: 13,
        lineHeight: 19,
        color: '#808080'
    },
    categoriesActiveValue: {
        flex: 1,
        marginLeft: 6,
        fontFamily: "AtypText_semibold",
        fontSize: 13,
        lineHeight: 19,
        color: '#000000'
    },

    dropDown: {
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
    dropDownSection: {
        marginTop: 20
    },
    dropDownSectionTitle: {
        fontFamily: 'AtypText_semibold',
        fontSize: 14,
        lineHeight: 20,
        color: '#25233E',
        marginBottom: 6
    },
    dropDownSectionItems: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: -8,
        marginBottom: -8
    },
    dropDownSectionItem: {
        marginLeft: 8,
        marginBottom: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(209, 209, 209, 0.3)'
    },
    dropDownSectionItemText: {
        fontFamily: 'AtypText_medium',
        fontSize: 13,
        lineHeight: 14,
        color: '#808080'
    },

    buttonReset: {
        borderRadius: 4,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#8152E4',
        height: 30,
        marginTop: 16
    },
    buttonResetText: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 14,
        color: '#8152E4'
    },
});

export default Filter
