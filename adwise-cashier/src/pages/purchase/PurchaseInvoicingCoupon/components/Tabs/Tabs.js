import React from "react";
import {
    View,

    Text,

    StyleSheet,

    TouchableOpacity
} from 'react-native';

const Tabs = (props) => {

    const handlePage = (index) => {
        let page = [false, false];

        page[index] = true;

        props.onChange(page)
    }

    return (
        <View style={styles.root}>
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[

                        styles.tab,

                        (props.page[0]) && styles.tabActive

                    ]}

                    onPress={() => handlePage(0)}
                >
                    <Text style={[

                        styles.tabText,

                        (props.page[0]) && styles.tabTextActive

                    ]}>Оплатить</Text>
                </TouchableOpacity>

                {/*<TouchableOpacity*/}
                {/*    style={[*/}

                {/*        styles.tab,*/}

                {/*        (props.page[1]) && styles.tabActive*/}

                {/*    ]}*/}

                {/*    onPress={() => handlePage(1)}*/}
                {/*>*/}
                {/*    <Text style={[*/}

                {/*        styles.tabText,*/}

                {/*        (props.page[1]) && styles.tabTextActive*/}

                {/*    ]}>Отправить</Text>*/}
                {/*</TouchableOpacity>*/}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        marginBottom: 12,

        paddingHorizontal: 34,

        flexDirection: 'row',
        alignItems: 'flex-start'
    },

    tabs: {
        flexDirection: 'row',

        backgroundColor: '#e6dcf7',

        padding: 3,

        borderRadius: 6
    },

    tab: {
        paddingHorizontal: 16,
        paddingVertical: 5,

        borderRadius: 4
    },
    tabActive: {
        backgroundColor: 'white',
    },
    tabText: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 19,
        letterSpacing: 1,
        color: '#25233E'
    },
    tabTextActive: {
        fontFamily: 'AtypText_medium'
    }
});

export default Tabs