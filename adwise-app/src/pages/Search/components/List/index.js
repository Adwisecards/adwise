import React, {PureComponent} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,

    SectionList,
    SafeAreaView,
} from "react-native";
import {
    Icon
} from "native-base";
import OrganizationCard from "../Card";

class List extends PureComponent {

    _renderItem = (data) => {
        if (data.index > 0) {
            return null
        }

        return (
            <View style={styles.list}>
                {
                    data.section.data.map((organization, idx) => (
                        <OrganizationCard
                            key={`organization-card-${idx}`}
                            organization={organization}
                            routeOrganization={this.props.routeOrganization}
                        />
                    ))
                }
            </View>
        )
    }
    _renderSectionHeader = (data) => {
        return (
            <View style={styles.header}>

                <Text style={styles.headerTitle}>{data?.section?.title}</Text>

            </View>
        )
    }

    render() {
        const {
            sections
        } = this.props;

        return (
            <SafeAreaView style={{flex: 1}}>
                <SectionList
                    contentContainerStyle={{paddingHorizontal: 12}}
                    sections={sections}
                    renderSectionHeader={this._renderSectionHeader}
                    renderItem={this._renderItem}
                    stickySectionHeadersEnabled={false}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    headerTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 26,
        color: '#25233E'
    },
    headerIcon: {
        color: '#8152E4',
        fontSize: 20
    },

    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: -12,
        marginBottom: 20
    }

});

export default List
