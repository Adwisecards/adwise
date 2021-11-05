import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Animated,
} from 'react-native';
import {
    Icon
} from 'native-base';
import Dash from "react-native-dash";

const Stepper = (props) => {
    const { item, limit, showMore } = props;
    const { caption, count, success, title, totalEnd} = item;
    const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (!showMore){
            setFadeAnim(new Animated.Value(0));
        }
    }, [showMore])

    if (props.index >= limit && !showMore){
        return null
    }
    if (props.index >= limit){
        const animations = [
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500 + (props.index * 50),

                useNativeDriver: true
            })
        ];

        Animated.sequence(animations).start()
    }

    return (
        <Animated.View
            style={[
                stylesStepper.stepper,
                {
                    opacity: props.index >= limit ? fadeAnim : 1
                }
            ]}
        >
            <View style={stylesStepper.stepperLeft}>
                <View style={[stylesStepper.countContainer, success && stylesStepper.countContainerActive]}>
                    {
                        success ? (
                            <Icon name={'check'} type={"Feather"} style={{ fontSize: 18, color: 'white' }}/>
                        ) : (
                            <Text style={stylesStepper.countText}>{count}</Text>
                        )
                    }
                </View>

                {
                    !totalEnd && (
                        <Dash
                            dashGap={3}
                            dashLength={3}
                            dashThickness={3}
                            style={stylesStepper.stepperDash}
                            dashStyle={{borderRadius: 100}}
                            dashColor={success ? '#c0a8f2' : '#C2C2C2'}
                        />
                    )
                }
            </View>
            <View style={stylesStepper.stepperRight}>
                <Text style={stylesStepper.stepperTitle}>{title}</Text>

                {(!!caption && success) && (<Text style={stylesStepper.stepperCaption}>{caption}</Text>)}
            </View>
        </Animated.View>
    )
}

const Progress = (props) => {
    const [showMore, setShowMore] = useState(false);

    const list = [
        {
            count: 1,
            success: true,
            title: 'Создать свою визитную карточку',
            caption: 'Награда: замена цвета визитки',

            totalEnd: false
        },
        {
            count: 2,
            success: false,
            title: 'Создать свою визитную карточку',
            caption: 'Награда: замена цвета визитки',

            totalEnd: false
        },
        {
            count: 3,
            success: false,
            title: 'Создать свою визитную карточку',
            caption: 'Награда: замена цвета визитки',

            totalEnd: false
        },
        {
            count: 4,
            success: false,
            title: 'Создать свою визитную карточку',
            caption: 'Награда: замена цвета визитки',

            totalEnd: false
        },
        {
            count: 5,
            success: false,
            title: 'Создать свою визитную карточку',
            caption: 'Награда: замена цвета визитки',

            totalEnd: false
        },
        {
            count: 6,
            success: false,
            title: 'Создать свою визитную карточку',
            caption: 'Награда: замена цвета визитки',

            totalEnd: false
        },
        {
            count: 6,
            success: false,
            title: 'Создать свою визитную карточку',
            caption: 'Награда: замена цвета визитки',

            totalEnd: false
        },
        {
            count: 6,
            success: false,
            title: 'Создать свою визитную карточку',
            caption: 'Награда: замена цвета визитки',

            totalEnd: false
        },
        {
            count: 6,
            success: false,
            title: 'Создать свою визитную карточку',
            caption: 'Награда: замена цвета визитки',

            totalEnd: false
        },
        {
            count: 6,
            success: false,
            title: 'Создать свою визитную карточку',
            caption: 'Награда: замена цвета визитки',

            totalEnd: false
        },
        {
            count: 6,
            success: false,
            title: 'Создать свою визитную карточку',
            caption: 'Награда: замена цвета визитки',

            totalEnd: true
        },
    ];

    return (
        <View style={styles.root}>
            <Text style={styles.typographyTitle}>Прогресс</Text>

            <View style={styles.section}>
                <SafeAreaView style={styles.safeAreaView}>
                    <FlatList
                        data={list}
                        renderItem={(item) => <Stepper {...item} showMore={showMore} limit={4}/>}

                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    />
                </SafeAreaView>

                {
                    list.length > 4 && (
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity style={styles.buttonMode} onPress={() => setShowMore(!showMore)}>
                                <Text style={styles.typographyButtonMode}>{ showMore ? 'Скрыть' : 'Показать больше' }</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        marginBottom: 26
    },

    buttonMode: {
        paddingVertical: 6,
        paddingHorizontal: 30,
        borderRadius: 8,
        backgroundColor: '#ED8E00'
    },

    typographyTitle: {
        marginBottom: 16,

        fontSize: 24,
        lineHeight: 26,
        fontFamily: 'AtypText_medium'
    },
    typographyButtonMode: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 18,
        textAlign: 'center',
        color: 'white'
    },

    section: {
        overflow: 'hidden',

        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16
    }
});
const stylesStepper = StyleSheet.create({
    stepper: {
        flexDirection: 'row',

        marginBottom: 16
    },

    stepperLeft: {
        width: 30,
        marginRight: 12,

        position: 'relative'
    },
    stepperRight: {
        flex: 1
    },

    stepperTitle: {
        fontSize: 16,
        lineHeight: 18,
        color: 'black',
        fontFamily: 'AtypText',

        maxWidth: '80%'
    },
    stepperCaption: {
        marginTop: 4,

        fontFamily: 'AtypText',
        fontSize: 13,
        lineHeight: 18,
        color: '#8152E4'
    },

    stepperDash: {
        width: 3,

        alignSelf: 'center',

        flexDirection: 'column',

        position: 'absolute',
        top: 0,
        bottom: -16,
        zIndex: -1
    },

    countContainer: {
        width: 30,
        height: 30,
        borderRadius: 999,

        backgroundColor: '#ed8d00',

        justifyContent: 'center',
        alignItems: 'center',

        borderWidth: 3,
        borderStyle: 'solid',
        borderColor: '#f2ad47'
    },
    countContainerActive: {
        backgroundColor: '#8152E4',
        borderColor: '#a582ec'
    },
    countText: {
        fontSize: 14,
        lineHeight: 16,
        textAlign: 'center',
        color: 'white'
    },
});

export default Progress