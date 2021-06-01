import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import ReprintModule from './components/reprintModule/reprintModule';
import DischargeModule from './components/dischargeModule/dischargeModule';


export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/reprint/1509090912980128785211/ReimprimirTarjeta/DNI/10266305/BRINGIOTTI,%20MANUEL/Email/B/P/34/2/955/041/43275857/BANCA/Email/Email/4517610097274041">Reimpresión Común de Tarjeta Banelco</Link>
            </li>
            <li>
              <Link to="/reprint/1509090912980128785211/ReimprimirDiferida/DNI/10266305/BRINGIOTTI,%20MANUEL/Email/B/P/34/2/955/041/43275857/BANCA/Email/Email/4517610097274041">Reimpresión Diferida de Tarjeta Banelco</Link>
            </li>
            <li>
              <Link to="/discharge">Baja de Tarjeta Banelco</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/reprint/:operationId/:option/:documentType/:documentNumber/:businessName/:contactModeCode/:productCode/:causeCode/:reasonCode/:companyCode/:responsibleSector/:registerSector/:user/:origin/:initContact/:closeContact/:productNumber" component={Reprint} />
          <Route path="/discharge">
            <Discharge />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Reprint() {
  return <ReprintModule></ReprintModule>;
}

function Discharge() {
  return <DischargeModule></DischargeModule>;
}
