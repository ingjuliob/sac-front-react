import React from "react";
import { useParams } from "react-router-dom";
import logo from '../../img/logo.svg';

// css
import { makeStyles } from "@material-ui/core/styles";

// material
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

// icons
import PrintIcon from '@material-ui/icons/Print';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';

// services
const { ReprintService } = require('../services/reprintService');
const { BaseService } = require('../services/baseService')

const useStyles = makeStyles((theme) => ({

  root: { flexGrow: 1, borderRadius: 0 },
  appbar: { background: 'white', paddingTop: 10, paddingBottom: 10, marginBottom: 25, color: 'black' },
  navbarTitle: { flexGrow: 1, textAlign: 'right', fontStyle: 'uppercase' },
  title: { fontSize: 14, },
  pos: { marginBottom: 12, },
  divider: { marginTop: 25, marginBottom: 25, },
  formControl: { width: '95%', },
  selectEmpty: { marginTop: theme.spacing(2) },
  button: { margin: 10, marginTop: 25, marginBottom: 30, textTransform: 'capitalize', backgroundColor: '#DB0011',
            borderRadius: '0' },
  alignItems: { textAlign: 'right' }

}));

export default function CenteredGrid() {

  // Entry params
  let { operationId, option, documentType, documentNumber, businessName, contactModeCode, productCode, causeCode,
        reasonCode, companyCode, responsibleSector, registerSector, user, origin, 
        initContact, closeContact, productNumber } = useParams();

  let service = new ReprintService();
  let baseService = new BaseService();

  const classes = useStyles();

  const saveData = () => {
    baseService.saveData(operationId, productCode, causeCode, companyCode, documentType, documentNumber, productNumber, origin, 
    user, option, contactModeCode, reasonCode, responsibleSector, registerSector, initContact, closeContact )
  }

  return (
    <div className={classes.root}>
      {/* start navbar */}
      <div className={classes.root}>
        <AppBar position="static" className={classes.appbar}>
            <Container maxWidth="lg">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <img src={logo} className="App-logo" alt="logo" />
                    </IconButton>
                    <Typography variant="h6" className={classes.navbarTitle}>
                        Baja de Tarjeta Banelco
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
      </div>
      {/* end navbar */}

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Typography variant="h5" component="h2">
                  Cliente
                </Typography>
                <br></br>
                <Grid container spacing={3}>
                  <Grid item xs={5}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Apellido y Nombre
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {businessName}
                    </Typography>
                  </Grid>

                  <Grid item xs={2}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Tipo de Documento
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {documentType}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Nº de Documento
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {documentNumber}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider variant="middle" className={classes.divider} />

                <Typography variant="h5" component="h2">
                  Tarjeta
                </Typography>
                <br></br>
                <Grid container spacing={3}>
                  <Grid item xs={5}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Nº Banelco
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {productNumber}
                    </Typography>
                  </Grid>

                  <Grid item xs={2}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Tipo de Tarjeta
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      P.TIT.ELECTRON
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <div className={classes.alignItems}>
            <Button variant="contained" color="secondary" size="large" className={classes.button} 
                    startIcon={<SaveIcon />}>Guardar</Button>
            <Button variant="contained" color="secondary" size="large" className={classes.button} 
                    startIcon={<PrintIcon />}>Imprimir</Button>
            <Button variant="contained" color="secondary" size="large" className={classes.button}
                    startIcon={<CloseIcon />}>Salir</Button>
        </div>
      </Container>
    </div>
  );
}
