import React, {useState} from 'react'
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {Skeleton} from '@material-ui/lab'
/* Table */
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import TabClientRow from '../TabClientRow'


const useStyles = makeStyles({
  pagination: {
    margin: '32px 0 40px',
  },
  select: {
    
    '& .MuiOutlinedInput-input': {
      fontSize: '13px',
      padding: '6px 34px 6px 12px'
    }
  },
});

const NextButtonPagination = ({...props}) => {


  return(
    <Grid {...props}>
      Вперёд
      <svg className={"MuiSvgIcon-root MuiPaginationItem-icon"}
           style={{marginLeft: '5px',}}
           focusable="false"
           viewBox="0 0 24 24"
           aria-hidden="true">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
      </svg>
    </Grid>
  )
}


const TabTable = ({tableData, isLoading}) => {
  const {total, fields, list} = tableData
  const [rowsTotal, setRowsTotal] = useState(24);
  const classes = useStyles()

  const handeleChangePage = () => {
  }

  const rowsTotalValues = [24, 12];

  return (
    <TableContainer>
      <Table aria-label="client-table">
        <TableHead>
          <TableRow>
            {fields.map(({headerName, field, align, colSpan}) => (
              <TableCell align={align} key={field} colSpan={colSpan ? colSpan : ''}>
                {headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((row) => {
            return <TabClientRow key={row.id} rowData={row} isLoading={isLoading} />
          })}
        </TableBody>
      </Table>
      <Grid container justify="space-between" className={classes.pagination}>
        <Grid item>
          {isLoading 
          ? <Skeleton width={85} height={40} />
          : <Pagination count={total}
                onChange={handeleChangePage}
                hidePrevButton
                shape='rounded'
                color="primary"
                renderItem={(item) => {
                  return <PaginationItem
                    component={item.type === 'next' ? NextButtonPagination: Grid}
                    {...item}
                  />
                }}
                />
        }

        </Grid>
        <Grid item xs={2}>
          <Select
              value={rowsTotal}
              variant={'outlined'}
              fullWidth
              className={classes.select}
          >
              {
                  rowsTotalValues.map((item) => (
                      <MenuItem
                          value={item} key={item} onClick={() => setRowsTotal(item)}>{`Показывать по ${item}`}</MenuItem>
                  ))
              }
          </Select>
          </Grid>
      </Grid>

    </TableContainer>
  )
}

export default TabTable
