import React from 'react'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles({
  labelText: {
    fontSize: '18px',
    textTransform: 'none',
  },
})

const ClientTabLabel = ({title}) => {
  const classes = useStyles()

  return (
    <>
      <Typography variant="body1" component="span" className={classes.labelText}>
        {title}
      </Typography>
    </>
  )
}

export default ClientTabLabel
