import React, {Component} from 'react';
import {
    Box,
    Typography
} from '@material-ui/core';
import DownloadDocument from '../../../components/DownloadDocument/DownloadDocument';

class OrganizationDocuments extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount = () => {
    }

    render() {
        return (
            <Box>
                <Box mb={5}>
                    <Typography variant="h1" gutterBottom>
                        Документы
                    </Typography>
                </Box>
                <Box style={{display: 'flex', flexDirection: 'column'}}>
                    <DownloadDocument title='Условия оферты тарифа «Smart+» (900+30) — Продажа'/>
                    <DownloadDocument title='Условия оферты тарифа «Start» (100) — Продажа'/>
                    <DownloadDocument title='Политика конфиденциальности'/>
                </Box>
            </Box>
        );
    }
}

export default OrganizationDocuments
