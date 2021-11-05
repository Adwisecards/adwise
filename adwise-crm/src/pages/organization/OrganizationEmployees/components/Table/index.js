import React from "react";
import {
    Box,
    Grid,
    Avatar,
    Typography,
    Switch,
    Tooltip,

    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from "@material-ui/core";
import {
    Pagination,
    Skeleton
} from "@material-ui/lab";
import employeeRole from "../../../../../constants/employeeRole";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import {useHistory} from "react-router-dom";
import {formatMoney} from "../../../../../helper/format";

const TableEmployees = (props) => {
    const {rows, isLoading, onChangeDisabled} = props;

    return (
        <>

            <Box mb={2}></Box>

            <Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{allTranslations(localization.employeesTableHeaderManager)}</TableCell>
                            <TableCell>{allTranslations(localization.employeesTableHeaderActivity)}</TableCell>
                            <TableCell>{allTranslations(localization.employeesTableHeaderPhone)}</TableCell>
                            <TableCell>{allTranslations(localization.employeesTableHeaderEmail)}</TableCell>
                            <TableCell>{allTranslations(localization.employeesTableHeaderRating)}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>

                    {
                        isLoading && (
                            <TableBody>
                                <RowLoading/>
                                <RowLoading/>
                                <RowLoading/>
                                <RowLoading/>
                            </TableBody>
                        )
                    }

                    {
                        !isLoading && (
                            <TableBody>
                                {
                                    rows.map((row, idx) => (
                                        <Row
                                            key={`employee-${ idx }`}
                                            isSuper={idx === 0}
                                            onChangeDisabled={onChangeDisabled}
                                            { ...row }
                                        />
                                    ))
                                }
                            </TableBody>
                        )
                    }
                </Table>
            </Box>

            <Box mt={2}></Box>

        </>
    )
};

const RowLoading = () => {
    return (
        <TableRow>
            <TableCell><Skeleton height={40}/></TableCell>
            <TableCell><Skeleton height={40}/></TableCell>
            <TableCell><Skeleton height={40}/></TableCell>
            <TableCell><Skeleton height={40}/></TableCell>
            <TableCell><Skeleton height={40}/></TableCell>
            <TableCell><Skeleton height={40}/></TableCell>
        </TableRow>
    )
}
const Row = (row) => {

    const history = useHistory();

    const handleToCashier = () => {
        history.push(`/employee/${ row._id }`);
    }

    return (
        <TableRow hover onClick={handleToCashier}>
            <TableCell>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Avatar
                            src={row?.contact?.picture?.value}
                        />
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">{ row?.contact?.lastName?.value }</Typography>
                        <Typography variant="body1">{ row?.contact?.firstName?.value }</Typography>
                    </Grid>
                </Grid>
            </TableCell>

            <TableCell><Typography variant="h6">{ employeeRole[row.role] }</Typography></TableCell>

            <TableCell><Typography variant="h6">{ row?.user?.phone || row?.user?.phoneInfo || '-' }</Typography></TableCell>

            <TableCell><Typography variant="h6">{ row?.user?.email || row?.user?.emailInfo || '-' }</Typography></TableCell>

            <TableCell><Typography variant="h5" style={{ color: '#8152E4' }}>{ formatMoney(row.rating, 1, '.') }</Typography></TableCell>

            <TableCell align="right">
                {
                    Boolean(!row.isSuper) && (
                        <Tooltip arrow title={row.disabled ? allTranslations(localization.employeesTableBodyActiveEmploy) : allTranslations(localization.employeesTableBodyDisabledEmploy)}>
                            <Switch
                                color="primary"
                                checked={!row.disabled}

                                disabled={row.isSuper}

                                onClick={() => row.onChangeDisabled(row)}
                            />
                        </Tooltip>
                    )
                }
            </TableCell>

        </TableRow>
    )
}

export default TableEmployees
