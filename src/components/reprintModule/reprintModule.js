import React from "react";
import { useParams } from "react-router-dom";
import logo from '../../img/logo.svg';

// import css
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";

// material
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { Alert, AlertTitle } from '@material-ui/lab';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CircularProgress from '@material-ui/core/CircularProgress';
import { red } from '@material-ui/core/colors';
import Backdrop from '@material-ui/core/Backdrop';

// icons
import PrintIcon from '@material-ui/icons/Print';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import AutorenewIcon from '@material-ui/icons/Autorenew';

// services
import BaseService from '../services/baseService';
import ReprintService from '../services/reprintService';

// start css
const useStyles = makeStyles((theme) => ({

  root: { flexGrow: 1, borderRadius: 0 },
  appbar: { background: 'white', paddingTop: 10, paddingBottom: 10, marginBottom: 25, color: 'black' },
  navbarTitle: { flexGrow: 1, textAlign: 'right', fontStyle: 'uppercase' },
  title: { fontSize: 14 },
  pos: { marginBottom: 12, },
  divider: { marginTop: 25, marginBottom: 25 },
  formControl: { width: '95%' },
  selectEmpty: { marginTop: theme.spacing(2) },
  button: { margin: 10, marginTop: 25, marginBottom: 30, textTransform: 'capitalize', backgroundColor: '#DB0011',
            borderRadius: '0' },
  buttonOutlined: { margin: 10, marginTop: 25, marginBottom: 30, textTransform: 'capitalize', color: '#DB0011',
  borderRadius: '0' },
  alignItems: { textAlign: 'right' },

  // loading styles
  backdrop: { zIndex: theme.zIndex.drawer + 1, color: '#fff' },
  buttonProgress: { color: red[500], position: 'absolute', top: '50%', left: '50%', margin: theme.spacing(1), 
                    display: 'flex', alignItems: 'center' }

}));

const Accordion = withStyles({
  root: {
    boxShadow: "none",
    "&:not(:last-child)": { borderBottom: 0 },
    "&:before": { display: "none" },
    "&$expanded": { margin: "auto" },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    marginBottom: -1, minHeight: 56,
    "&$expanded": { minHeight: 56 },
  },
  content: {
    "&$expanded": { margin: "12px 0" },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: { padding: theme.spacing(2) },
}))(MuiAccordionDetails);
// end css

