import React from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Tooltip
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles"
import {
    Skeleton
} from "@material-ui/lab"
import {
    Download as DownloadIcon
} from "react-feather";
import moment from "moment";
import {getMediaFile, getMediaUrl} from "../../../../../common/media";

const Documents = (props) => {
    const { documents, isLoading } = props;
    const classes = useStyles();

    const handleDownloadDocument = (doc) => {
        const { documentMedia } = doc;
        const documentUrl = getMediaUrl(documentMedia);

        let link = document.createElement('a');
        document.body.appendChild(link);
        link.download = 'act';
        link.target = '_blank';
        link.href = documentUrl;
        link.click();
        document.body.removeChild(link);


    }

    return (
        <>

            <Table>

                <TableHead>
                    <TableRow>
                        <TableCell>Дата создания акта</TableCell>
                        <TableCell>Период акта</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>

                    {
                        isLoading ? (
                            <>
                                {[0, 1, 2, 3, 4, 5].map((item) => (
                                    <TableRow key={`document-loading-${item}`}>
                                        <TableCell><Skeleton/></TableCell>
                                        <TableCell><Skeleton/></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <>
                                {
                                    documents.map((document, idx) => (
                                        <TableRow key={`document-${idx}`}>
                                            <TableCell>{moment(document.timestamp).format('DD.MM.YYYY')}</TableCell>
                                            <TableCell>
                                                С {moment(document.options.dateFrom).format('DD.MM.YYYY')} по {moment(document.options.dateTo).format('DD.MM.YYYY')}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Скачать акт" arrow>
                                                    <IconButton onClick={() => handleDownloadDocument(document)}>
                                                        <DownloadIcon color="#93D36C"/>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </>
                        )
                    }

                </TableBody>

            </Table>

        </>
    )
}

const useStyles = makeStyles(() => ({

    document: {}

}));

export default Documents
