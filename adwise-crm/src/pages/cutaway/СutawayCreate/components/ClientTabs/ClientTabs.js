import React, {useState} from 'react'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import {makeStyles} from '@material-ui/core/styles'

import ClientTabLabel from './ClientTabLabel'
import ClientTabPanel from './ClientTabPanel'
import TabTable from '../TabTable'
import {Search as SearchIcon} from "react-feather";

const useStyles = makeStyles({
  tabsWrapper: {
    marginTop: '20px',
  },
  appBar : {
    marginBottom: '20px',
    width: '100%',
    flexDirection: 'row',
    alignContent: 'center'
  },
  searchInput: {
    marginLeft: '16px',
    width: '100%',
    '& input': {
        height: 32
    }
},
})

function a11yProps(index, isLoading) {
  return {
    id: `client-tab-${index}`,
    'aria-controls': `client-tabpanel-${index}`,
    disabled: isLoading,
  }
}

const ClientTabs = ({tabsData, isLoading}) => {
  const [activeTab, setActiveTab] = useState(0)
  const {tableData} = tabsData
  const classes = useStyles()

  tableData.fields = [
    {
      headerName: '',
      field: 'empty',
      align: 'left',
      colSpan: '2',
    },
    {
      headerName: 'Сотрудник',
      field: 'employee',
      align: 'left',
      colSpan: null,
    },
    {
      headerName: 'Телефон',
      field: 'phone',
      align: 'left',
      colSpan: null,
    },
    {
      headerName: 'Почта',
      field: 'email',
      align: 'left',
      colSpan: null,
    },
    {
      headerName: 'Роль',
      field: 'role',
      align: 'left',
      colSpan: null,
    },
  ];

  const handleChange = (event, toActiveTab) => {
    setActiveTab(toActiveTab)
  }

  return (
    <Grid container alignItems="center" item xs={12} className={classes.tabsWrapper}>
      {/*<AppBar position="static" className={classes.appBar}>*/}
      {/*  <Tabs value={activeTab} onChange={handleChange}  aria-label="clientTabs">*/}
      {/*    <Tab*/}
      {/*      label={<ClientTabLabel title="Список сотрудников" isLoading={isLoading} value={activeTab} index={0} />}*/}
      {/*      {...a11yProps(0, isLoading)}*/}
      {/*    />*/}
      {/*    <Tab*/}
      {/*      label={*/}
      {/*        <ClientTabLabel title="Код пользователя" isLoading={isLoading} value={activeTab} index={1} />*/}
      {/*      }*/}
      {/*      {...a11yProps(1, isLoading)}*/}
      {/*    />*/}
      {/*  </Tabs>*/}
      {/*  <Grid item xs={5}>*/}
      {/*        <TextField*/}
      {/*            variant={'outlined'}*/}
      {/*            className={classes.searchInput}*/}
      {/*            placeholder={'Поиск'}*/}
      {/*            InputProps={{*/}
      {/*                endAdornment: (*/}
      {/*                    <InputAdornment position="end">*/}
      {/*                        <SearchIcon color={'#966EEA'} width={20}/>*/}
      {/*                    </InputAdornment>*/}
      {/*                ),*/}
      {/*            }}*/}
      {/*        />*/}
      {/*  </Grid>*/}
      {/*</AppBar>*/}
      <ClientTabPanel value={activeTab} index={0}>
        <TabTable tableData={tableData} isLoading={isLoading} />
      </ClientTabPanel>
      <ClientTabPanel value={activeTab} index={1}>
        Item Two
      </ClientTabPanel>
    </Grid>
  )
}

export default ClientTabs
