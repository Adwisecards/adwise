import React from 'react'
import { Tooltip } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'

import {getRGBAfromHEX} from '../../../../../utils/getRGBAfromHEX';
import {CutawayWork} from '../../../../../components'
import СutawayTable from '../СutawayTable'

const useStyles = makeStyles({
  header: {
    marginBottom: '32px',
  },
  card: {
    marginBottom: '32px',
  },
  title: {
    marginRight: '12px',
  },
  circle: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
  },
  btn: {
    padding: '0 12px',
    fontSize: '12px',
    color: '#966EEA',
    maxHeight: '26px'
  },
  tableTitle: {
    fontSize: '16px',
  }
})

const СutawayContent = ({isLoading, cutaway, employees, color, onChangeColor, onChangeColorUser}) => {
  const classes = useStyles()
  const {person, company, showBackSide} = cutaway

  const cutawayTable = {
    fields: [
      {
        headerName: 'Сотрудник',
        field: 'employee',
        align: 'left',
        colSpan: '2',
      },
      {
        headerName: 'Должность',
        field: 'office',
        align: 'left',
        colSpan: null,
      },
      {
        headerName: 'Телефон',
        field: 'office',
        align: 'left',
        colSpan: null,
      },
      {
        headerName: 'Почта',
        field: 'office',
        align: 'left',
        colSpan: null,
      },
    ],
  }
  cutawayTable.list = employees

  const firColor = getRGBAfromHEX(color);

  return (
    <>
      <Grid container alignContent="center" alignItems="center" justify="space-between" item xs={12} className={classes.header}>
        <Grid container alignItems="center" item xs={8}>
          <Typography variant="h3" component="h3" className={classes.title}>
            Визитка с фирменным цветом
          </Typography>
          {isLoading
            ? <CircularProgress size={18} />
            : <Typography variant="body1" component="span" className={classes.circle} style={{backgroundColor: firColor}}></Typography>
          }
        </Grid>
        <Tooltip title="Изменить цвет визитных карточек" arrow>
          <Button variant="contained" color="secondary" className={classes.btn} onClick={() => onChangeColor(cutawayTable)}>
            Изменить
          </Button>
        </Tooltip>
      </Grid>
      <Grid item xs={12} className={classes.card}>
        <CutawayWork colorCard={color} person={person} company={company} showBackSide={showBackSide}/>
      </Grid>
      <Grid container item xs={12}>
        <Typography variant="h5" component="h5" className={classes.tableTitle}>
          Кому назначена
        </Typography>
        <СutawayTable cutawayTable={cutawayTable} isLoading={isLoading} onChangeColorUser={onChangeColorUser}/>
      </Grid>
    </>
  )
}

export default СutawayContent
