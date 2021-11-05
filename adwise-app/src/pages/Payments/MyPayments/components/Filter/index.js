import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    Platform,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {
    Icon
} from "native-base";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const statusList = [
    {
        value: 'new',
        title: 'Неоплачен',
        color: '#D8004E'
    },
    {
        value: 'confirmed',
        title: 'Оплачен',
        color: '#61AE2C'
    },
    {
        value: 'complete',
        title: 'Завершён',
        color: '#8152E4'
    },
    {
        value: 'processing',
        title: 'Ожидание оплаты',
        color: '#ED8E00',
    },
    {
        value: 'shared',
        title: 'Подарок',
        color: '#02D1C5'
    }
];

const Filter = (props) => {
    const {filter, onChange, onChangeOpen} = props;

    const [isOpen, setOpen] = useState(false);
    const [openDatePicker, setOpenDatePicker] = useState("");

    useEffect(() => {
        onChangeOpen(isOpen);
    }, [isOpen]);

    const isEmpty = Boolean(filter.type.length <= 0 && !filter.dateFrom && !filter.dateTo && !filter.organizationName);
    const isIos = Boolean(Platform.OS === 'ios');

    const handleOnChange = ({name, value}) => {
        let newFilter = {...filter};
        newFilter[name] = value;
        newFilter.page = 1;
        onChange(newFilter);
    }
    const handleOnChangeType = (value) => {
        let newFilter = {...filter};

        if (newFilter.type.indexOf(value) > -1) {
            newFilter.type.splice(newFilter.type.indexOf(value), 1);
        } else {
            newFilter.type.push(value);
        }

        newFilter.page = 1;
        onChange(newFilter);
    }
    const handleOnChangeDate = (date) => {
        let newFilter = {...filter};

        if (filter.dateFrom === "") {
            filter.dateFrom = new Date('1995-12-17');
        }
        if (filter.dateTo === "") {
            filter.dateTo = new Date();
        }

        if (openDatePicker === 'dateTo' && date < filter.dateFrom) {
            newFilter.dateFrom = date;
        }
        if (openDatePicker === 'dateFrom' && date > filter.dateTo) {
            newFilter.dateTo = date;
        }

        newFilter.page = 1;
        newFilter[openDatePicker] = date;

        onChange(newFilter);
        setOpenDatePicker("");
    }
    const handleOnReset = () => {
        let newFilter = {...filter};

        newFilter.page = 1;
        newFilter.type = [];
        newFilter.dateFrom = "";
        newFilter.dateTo = "";
        newFilter.organizationName = "";

        onChange(newFilter);
    }

    return (
        <View style={[
            styles.root,
            isIos && {zIndex: 999}
        ]}>

            <TouchableOpacity style={styles.button} activeOpacity={0.9} onPress={() => setOpen(!isOpen)}>

                {
                    isEmpty ? (
                        <View style={styles.viewEmpty}>
                            <Text style={styles.viewEmptyText}>Фильтровать</Text>

                            <View style={styles.viewEmptyIcon}>
                                <Icon
                                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                                    type="Feather"
                                    style={{color: isOpen ? '#ED8E00' : '#8152E4'}}
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={[styles.viewEmpty, {height: 'auto'}]}>
                            <View style={{flex: 1}}>

                                {
                                    Boolean(filter.type.length > 0) && (
                                        <View style={[styles.selectedLine, {marginLeft: -8}]}>
                                            <Text style={[styles.selectedLineText, {marginLeft: 8}]}>Статус заказа</Text>

                                            {
                                                filter.type.map((key) => {
                                                    const status = statusList.find((t => t.value === key));
                                                    return (
                                                        <View
                                                            style={[
                                                                styles.type,
                                                                {
                                                                    borderColor: status.color,
                                                                    backgroundColor: status.color,
                                                                    paddingHorizontal: 6,
                                                                    paddingVertical: 3,
                                                                    marginTop: 2,
                                                                    marginBottom: 0
                                                                }
                                                            ]}
                                                        >
                                                            <Text style={[
                                                                styles.typeText,
                                                                {
                                                                    color: 'white',
                                                                    fontSize: 10,
                                                                    lineHeight: 11
                                                                }
                                                            ]}>{status.title}</Text>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    )
                                }

                                {
                                    Boolean(filter.dateFrom || filter.dateTo) && (
                                        <View style={styles.selectedLine}>
                                            <Text style={[styles.selectedLineText, {marginRight: 6}]}>Дата</Text>
                                            <Text style={[styles.selectedDate]}>
                                                {`${moment(filter.dateFrom || new Date('1995-12-17')).format('DD.MM.YYYY') } — ${moment(filter.dateTo || new Date()).format('DD.MM.YYYY') }`}
                                            </Text>
                                        </View>
                                    )
                                }

                                {
                                    Boolean(filter.organizationName) && (
                                        <View style={styles.selectedLine}>
                                            <Text style={[styles.selectedLineText, {marginRight: 6}]}>Организация</Text>
                                            <Text style={[styles.selectedDate]}>{filter.organizationName}</Text>
                                        </View>
                                    )
                                }

                            </View>

                            <View style={styles.viewEmptyIcon}>
                                <Icon
                                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                                    type="Feather"
                                    style={{color: isOpen ? '#ED8E00' : '#8152E4'}}
                                />
                            </View>
                        </View>
                    )
                }

            </TouchableOpacity>


            {
                isOpen && (
                    <View style={styles.dropDown}>

                        <View style={styles.dropDownSection}>

                            <Text style={styles.dropDownSectionTitle}>Статус заказа</Text>

                            <View style={styles.types}>
                                {
                                    statusList.map((status) => {
                                        const isActive = Boolean( filter.type.indexOf(status.value) > -1);

                                        return (
                                            <View style={{opacity: isActive ? 1 : 0.6}}>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.type,
                                                        {borderColor: status.color},
                                                        isActive && {backgroundColor: status.color}
                                                    ]}
                                                    onPress={() => handleOnChangeType(status.value)}
                                                >
                                                    <Text style={[
                                                        styles.typeText,
                                                        {color: isActive ? 'white' : status.color}
                                                    ]}>{status.title}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                            </View>

                        </View>

                        <View style={[styles.dropDownSection, {marginTop: 24}]}>

                            <Text style={styles.dropDownSectionTitle}>Выбор промежутка дат</Text>

                            <View style={styles.dates}>

                                <TouchableOpacity style={styles.date} onPress={() => setOpenDatePicker('dateFrom')}>

                                    <Text style={styles.dateText}>{moment(filter.dateFrom || new Date('1995-12-17')).format('DD.MM.YYYY') }</Text>

                                    <Icon
                                        name="calendar"
                                        style={{color: '#8152E4', fontSize: 16}}
                                    />

                                </TouchableOpacity>

                                <TouchableOpacity style={styles.date} onPress={() => setOpenDatePicker('dateTo')}>

                                    <Text style={styles.dateText}>{moment(filter.dateTo || new Date()).format('DD.MM.YYYY') }</Text>

                                    <Icon
                                        name="calendar"
                                        style={{color: '#8152E4', fontSize: 16}}
                                    />

                                </TouchableOpacity>

                            </View>

                        </View>

                        <View style={[styles.dropDownSection, {marginTop: 24}]}>

                            <Text style={styles.dropDownSectionTitle}>Организация</Text>

                            <TextInput
                                value={filter.organizationName}
                                placeholder="..."
                                style={styles.input}
                                onChangeText={(value) => handleOnChange({name: 'organizationName', value})}
                            />

                        </View>

                        {
                            Boolean(!isEmpty) && (
                                <TouchableOpacity style={[styles.buttonReset, {marginTop: 24}]} onPress={handleOnReset}>
                                    <Text style={styles.buttonResetText}>Сбросить</Text>
                                </TouchableOpacity>
                            )
                        }

                    </View>
                )
            }

            <DateTimePickerModal
                isVisible={openDatePicker}
                mode="date"
                confirmTextIOS="Выбрать"
                cancelTextIOS="Отмена"
                locale="ru_GB"
                maximumDate={new Date()}
                onConfirm={handleOnChangeDate}
                onCancel={() => setOpenDatePicker("")}

            />

        </View>
    )

}

const styles = StyleSheet.create({
    root: {
        marginBottom: 20,
        marginHorizontal: 12,
        marginTop: 16
    },
    button: {
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingLeft: 12,
        paddingVertical: 4,
    },

    viewEmpty: {
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    viewEmptyText: {
        fontFamily: 'AtypText_medium',
        fontSize: 13,
        lineHeight: 19,
        color: '#8152E4'
    },

    selectedLine: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4
    },
    selectedLineText: {
        fontFamily: 'AtypText_medium',
        fontSize: 13,
        lineHeight: 19,
        color: '#808080'
    },
    selectedDate: {
        fontFamily: 'AtypText_semibold',
        fontSize: 13,
        lineHeight: 19,
        color: 'black'
    },

    dropDown: {
        position: 'absolute',
        width: '100%',
        left: 0,
        right: 0,
        top: '100%',
        marginTop: 4,

        padding: 12,
        backgroundColor: 'white',
        borderRadius: 4,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    dropDownSection: {},
    dropDownSectionTitle: {
        fontFamily: 'AtypText_semibold',
        fontSize: 14,
        lineHeight: 20,
        color: '#25233E',
        marginBottom: 8
    },

    types: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginLeft: -8,
        marginBottom: -8,
    },
    type: {
        marginLeft: 8,
        marginBottom: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 56
    },
    typeText: {
        fontFamily: 'AtypText_medium',
        fontSize: 13,
        lineHeight: 13,
    },

    dates: {
        flexDirection: 'row',
        marginLeft: -8
    },
    date: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#EBEBEB',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4
    },
    dateText: {
        fontFamily: 'AtypText',
        fontSize: 12,
        lineHeight: 17,
        color: '#000000'
    },

    input: {
        height: 30,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#EBEBEB',

        fontFamily: 'AtypText',
        fontSize: 12,
        paddingHorizontal: 12
    },

    buttonReset: {
        borderRadius: 4,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#8152E4',
        height: 30
    },
    buttonResetText: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 14,
        color: '#8152E4'
    },
});

export default Filter
