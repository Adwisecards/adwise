import React from 'react'
import Grid from '@material-ui/core/Grid'

const TabPanel = (props) => {
  const {children, value, index, ...other} = props

  return (
    <Grid
      container
      item
      xs={12}
      role="tabpanel"
      hidden={value !== index}
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && <Grid container>{children}</Grid>}
    </Grid>
  )
}

export default TabPanel
