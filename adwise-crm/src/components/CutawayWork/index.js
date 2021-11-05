import React from 'react';
import {Box, Grid, Typography, Avatar, Tooltip} from '@material-ui/core';

import {makeStyles} from '@material-ui/core/styles'
import {getRGBAfromHEX} from '../../utils/getRGBAfromHEX';
import {ArrowRewerse, FacebookIconS, YoutubeIconS, InstagramIconS, ShareBordered} from '../../icons'
import Group from '../../assets/images/CutawayWork/Group_1404.png'
import PersonPhoto from '../../assets/images/organization-clients/foto1.png'
import {ReactComponent as QRcode} from '../../assets/images/CutawayWork/QRcode.svg'

const useStyles = makeStyles({
  root: {
  },
  card: {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
    borderRadius: '10px',
    maxWidth: '290px',
    position: 'relative',
    overflow: 'hidden',
    marginRight: '16px'
  },
  //Left Part Card
  company: {
    padding: '18px 11px 24px',
  },
  avatar: {
    width: '71px',
    height: '71px',
    position: 'relative',
    margin: '0 auto 16px'
  },
  logo: {
    width: '71px',
    height: '71px',
    padding: '6px',
    backgroundColor: '#ffffff',
    '& img': {
      objectFit: 'contain',
    }
  },
  personPhoto: {
    position: 'absolute',
    top: '-4px',
    right: '-2px',
    width: '24px',
    height: '24px',
  },
  companyName: {
    fontSize: '10px',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: '12px',
    fontFeatureSettings: `'ss02' on`,
  },
  //Right Part Card
  person: {
    padding: '28px 17px 14px',
  },
  personName: {
    fontSize: '17px',
    lineHeight: '18px',
    paddingBottom: '5px',
  },
  position: {
    fontSize: '12px',
    lineHeight: '14.5px',
    marginBottom: '15px'
  },
  phone: {
    fontSize: '12px',
    lineHeight: '14.5px',
  },
  email: {
    fontSize: '10px',
    lineHeight: '14px',
    marginBottom: '6px'
  },
  social: {
    '& svg': {
      marginRight: '8px',
    }
  },

  rectangleWrap:{
    position: 'absolute',
    top: '0',
    right: '0',
    zIndex: 5,
  },
  rectangle: {
    width: '17px',
    height: '17px',
    position: 'relative',
    border: '17px solid transparent',
  },
  icon: {
    position: 'absolute',
    top: '-12px',
    right: '-12px',
    zIndex: 10,
  },
  // Backside Card
  boxWrap: {
    background: '#F5F5F7',
    borderRadius: '8px',
    padding: '13px',
    maxWidth: '116px',
  },
  qrcode: {
    verticalAlign: 'middle',
  },
  button: {
    padding: '0',
    width: '100%',
    '& .MuiButton-label': {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      width: 'auto',
    }
  },
  buttonText: {
    paddingTop: '13px',
  },
  buttonIcon: {
  }
})


const CutawayWork = ({person, company, showBackSide, colorCard}) => {
  const classes = useStyles();
  const {personName, position, phone, email, image, social} = person;
  const {companyName, color, logo, opacity} = company;
  const firColor = getRGBAfromHEX(colorCard ? colorCard: color);
  const secColor = getRGBAfromHEX(colorCard ? colorCard: color, opacity);
  const arrowColor = getRGBAfromHEX('#ffffff', 0.5);

  const handleButtonClick = () => {}

  return(
    <Grid container alignContent="stretch" justify="center" className={classes.root}>
      <Grid container alignItems="center" className={classes.card} style={{background: '#FFFFFF',}}>
        <Grid item xs={5} className={classes.company} style={{backgroundColor: secColor, height: "100%"}}>
          <Box className={classes.avatar}>
            <Avatar alt={companyName} src={logo} className={classes.logo} style={{border: `2px solid ${firColor}`}}/>
            <Avatar alt={personName} src={image} className={classes.personPhoto} style={{border: `1.5px solid ${firColor}`}}/>
          </Box>
          <Typography variant="body1" className={classes.companyName}>
            {companyName}
          </Typography>
        </Grid>
        <Grid item xs={7} className={classes.person}>
          <Typography variant="h5" className={classes.personName}>
            {personName}
          </Typography>
          <Typography variant="body2" className={classes.position}>
            {position}
          </Typography>
          <Typography variant="body1" className={classes.phone} style={{color: firColor}}>
            {phone}
          </Typography>
          <Typography variant="body1" className={classes.email} style={{color: firColor}}>
            {email}
          </Typography>
          <Grid container alignContent="stretch" alignItems="center" justify="flex-start" className={classes.social}>
            {social.map(item => {
                switch(item.type){
                    case 'instagram':
                        return  <InstagramIconS key='instagram' circleFill={firColor}/>
                    case 'youtube':
                      return <YoutubeIconS key='youtube' circleFill={firColor}/>
                    case 'facebook':
                        return <FacebookIconS key='facebook' circleFill={firColor}/>
                    default:
                      return null
                }
            })}
          </Grid>
        </Grid>
        <Box className={classes.rectangleWrap}>
          <Box className={classes.rectangle} style={{borderTop: `17px solid ${firColor}`,
                                                     borderRight: `17px solid ${firColor}`,}}>
                <ArrowRewerse className={classes.icon} style={{fill: arrowColor,}}/>
          </Box>
        </Box>
      </Grid>
      {showBackSide &&
      <Grid container alignItems="center" justify="space-between" className={classes.card} style={{background: firColor, padding: '24px'}}>
        <Grid item className={classes.boxWrap} xs={6}>
          <QRcode className={classes.qrcode}/>
        </Grid>
        <Grid item className={classes.boxWrap} xs={6} style={{ padding: '33px 23px 22px 22px'}}>
          <Box width="100%" variant="text" className={classes.button}>
            <Grid container justify="center">
              <Grid item><ShareBordered className={classes.buttonIcon} style={{fill: firColor}}/></Grid>
            </Grid>
                <Typography variant="body2" component="span" className={classes.buttonText}>
                  Поделиться
                </Typography>
            </Box>
        </Grid>
        <Box className={classes.rectangleWrap}>
          <Box className={classes.rectangle} style={{borderTop: `17px solid #ffffff`,
                                                     borderRight: `17px solid #ffffff`,}}>
                <ArrowRewerse className={classes.icon} style={{fill: firColor,}}/>
          </Box>
        </Box>
      </Grid>
      }
    </Grid>
  )
}

CutawayWork.defaultProps = {
  person: {
    personName: 'Александр Макаров',
    position: 'Менеджер',
    phone: '7 902 277-41-14',
    email: 'Molchanov@gmail.com',
    image: PersonPhoto,
    social: [
      {
        type: 'instagram',
      },
      {
        type: 'youtube',
      },
      {
        type: 'facebook',
      }
    ]
  },
  company: {
    companyName: 'Гипермаркет климатического оборудования',
    color: '#0084FF',
    logo: Group,
    opacity: 0.1,
  },
  showBackSide: true
};


export default CutawayWork;
