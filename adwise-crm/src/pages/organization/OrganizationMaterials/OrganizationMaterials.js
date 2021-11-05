import React, {Component} from 'react';
import {
    Box,
    Typography
} from '@material-ui/core';
import {
    Skeleton
} from '@material-ui/lab';
import urls from "../../../constants/urls";
import axiosInstance from "../../../agent/agent";
import DownloadDocument from '../../../components/DownloadDocument/DownloadDocument';
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import {getMediaUrl} from "../../../common/media";


class OrganizationMaterials extends Component {
    constructor(props) {
        super(props);

        this.state = {
            documents: []
        }
    }

    componentDidMount = async () => {
        await this.getDocuments();
    }

    getDocuments = async () => {

        const documents = await axiosInstance.get(`${urls['documents-get']}/crm`).then((res) => {
            return res.data.data.documents
        })

        this.setState({
            documents
        })

    }

    onDownLoadDocument = (link) => {
        var anchor = document.createElement('a');
        anchor.setAttribute('href', link);
        anchor.setAttribute('download', '');
        document.body.appendChild(anchor);
        anchor.click();
        anchor.parentNode.removeChild(anchor);
    }

    render() {
        const {documents} = this.state

        return (
            <Box>
                <Box mb={5}>
                    <Typography variant="h1" gutterBottom>{allTranslations(localization.materialsTitle)}</Typography>
                </Box>
                <Box style={{display: 'flex', flexDirection: 'column'}}>
                    {documents.map((document) => {
                        return <DownloadDocument
                            key={`document-${document._id}`}
                            onClick={() => this.onDownLoadDocument(getMediaUrl(document.file))}
                            link={getMediaUrl(document.file)}
                            title={document.name}
                            text={document.description}
                        />
                    })}
                </Box>
            </Box>
        );
    }
}


export default OrganizationMaterials
