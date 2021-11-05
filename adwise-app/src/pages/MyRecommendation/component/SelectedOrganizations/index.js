import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Dimensions
} from "react-native";
import Carousel, {
    Pagination
} from "react-native-snap-carousel";
import {OrganizationCard} from "../index";

const { width, height } = Dimensions.get('window');

class SelectedOrganizations extends PureComponent{
    constructor(props) {
        super(props);

        this.state = {
            activeIndexPagination: 0
        };
    }


    onSnapToItem = (activeIndexPagination) => {
        this.setState({
            activeIndexPagination
        })
    }

    _renderSliderItem = ({item}) => {
        return (
            <OrganizationCard
                organization={item}
                isFavorite={true}
                disableSwipe
                routeCompany={this.props.routeCompany}
            />
        )
    }

    render() {
        const {
            activeIndexPagination
        } = this.state;
        const {
            list
        } = this.props;

        if (list.length < 0) {
            return null
        }

        return (
            <View style={{marginBottom: 24}}>

                <View style={{marginHorizontal: -12}}>

                    <Carousel
                        data={list}
                        itemWidth={width - 24}
                        sliderWidth={width}
                        renderItem={this._renderSliderItem}
                        onSnapToItem={this.onSnapToItem}
                    />

                </View>

                <View>
                    <Pagination
                        activeDotIndex={activeIndexPagination}
                        dotsLength={list.length}

                        dotColor="#8152E4"
                        inactiveDotColor="#C4C4C4"
                        inactiveDotOpacity={1}

                        containerStyle={styles.paginationContainerStyle}
                        dotContainerStyle={styles.paginationDotContainerStyle}
                        dotStyle={styles.paginationDotStyle}
                        inactiveDotStyle={styles.paginationDotStyle}
                    />
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        marginBottom: 32
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 12
    },
    title: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 25,
        color: '#000000'
    },

    paginationDotStyle: {
        width: 8,
        height: 8
    },
    paginationContainerStyle: {
        marginTop: 8,
        paddingVertical: 0
    },
    paginationDotContainerStyle: {
        marginHorizontal: 3
    },

    cardEmpty: {
        marginHorizontal: 12,
        padding: 16,
        borderRadius: 10,
        backgroundColor: 'white'
    },
    cardEmptyText: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 20,
        color: '#000000'
    },
});

export default SelectedOrganizations
