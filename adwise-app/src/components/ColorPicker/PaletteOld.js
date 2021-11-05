import React, {useState} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import {
    Icon
} from 'native-base';
import arrowColorHeader from './arrow-color-header.png';

const paletteColors = [
    {
        header: "#FF0000",
        items: ['#800000', '#8B0000', '#B22222', '#FF0000', '#FA8072', '#FF6347', '#FF7F50', '#FF4500']
    },
    {
        header: "#FF9900",
        items: ['#FFD591', '#FFC069', '#FFA940', '#FA8C16', '#D46B08', '#AD4E00', '#893D08', '#612500']
    },
    {
        header: "#F3F300",
        items: ['#ee9c0d', '#fed800', '#feee76', '#feb900', '#fdff00', '#fedf00', '#fef67c', '#febe00']
    },
    {
        header: "#00FF00",
        items: ['#adff31', '#64fd04', '#60a02f', '#36c822', '#00FF00', '#4fc879', '#00a869', '#157347']
    },
    {
        header: "#14EDED",
        items: ['#45c3fe', '#41d2fe', '#41a7ff', '#14EDED', '#078cee', '#137dff', '#6396ea', '#1e90fc']
    },
    {
        header: "#0000FF",
        items: ['#082467', '#110a8e', '#08467f', '#0000FF', '#0a0080', '#0b47ab', '#4169e2', '#2000fe']
    },
    {
        header: "#5c030f",
        items: ['#a60d0f', '#810800', '#5c030f', '#500216', '#7a061e', '#450206', '#65061f', '#8e302f']
    },
];

const { width } = Dimensions.get('window');

const Palette = (props) => {
    const { onChangeColor, color } = props;

    const [activePalette, setActivePalette] = useState(0);
    const [activeColor, setActiveColor] = useState(color);

    const handleChangeColor = (color) => {
        setActiveColor(color);
        onChangeColor(color)
    }

    return (
        <View style={styles.root}>
            <ScrollView
                style={{marginLeft: -5}}
                contentContainerStyle={{paddingTop: 2, paddingBottom: 10}}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal
            >
                {
                    paletteColors.map((palette, idx) => (
                        <TouchableOpacity
                            key={`button-color-${ idx }`}
                            style={[
                                styles.buttonHeaderPalette,
                                {backgroundColor: palette.header}
                            ]}
                            onPress={() => setActivePalette(idx)}
                        >
                            {idx === activePalette && (
                                <View style={[styles.buttonHeaderPaletteArrow, {backgroundColor: palette.header}]}>
                                    <Image style={[styles.buttonHeaderPaletteArrowBottom, {tintColor: palette.header}]}
                                           source={arrowColorHeader} resizeMode={'contain'}/>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))
                }
            </ScrollView>

            <View style={styles.content}>
                {
                    paletteColors[activePalette].items.map((color, idx) => (
                        <TouchableOpacity key={`button-color-1-${ idx }`} style={[styles.contentColor, { backgroundColor: color }]} onPress={() => {handleChangeColor(color)}}>
                            { (activeColor === color) && ( <Icon name={'check'} type={"Feather"} style={styles.contentColorIcon}/> ) }
                        </TouchableOpacity>
                    ))
                }
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerTitle}>Hex</Text>

                <View style={styles.footerCurrent}>
                    <Text style={[styles.footerCurrentText, { color: activeColor }]}>{ activeColor }</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: 'white'
    },

    buttonHeaderPalette: {
        width: 32,
        height: 32,
        borderRadius: 5,
        marginLeft: 5,
        position: 'relative'
    },
    buttonHeaderPaletteArrow: {
        position: 'absolute',
        left: 0,
        right: 0,

        justifyContent: 'flex-end',
        alignItems: 'flex-end',

        top: -2,
        bottom: -2,

        borderRadius: 5
    },
    buttonHeaderPaletteArrowBottom: {
        width: 32,
        height: 10,
        position: 'absolute',
        bottom: -8,
        left: 0,
        right: 0
    },

    content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        marginLeft: -5
    },
    contentColor: {
        width: (width - 48) / 4 - 4,
        height: 50,

        borderRadius: 5,
        marginLeft: 5,
        marginBottom: 5,

        justifyContent: 'center',
        alignItems: 'center'
    },
    contentColorIcon: {
        color: 'white',
        fontSize: 40
    },

    footer: {
        marginTop: 18,
        flexDirection: 'row',
        alignItems: 'center'
    },
    footerTitle: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 15,
        opacity: 0.6,

        marginRight: 16
    },
    footerCurrent: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',

        padding: 8,
        paddingBottom: 5,
        borderRadius: 4
    },
    footerCurrentText: {
        fontSize: 14,
        lineHeight: 14,
        letterSpacing: 0.05,
        fontFamily: 'AtypText'
    },
    footerButtonChange: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#8152E4',
        borderRadius: 4,

        marginLeft: 'auto',

        paddingHorizontal: 16,
        paddingVertical: 8
    },
    footerButtonChangeText: {
        fontSize: 12,
        lineHeight: 12,
        color: '#8152E4',
        textTransform: 'uppercase',
        letterSpacing: 0.195,
        fontFamily: 'AtypText_medium'
    }
});

Palette.defaultProps = {
    activeColor: '#007BED'
}

export default Palette