export default function CenteredGrid() {

  // Entry params
  let { operationId, option, documentType, documentNumber, businessName, contactModeCode, productCode, causeCode,
    reasonCode, companyCode, responsibleSector, registerSector, user, origin,
    initContact, closeContact, productNumber } = useParams();

  // State variables
  const [embozos, setEmbozos] = React.useState([]);
  const [sucursales, setSucursales] = React.useState([]);
  const [alert, setAlert] = React.useState('');
  const [disable, setDisable] = React.useState(true);
  const [value, setValue] = React.useState("");
  const [expanded, setExpanded] = React.useState("");
  const [selectedDestino, setSelectedDestino] = React.useState('');
  const [selectedSucursal, setSelectedSucursal] = React.useState('');
  const [tipo, setTipo] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [resultRequest, setResultRequest] = React.useState("");
  const [resultStatus, setResultStatus] = React.useState("");
  const [resultMsg, setResultMsg] = React.useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = React.useState(true);

  const handleClose = () => { setOpen(false); };

  // Ref variables
  let domicilioEmbozo = React.useRef(null);
  let domicilioCategoria = React.useRef(null);
  let sucursalEmbozo = React.useRef(null);
  let sucursalCategoria = React.useRef(null);
  const timer = React.useRef();

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  // Style variables
  const classes = useStyles();

  // Get branches info
  const updateBranches = () => {
    ReprintService.getBranchDetails(operationId)
      .then(dataSucursales => {
        setSucursales(dataSucursales.branches);
        setLoading(false);
      })
  }

  // Handle onchange event (Sucursal)
  const updateSelectedSucursal = (event, data) => {
    setSelectedSucursal(data.props.label + " (" + data.props.value + ")");
  }

  // Handle onchange event (Paneles)
  const handleChange = (panel) => (event, newExpanded) => {
    if (panel === 'panelSucursal') { // Panel de Sucursal
      setLoading(true);
      updateBranches();
      setSelectedDestino('SUCURSAL');
      setDisable(true);
    } else { // Panel de Domicilio
      setSelectedSucursal("-");
      setSelectedDestino('DOMICILIO');
    }
    setExpanded(newExpanded ? panel : false);
    setValue(event.target.value);
  };

  // Funcion para guardar la registracion generada
  const saveData = () => {
    let embozo = selectedDestino === 'DOMICILIO' ? domicilioEmbozo.current.outerText : sucursalEmbozo.current.outerText;
    let category = selectedDestino === 'DOMICILIO' ? domicilioCategoria.current.outerText : sucursalCategoria.current.outerText;

    setDisable(true);
    setLoading(true);

    BaseService.saveData(operationId, productCode, causeCode, companyCode, documentType, documentNumber, productNumber, origin,
      user, option, contactModeCode, reasonCode, responsibleSector, registerSector, initContact, closeContact, embozo,
      category, "-", selectedSucursal)
      .then(data => {
        // TODO: Abrir un dialogo de informacion al usuario con el resultado
        let pedido = data.registration.requestNumber;
        let mensaje = data.registration.message;
        let estado = data.registration.status;
        setOpen(true);
        setResultRequest(pedido);
        setResultStatus(estado);
        setResultMsg(mensaje);
        setLoading(false);
      });
  }

  // Funcion hook para consultar la ayuda al operador
  React.useEffect(() => {
    async function callAPI() {
      BaseService.getAlert(operationId, productCode, causeCode, reasonCode, companyCode)
        .then(dataAlert => {
          setAlert(dataAlert.message);
        })
    }
    callAPI();
  }, [operationId, productCode, causeCode, reasonCode, companyCode]);

  // Funcion hook para consultar los detalles de la tarjeta y los embozos
  React.useEffect(() => {
    async function callAPI() {
      ReprintService.getCardDetails(operationId, productNumber)
        .then(data => {
          ReprintService.getEmbozos(operationId, data.detalleTarjeta.reprint)
            .then(dataEmbozos => {
              setEmbozos(dataEmbozos.embozos);
              setLoading(false);
            });
        })
    }
    callAPI();
  }, [operationId, productNumber]);

  // Funcion hook para configurar el nombre de la transaccional de 
  // acuerdo al valor del parametro option recibido
  React.useEffect(() => {
    if (option === 'ReimprimirDiferida') {
      setTipo("Reimpresión Diferida de Tarjeta Banelco");
    } else {
      setTipo("Reimpresión Común de Tarjeta Banelco");
    }
  }, [option]);

  const printScreen = () => {
    window.print();
  };

  return (
    <div className={classes.root}>
      {/* start navbar */}
      <div className={classes.root}>
        <AppBar position="static" className={classes.appbar}>
          <Container maxWidth="lg">
            <Toolbar>
              <IconButton edge="start" className={classes.menuButton} color="inherit">
                <img src={logo} className="App-logo" alt="logo" />
              </IconButton>
              <Typography variant="h6" className={classes.navbarTitle}>
                {tipo}
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>
      </div>
      {/* end navbar */}

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item lg={12}>
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Typography variant="h5" component="h2">
                  Perfil
                </Typography>
                <br></br>
                <Grid container spacing={3}>
                  <Grid item lg={5}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Apellido y Nombre
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {businessName}
                    </Typography>
                  </Grid>

                  <Grid item lg={2}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Tipo y Nº de Documento
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {documentType} - {documentNumber}
                    </Typography>
                  </Grid>
                  <Grid item lg={2}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Nº Banelco
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {productNumber}
                    </Typography>
                  </Grid>
                  <Grid item lg={2}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Tipo Tarjeta
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      P.TIT.ELECTRON
                    </Typography>
                  </Grid>
                </Grid>

                <Divider variant="middle" className={classes.divider} />

                <Typography variant="h5" component="h2">
                  Destino
                </Typography>
                <br></br>
                <div>
                  <Accordion square expanded={expanded === "panelDomicilio"} key='acc-domicilio'>
                    <AccordionSummary aria-controls="panelDomiciliod-content" id="panelDomiciliod-header">
                      <FormControl component="fieldset">
                        <RadioGroup aria-label="destino" name="domicilio" value={value} onChange={handleChange("panelDomicilio")} onClick={() => setDisable(false)}>
                          <FormControlLabel value="panelDomicilio" control={<Radio />} label="Domicilio" />
                        </RadioGroup>
                      </FormControl>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item lg={2}>
                          <Typography variant="caption" display="block" gutterBottom>
                            Domicilio
                          </Typography>
                          <Typography className={classes.pos} color="textSecondary">

                          </Typography>
                        </Grid>
                        <Grid item lg={2}>
                          <Typography variant="caption" display="block" gutterBottom>
                            Embozo
                          </Typography>
                          {
                            embozos.filter(embozo => embozo.destino === 'Domicilio').map(fEmbozo => (
                              <Typography key="domicilioEmbozo" ref={domicilioEmbozo} className={classes.pos} color="textSecondary">{fEmbozo.embozo}</Typography>))
                          }
                        </Grid>
                        <Grid item lg={2}>
                          <Typography variant="caption" display="block" gutterBottom>
                            Categoría
                          </Typography>
                          {
                            embozos.filter(embozo => embozo.destino === 'Domicilio').map(fEmbozo => (
                              <Typography key="domicilioCategoria" ref={domicilioCategoria} className={classes.pos} color="textSecondary">{fEmbozo.categoria}</Typography>))
                          }
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion square expanded={expanded === "panelSucursal"} key='acc-sucursal'>
                    <AccordionSummary aria-controls="panelSucursald-content" id="panelSucursald-header">
                      <FormControl component="fieldset">
                        <RadioGroup aria-label="destino" name="sucursal" value={value} onChange={handleChange("panelSucursal")}>
                          <FormControlLabel value="panelSucursal" control={<Radio />} label="Sucursal" />
                        </RadioGroup>
                      </FormControl>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item lg={2} xs={6}>
                          <Typography variant="caption" display="block" gutterBottom>
                            Sucursal
                            </Typography>
                          <FormControl className={classes.formControl}>
                            <Select onChange={updateSelectedSucursal}>
                              {sucursales.map((sucursal) =>
                                <MenuItem onClick={() => setDisable(false)} value={sucursal.numBranch} label={sucursal.branch}>{sucursal.branch}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item lg={2}>
                          <Typography variant="caption" display="block" gutterBottom>
                            Embozo
                          </Typography>
                          {
                            embozos.filter(embozo => embozo.destino === 'Sucursal').map(fEmbozo => (
                              <Typography key="sucursalEmbozo" ref={sucursalEmbozo} className={classes.pos} color="textSecondary">{fEmbozo.embozo}</Typography>))
                          }
                        </Grid>
                        <Grid item lg={2}>
                          <Typography variant="caption" display="block" gutterBottom>
                            Categoría
                          </Typography>
                          {
                            embozos.filter(embozo => embozo.destino === 'Sucursal').map(fEmbozo => (
                              <Typography key="sucursalCategoria" ref={sucursalCategoria} className={classes.pos} color="textSecondary">{fEmbozo.categoria}</Typography>))
                          }
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>
                <br></br>

                <Alert severity="info">
                  <AlertTitle><strong>Tener en cuenta</strong></AlertTitle>
                  {alert}
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
          <DialogTitle id="responsive-dialog-title">{"REGISTRACIÓN"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography gutterBottom>
                Se ha generado el pedido: <strong>{resultRequest}</strong> con estado <u><strong>{resultStatus}</strong></u>
              </Typography>
              <Typography gutterBottom>
                {resultMsg}
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={saveData} variant="outlined" color="secondary" size="large" className={classes.buttonOutlined}
                    startIcon={<AutorenewIcon />} style={{display: ( origin === 'SUCURSAL' && resultStatus !== 'Resuelto' ) ? 'inherit' : 'none'}}>Reintentar</Button>
            <Button onClick={handleClose} variant="contained" color="secondary" size="large" className={classes.button}
                    startIcon={<CloseIcon />}>Cerrar</Button>
          </DialogActions>
        </Dialog>

        <div className={classes.alignItems}>
          <Button variant="contained" color="secondary" size="large" className={classes.button} disabled={disable}
            startIcon={<SaveIcon />} onClick={saveData}>Guardar</Button>

            {loading && <Backdrop className={classes.backdrop} open={loading}>
                          <CircularProgress size={40} className={classes.buttonProgress}/>
                        </Backdrop>
            }

          <Button variant="contained" color="secondary" size="large" className={classes.button} disabled={disable}
            startIcon={<PrintIcon />} onClick={printScreen}>Imprimir</Button>
          <Button variant="contained" color="secondary" size="large" className={classes.button}
            startIcon={<CloseIcon />}>Salir</Button>
        </div>
      </Container>
    </div>
  );
}
