import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    Dimensions, Animated
} from 'react-native';
import {CompanyPageBackground, CompanyPageLogo, PersonalBusinessPage} from "../../../../../icons";
import {RoundContainerStubs} from "../../../../../components/plugs";

const {height} = Dimensions.get('window');

const Header = (props) => {
    const {
        organization,
        headerImageOpacity, color
    } = props;

    const showBackground = organization && !!organization.mainPicture;
    const showLogo = organization && !!organization.picture;

    return (
        <View style={[styles.root, { backgroundColor: color }]}>
            <View style={{width: 140, height: 140}}>
                {
                    showLogo ? (
                        <RoundContainerStubs styleRoot={{flex: 1}}>
                            <View style={{flex: 1}}>
                                <Image
                                    style={styles.imageLogo}
                                    resizeMode={'cover'}
                                    source={{uri: organization.picture}}
                                />
                            </View>
                        </RoundContainerStubs>
                    ) : (
                        <CompanyPageLogo color={color}/>
                    )
                }
            </View>

            {
                showBackground ? (
                    <Image
                        style={[
                            styles.backgroundImage,
                            {
                                opacity: headerImageOpacity
                            }
                        ]}
                        resizeMode={'cover'}
                        source={{uri: organization.mainPicture}}
                    />
                ) : (
                    <View style={[styles.headerPug]}>
                        <CompanyPageBackground color={color}/>
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        height: 220,

        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },

    backgroundImage: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: -1
    },

    imageLogo: {
        flex: 1,

        borderRadius: 999,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#8152E4'
    },

    headerPug: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: -1
    },
});

Header.defaultProps = {
    color: '#007BED',
    organization: {}
}

export default Header
