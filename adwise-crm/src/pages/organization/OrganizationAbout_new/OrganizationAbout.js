import React from "react";
import {
    Box,
    Grid,
    Typography
} from "@material-ui/core";
import {
    Header as HeaderComponent,
    Navigations as NavigationsComponent
} from "./components";
import {
     Organization as OrganizationTab
} from "./tabs";

class OrganizationAbout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            navigation: "organization",

            isCreated: false
        };

        this.refOrganizationTab = React.createRef();
    }

    componentDidMount = async () => {
        await this.initState();
    }

    initState = async () => {
        await this.setState({isCreated: !Boolean(this.props?.global?._id)});

        await this.initOrganizationForm();
    }
    initOrganizationForm = async () => {
        const { global } = this.props;
        const { organization } = global;

        let form = {...organization};
        form['legal.form'] = form?.legal?.form || ""

        this.onChangeOrganizationForm(form || {});
    }

    // Логика создания / обновления организации
    onSaveOrganization = async () => {}
    onCreateOrganization = async () => {}
    onUpdateOrganization = async () => {}
    // -----------------------------------------

    // Логика изменения данных организации
    onChangeOrganizationForm = (organizationForm) => {
        this.refOrganizationTab.current?.setValues(organizationForm);
    }
    // -----------------------------------

    _getTabsNavigations = () => {
        let navigations = [
            {
                label: "О компании",
                value: "organization",
            }
        ];

        return navigations
    }

    render() {
        const {
            global
        } = this.props;
        const {
            navigation,

            isCreated
        } = this.state;

        return (
            <>

                <Box mb={4}>
                    <HeaderComponent
                        organizationName={global?.organization?.name || ""}
                        organizationDisabled={global?.organization?.disabled || ""}
                    />
                </Box>

                <Box mb={5}>
                    <NavigationsComponent
                        value={navigation}
                        items={this._getTabsNavigations()}
                        onChange={() => this.setState({navigation})}
                    />
                </Box>

                <Box>

                    {
                        Boolean(navigation === "organization") && (
                            <OrganizationTab
                                innerRef={this.refOrganizationTab}
                                isCreated={isCreated}
                                onChange={this.onChangeOrganizationForm}
                            />
                        )
                    }

                </Box>

            </>
        )
    }
}

export default OrganizationAbout
