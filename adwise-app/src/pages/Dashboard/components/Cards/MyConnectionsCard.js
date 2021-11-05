import React from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

const MyConnectionsCard = (props) => {
    const { onPress } = props;

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.root}>
                <View style={styles.rootLeft}>
                    <Image style={styles.image} source={{ uri: 'https://s3-alpha-sig.figma.com/img/fe06/c968/3b1f33e2fde9e671a0ae9017a90c4fb0?Expires=1602460800&Signature=InbGjahVTyxM1uDLgPQOyqsA~druPMnwPqDAq0ts-hcBWBDQtQr708hFo6nvi5hURQlSwv832dgXsKffGbAkd3YDXEJAlxTO11yQKeDgPA07jC7PZq~nz7mIMGGHwWtntiKMpssOq8l4Z62GYrn7BiDPzp11g8VXf1zpHQVlM5yb8IOEsewP0TuY2XFKpkFzgI5307m-zESDSYGEHBONhhLxhVYEcEZ~ZyWJVO7n5L4MH4HXcM0ateXt6tTLrygK89osNpOBqWcXlJxdP18EF8gbIj1F8SyWp865T4l91-9JeCtesxasoE5kzAF1PfpFhyMaJw2q3KE33Y6ZQKb2Xg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA' }}/>
                </View>
                <View style={styles.rootRight}>
                    <View style={{ marginBottom: 4 }}>
                        <Text style={styles.fontName}>Сергей</Text>
                        <Text style={styles.fontName}>Стеблина</Text>
                    </View>

                    <Text style={styles.formDescription}>Подсказки облегчающие работу в Фигме</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginLeft: 12,
        flexDirection: 'row',
        overflow: 'hidden'
    },
    rootLeft: {
        width: 60
    },
    rootRight: {
        paddingHorizontal: 8,
        paddingVertical: 12,

        flexShrink: 1
    },

    image: {
        flex: 1
    },

    fontName: {
        fontFamily: 'AtypText_semibold',
        fontSize: 13,
        lineHeight: 14
    },
    formDescription: {
        fontSize: 10,
        lineHeight: 12,
        opacity: 0.5
    }
});

export default MyConnectionsCard
