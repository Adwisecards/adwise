import React, {Component} from 'react';
import {
    Box,
    Typography,
} from "@material-ui/core";
import {
    Documents as DocumentsComponent
} from "./components";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";

class OrganizationActs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            acts: [],

            isLoading: true
        }
    }

    componentDidMount = async () => {

        await this.getActs();

    }

    getActs = async () => {
        const { organization } = this.props.global;

        const acts = await axiosInstance.get(`${ urls["legal-get-organization-documents"] }/${ organization?._id }?type=withdrawalAct`).then((response) => {
            return response.data.data.organizationDocuments.reverse()
        }).catch(() => {
            return []
        })

        this.setState({
            acts,
            isLoading: false
        })
    }

    render() {
        const {
            acts,
            isLoading
        } = this.state;

        return (
            <>

                <Box mb={3}>

                    <Typography variant="h1">Акты</Typography>

                </Box>

                <DocumentsComponent
                    documents={acts}
                    isLoading={isLoading}
                />

            </>
        );
    }
}

export default OrganizationActs
