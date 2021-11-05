import React from 'react';
import {
    View,
    Animated,
    Dimensions,
    StyleSheet
} from 'react-native';
import {Text} from 'native-base';
import i18n from 'i18n-js';
import {
    Working,
    Personal
} from '../../../../components';
import commonStyles from '../../../../theme/variables/commonStyles';
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const {width} = Dimensions.get('window');
const snapToInterval = width - 38;
const widthCard = width;

const Section = (props) => {
    const {title, cards, type, onOpenShare} = props;

    if (!cards || cards.length <= 0) {
        return null
    }

    return (
        <View style={stylesSection.root}>
            <Text style={[commonStyles.titleSection, stylesSection.titleSection]}>{title}</Text>

            <View style={stylesSection.list}>
                {
                    cards.map((card, idx) => {
                        if (type === 'personal') {
                            delete card.ref;

                            return (
                                <View key={`personal-card-${ idx }`} style={styles.cardContainer}>
                                    <Personal
                                        widthCard={widthCard}
                                        key={'personal-card-' + idx}
                                        onOpenShare={onOpenShare}
                                        {...props}
                                        {...card}
                                    />
                                </View>
                            )
                        } else if (type === 'work') {
                            delete card.ref;

                            return (
                                <View key={`work-card-${ idx }`} style={styles.cardContainer}>
                                    <Working
                                        widthCard={widthCard}
                                        key={'work-card-' + idx}
                                        onOpenShare={onOpenShare}
                                        {...props}
                                        {...card}
                                    />
                                </View>
                            )
                        }
                    })
                }
            </View>
        </View>
    )
}

const MyCards = (props) => {
    const {list, onChangeSnap, onOpenShare, setRef, onScroll, onMomentumScrollEnd} = props;

    return (
        <Animated.ScrollView
            ref={setRef}

            snapToInterval={snapToInterval}
            bounces={false}
            style={styles.root}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 8, paddingHorizontal: 12}}

            overScrollMode={'never'}

            horizontal
            pagingEnabled
            disableIntervalMomentum

            onScroll={onScroll}
            onMomentumScrollEnd={onMomentumScrollEnd}
        >
            <View style={styles.container}>
                {
                    (list.personal && list.personal.length > 0) && (
                        <Section
                            title={allTranslations(localization.dashboardBusinessCardsPersonal)}
                            type={'personal'}
                            cards={list.personal}
                            onOpenShare={onOpenShare}
                            {...props}
                        />
                    )
                }
                {
                    (list.work && list.work.length > 0) && (
                        <Section
                            title={allTranslations(localization.dashboardBusinessCardsWorking)}
                            type={'work'}
                            cards={list.work}
                            onOpenShare={onOpenShare}
                            {...props}
                        />
                    )
                }
            </View>
        </Animated.ScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        width: width
    },

    container: {
        flexDirection: "row",
        marginLeft: 38
    },

    cardContainer: {
        width: widthCard,
        paddingRight: 50,
        marginLeft: -38
    }
});
const stylesSection = StyleSheet.create({
    root: {},
    titleSection: {
        marginLeft: -38
    },
    title: {
        fontSize: 18,
        lineHeight: 25,
        marginBottom: 12
    },
    list: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default MyCards
