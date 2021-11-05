import React, {Component} from 'react';
import {
    View,
    ScrollView
} from 'react-native';
import {
    Founder,
    Mentor,
    DialogSelectMentor
} from './components';
import {
    ModalLoading
} from "../../../components";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";


class ReferralProgram extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mentor: null,

            isOpenLoading: false
        }

        this.isShowMentor = props?.app?.account?.parent;
        this.refDialogSelectMentor = React.createRef();
    }

    componentDidMount = () => {
        this.getMentor();
    }

    getMentor = () => {
        const { parent } = this.props.app.account;

        if (!parent) {
            return null
        }

        axios('get', `${urls["get-user"]}${ parent }`).then((response) => {
            this.setState({
                mentor: response.data.data.user
            })
        })
    }
    onChangeMentor = (parentUserId) => {
        this.setState({isOpenLoading: true});

        axios('put', `${urls["mentor-set"]}`, {
            parentUserId
        }).then( async (response) => {

            await this.updateAccount();

            this.setState({isOpenLoading: false});

            this.refDialogSelectMentor.current.close();

        }).catch((error) => {
            this.setState({isOpenLoading: false});
            const errorData = error.response;
        })
    }
    updateAccount = async () => {
        const user = await axios('get', urls["get-me"]).then((res) => {
           return res.data.data.user;
        });
        this.props.updateAccount(user);
        this.getMentor();
    }

    render() {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <Founder {...this.props} navigation={this.props.navigate}/>

                <View style={{ padding: 12 }}>
                    <Mentor
                        mentor={this.state.mentor}
                        refDialogSelectMentor={this.refDialogSelectMentor}
                    />
                </View>

                <DialogSelectMentor
                    innerRef={this.refDialogSelectMentor}
                    setupParent={this.onChangeMentor}
                />

                <ModalLoading
                    isOpen={this.state.isOpenLoading}
                />

            </ScrollView>
        );
    }
}

export default ReferralProgram
