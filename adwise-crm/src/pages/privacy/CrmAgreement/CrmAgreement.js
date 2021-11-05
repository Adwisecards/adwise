import React, {Component} from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
import {Document, Page, pdfjs} from "react-pdf/dist/umd/entry.webpack";

import PrivacyPolicy from '../../../documents/crm-agreement.pdf';
import {Box, Grid, IconButton} from "@material-ui/core";
import {Download as DownloadIcon} from "react-feather";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class CrmAgreement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numPages: 1
        };
    }

    render() {
        return (
            <div>

                <Box>

                    <Grid container justify="flex-end">

                        <Grid item>

                            <IconButton download href="/files/crm-agreement.pdf">

                                <DownloadIcon color="#8152E4"/>

                            </IconButton>

                        </Grid>

                    </Grid>

                </Box>

                <Document
                    file={PrivacyPolicy}
                    onLoadSuccess={({numPages}) => this.setState({numPages})}
                >
                    {Array.apply(null, Array(this.state.numPages))
                        .map((x, i) => i + 1)
                        .map(page => (
                            <Page
                                pageNumber={page}
                                scale={1.9}
                            />
                        ))}
                </Document>
            </div>
        );
    }
}

export default CrmAgreement
