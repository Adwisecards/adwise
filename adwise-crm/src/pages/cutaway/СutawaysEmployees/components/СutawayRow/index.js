import React from 'react'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import {makeStyles} from '@material-ui/core/styles'
import {
    Tooltip,
    IconButton
} from "@material-ui/core";
/* Table */
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import {Skeleton} from '@material-ui/lab'
import {
    Edit2 as Edit2Icon
} from "react-feather";

import {PlugsOrganizationDefaultUser} from '../../../../../icons'
import employeeRole from "../../../../../constants/employeeRole";

const useStyles = makeStyles({
    defaultFoto: {
        width: '40px',
        height: '40px',
    },
    sceletonAvatar: {
        width: '50px',
    }
})

const СutawayRow = ({rowData, isLoading, onChangeColorUser}) => {
    const {contact, role, user} = rowData;
    const {picture, firstName, lastName, office, activity, phone, email} = contact
    const classes = useStyles()

    if (isLoading) {
        return (
            <TableRow>
                <TableCell size="small" width={45}>
                    <Skeleton variant="circle" height={40} width={40}/>
                </TableCell>
                <TableCell width={215}>
                    <Skeleton height={35}/>
                </TableCell>
                <TableCell>
                    <Skeleton height={35}/>
                </TableCell>
                <TableCell>
                    <Skeleton height={35}/>
                </TableCell>
                <TableCell>
                    <Skeleton height={35}/>
                </TableCell>
                <TableCell>
                    <Skeleton height={35}/>
                </TableCell>
                <TableCell>
                    <Skeleton height={40} width={40}/>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <TableRow>
            <TableCell scope="row" align="center">
                {picture.value
                    ? <Avatar alt="Аватар" src={picture.value}/>
                    : <PlugsOrganizationDefaultUser className={classes.defaultFoto}/>
                }
            </TableCell>
            <TableCell scope="row" align="left">
                <Typography variant="h6" component="h6">
                    {firstName.value}<br/>{lastName.value}
                </Typography>
            </TableCell>

            <TableCell align="left">
                <Typography variant="body1">
                    {employeeRole[role]}
                </Typography>
            </TableCell>

            <TableCell align="left">
                <Typography variant="body1">
                    {user?.phone || user?.phoneInfo || ''}
                </Typography>
            </TableCell>

            <TableCell align="left">
                <Typography variant="body1">
                    {user?.email || user?.emailInfo || ''}
                </Typography>
            </TableCell>

            <TableCell align="left">
                <Tooltip title="Изменить цвет визитной карточки" arrow>
                    <IconButton onClick={() => onChangeColorUser(rowData)}>
                        <Edit2Icon color="#8152E4"/>
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    )
}

export default СutawayRow
