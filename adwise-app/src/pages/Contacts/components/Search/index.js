import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight
} from "react-native";
import {
    Icon
} from "native-base";
import {
    Modalize
} from 'react-native-modalize';
import {
     Input
} from "../../../../components";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

class Search extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            search: props.search
        };
    }

    onChangeSearch = ({ name, value }) => {
        let newSearch = {...this.state.search};

        newSearch[name] = value;

        this.setState({
            search: newSearch
        })
    }

    onSearch = () => {
        this.props.onChangeSearch(this.state.search);
    }
    onClear = () => {
        const search = {
            userName: '',
            isSystem: false
        };

        this.props.onChangeSearch(search);
        this.setState({ search });
    }

    render() {
        const { setRef, onClose } = this.props;
        const { search } = this.state;

        return (
            <Modalize
                ref={setRef}
                adjustToContentHeight={true}
                scrollViewProps={{
                    alwaysBounceHorizontal: false,
                    alwaysBounceVertical: false,
                    bounces: false
                }}
                avoidKeyboardLikeIOS={false}
                keyboardAvoidingBehavior="padding"
            >
                <View style={styles.root}>
                    <Text style={styles.title}>{allTranslations(localization.commonSearch)}</Text>

                    <View style={{ marginBottom: 24 }}>
                        <View style={{ marginBottom: 12 }}>
                            <Input
                                value={search.userName}
                                placeholder="Иванов"

                                onChangeText={(value) => this.onChangeSearch({ name: 'userName', value: value })}
                            />
                        </View>

                        <View>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => this.onChangeSearch({ name: 'isSystem', value: !search.isSystem })}
                            >
                                <View
                                    style={[
                                        styles.checkboxIcon,
                                        search.isSystem && { backgroundColor: '#8152E4' }
                                    ]}
                                >
                                    <Icon
                                        style={{ color: 'white', fontSize: 15}}
                                        type="Feather"
                                        name="check"
                                    />
                                </View>
                                <Text style={styles.checkboxName}>{allTranslations(localization.contactsButtonUserSystem)}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{ marginBottom: 8 }}>
                        <TouchableHighlight onPress={this.onSearch}>
                            <View style={styles.buttonSearch}>
                                <Text style={styles.buttonSearchText}>{allTranslations(localization.commonSearch)}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>

                    <TouchableHighlight onPress={this.onClear}>
                        <View style={styles.buttonClear}>
                            <Text style={styles.buttonClearText}>{allTranslations(localization.commonClear)}</Text>
                        </View>
                    </TouchableHighlight>

                </View>
            </Modalize>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        padding: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,

        backgroundColor: 'white'
    },

    title: {
        fontFamily: 'AtypText_medium',
        fontSize: 22,
        lineHeight: 24,
        color: 'black',

        marginBottom: 16
    },

    buttonSearch: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,

        backgroundColor: '#8152E4'
    },
    buttonSearchText: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 20,
        color: 'white'
    },

    buttonClear: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#8152E4'
    },
    buttonClearText: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 20,
        color: '#8152E4'
    },

    checkbox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkboxIcon: {
        width: 20,
        height: 20,

        marginRight: 8,

        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#8152E4',

        justifyContent: 'center',
        alignItems: 'center'
    },
    checkboxName: {
        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 14,
        color: 'black'
    },
});

export default Search
