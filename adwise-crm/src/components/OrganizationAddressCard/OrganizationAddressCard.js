import React from 'react';
import {
    Box,
    Button,
    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import Map from './MapContainer';
import CreateIcon from '@material-ui/icons/Create';



const useStyles = makeStyles((theme) => ({
    box: {
        borderRadius: '5px',
        background:'white',
        width: '420px',
        minHeight: '327px',
        marginBottom: '12px',
        flexDirection: 'column',
        justifyContent: 'left',
        textAlign:'left',
        textTransform:'none',

      },
    boxContent:{
        border: '1px solid #cbccd4',
        borderTop: 'none',
        padding: 16,
        borderRadius: '0 0 5px 5px'
    },
    boxMap:{
        height: 223,
        position: 'relative'
    },
    h6: {
        fontSize: '18px',
        marginBottom: '8px'
    },
    body1: {
        fontSize: '16px',
        marginBottom: '0'
    },
    body2: {
        fontSize: '14px',
        marginBottom: '0',
        color: '#9FA3B7'
    },
    pencil:{
        color:'#8152E4',
        width: 18,
    },
    iconBox:{
        minWidth: 32,
        height: 32,
        position: 'absolute',
        borderRadius: '50%',
        right: 15,
        bottom: -15,
        background:'white',
        boxShadow: '0px 2.46152px 3.69228px rgba(0, 0, 0, 0.25)',
        padding: 0,
        '&:hover': {
            background: '#8152E4'
        },
        '&:hover>span>svg':{
            color: 'white'
        }
    }

}));

  const onClick = (...args) => {
  }

const OrganizationAddressCard = ({title, lat, lng, adress, phone, marker}) => {

    const classes = useStyles();
    const places = [ //Координаты маркера и центра при неоходимости, можно добавлять маркеры
        {
          name: title,
          title: title,
          lat: lat,
          lng: lng,
          id: 1
        },
      ];

    return (
    <Box className={classes.box}>
        <Box className={classes.boxMap}>
        <Map
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAE3aQq2N0eY_LrWgXA9gE6NjnMmaNsHrk"
      //Если убрать стили, то ничего работать не будет. Стили можно менять
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `223px` }} />}
      mapElement={<div style={{ height: `100%`, borderRadius: `5px 5px 0 0` , outline: 'none', cursor: 'none'}} />}
      //Координаты центра
      center={{ lat: lat, lng: lng }}
      //Коофициент увеличения
      zoom={17}
      places={places}
    />
        {marker
        ?(
            <Button className={classes.iconBox}>
                <CreateIcon className={classes.pencil}/>
            </Button>
        )
        :   null
        }

        </Box>
        <Box className={classes.boxContent}>
            <Typography className={classes.h6} variant="h6" gutterBottom>
                {title}
            </Typography>
            <Typography className={classes.body1} variant="body1" gutterBottom>
                {adress}
            </Typography>
            <Typography className={classes.body2} variant="body2" gutterBottom>
                {phone}
            </Typography>
        </Box>
    </Box>
    )
}



export default OrganizationAddressCard
