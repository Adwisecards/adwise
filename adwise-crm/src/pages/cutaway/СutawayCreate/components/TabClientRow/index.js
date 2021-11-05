import React, {useState}  from 'react'
import Typography from '@material-ui/core/Typography'
import Radio from '@material-ui/core/Radio'
import Avatar from '@material-ui/core/Avatar'
import {makeStyles} from '@material-ui/core/styles'
/* Table */
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import {Skeleton} from '@material-ui/lab'

import {RadioIcon, RadioIconCheked, PlugsOrganizationDefaultUser} from '../../../../../icons'

const useStyles = makeStyles({
  radio: {
    marginLeft: '16px',
    width: '46px',
  },
  tableRadio: {
    padding: '4px',
    margin: 'auto',
    display: 'block',
  },
  defaultFoto: {
    textAlign: 'center',
    width: '40px',
    height: '40px'
  },
  avatar: {
    margin: 'auto'
  }
})

const TabClientRow = ({rowData, isLoading}) => {
  const [selectedValue, setSelectedValue] = useState(false)
  const {picture, firstName, lastName, phone, email, role } = rowData
  const classes = useStyles()

  const handleChange = (event) => {
    setSelectedValue((prev) => !prev)
  }


  if (isLoading) {
    return (
      <TableRow>
        <TableCell width={45}>
          <Skeleton height={35} />
        </TableCell>
        <TableCell size="small" width={45} >
          <Skeleton variant="circle" height={40} width={40}/>
        </TableCell>
        <TableCell width={215}>
          <Skeleton height={35} />
        </TableCell>
        <TableCell>
          <Skeleton height={35} />
        </TableCell>
        <TableCell>
          <Skeleton height={35} />
        </TableCell>
        <TableCell>
          <Skeleton height={35} />
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow selected={selectedValue}>
      <TableCell className={classes.radio}>
        <Radio
          checked={selectedValue}
          icon={<RadioIcon />}
          checkedIcon={<RadioIconCheked />}
          onClick={handleChange}
          className={classes.tableRadio}
        />
      </TableCell>
      <TableCell align="center" width={45}>
        {picture.value
            ? <Avatar alt="Аватар" src={picture.value} className={classes.avatar}/>
            : <PlugsOrganizationDefaultUser className={classes.defaultFoto}/>
          }
      </TableCell>
      <TableCell scope="row" align="left">
      <Typography variant="h6" component="h6">
            {`${firstName.value} ${lastName.value}`}
          </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="body1">
          {phone.value}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="body1">
          {email.value}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="body1">
          {role.join(', ')}
        </Typography>
      </TableCell>
    </TableRow>
  )
}

export default TabClientRow
