import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Platform,
} from 'react-native';
import commonStyles from "../../theme/variables/commonStyles";
import {
    Page,
    HeaderControlsButtons
} from "../../components";
import {
    Icon
} from 'native-base';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import getHeightStatusBar from "../../helper/getHeightStatusBar";

const heightStatusBar = getHeightStatusBar();

class SchedulerInformation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scheduler: {},

            participants: [],
            listConnections: [],

            isLoading: false,
        }
    }

    componentDidMount = () => {
        this.loadTask()
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    loadTask = () => {
        let idTask = this.props.navigation.state.params.id;

        axios('get', urls["get-task"] + idTask).then((response) => {
            this.setState({
                scheduler: response.data.data.task
            })
        })
    }

    render() {
        const scheduler = this.state.scheduler;

        return (
            <Page style={[styles.page, {paddingTop: heightStatusBar}]}>
                <View style={{ minHeight: 80 }}>
                    <HeaderControlsButtons
                        active={'scheduler'}
                        styleContainer={{...styles.controlContainer, ...commonStyles.container}}
                        { ...this.props }
                    />
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={commonStyles.container}
                >
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.buttonBack} onPress={this.goBack}>
                            <Icon name={'arrow-left'} type={'Feather'} style={{ color: '#8152E4' }}/>
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>{ scheduler.name }</Text>
                    </View>

                    <Text>{ scheduler.description }</Text>
                </ScrollView>
            </Page>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerShown: false
        };
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    controlContainer: {
        marginLeft: -12,
        marginBottom: 15
    },

    header: {
        flexDirection: 'row',

        marginBottom: 16
    },
    headerTitle: {
        fontSize: 24,
        lineHeight: 30,

        fontFamily: 'AtypText_medium',
        marginLeft: 16
    },



    buttonBack: {
        margin: -8,
        padding: 8,
    },
})

export default SchedulerInformation
