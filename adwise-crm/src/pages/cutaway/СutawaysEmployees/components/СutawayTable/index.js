import React from 'react'

/* Table */
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import СutawayRow from '../СutawayRow'

const Сutaway = ({cutawayTable, isLoading, onChangeColorUser}) => {
  const {fields, list} = cutawayTable;

  return (
    <TableContainer>
      <Table aria-label="cutaway-table">
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
            return <СutawayRow key={row.id} rowData={row} isLoading={isLoading} onChangeColorUser={onChangeColorUser}/>
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Сutaway
