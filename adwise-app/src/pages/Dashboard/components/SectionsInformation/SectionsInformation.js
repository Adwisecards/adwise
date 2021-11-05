import React, { PureComponent, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView
} from 'react-native';

import Section from "./Section";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const {width} = Dimensions.get('window');
const snapToInterval = width;

class SectionsInformation extends PureComponent{
    constructor(props) {
        super(props);

        this.refScrollView = React.createRef();
    }


    render() {
        const {list, isDisabled} = this.props;
        const listMap = [...list.personal, ...list.work];

        return (
            <View style={styles.root}>
                {
                    isDisabled && (
                        <>
                            <Text style={styles.disabledText}>{allTranslations(localization.dashboardBusinessCardsInstalledActiveBusinessCard)}</Text>

                            <View style={styles.disabled}/>
                        </>
                    )
                }

                <ScrollView
                    ref={this.refScrollView}

                    bounces={false}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}


                    decelerationRate={50}
                    scrollEventThrottle={100}

                    horizontal
                    pagingEnabled
                    disableIntervalMomentum
                >
                    {
                        listMap.map((item, idx) => (
                            <View
                                key={'sections-information-' + idx}
                                style={[styles.containerSection]}
                            >
                                <Section {...item} {...this.props}/>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        width: width,
        marginLeft: -12
    },

    containerSection: {
        width: width,
        paddingHorizontal: 12
    },

    disabled: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        backgroundColor: "rgba(0, 0, 0, 0)"
    },
    disabledText: {
        fontFamily: "AtypText",
        fontSize: 12,
        lineHeight: 14,
        marginHorizontal: 12,
        marginBottom: 8,
        opacity: 0.6
    }
});

export default SectionsInformation
