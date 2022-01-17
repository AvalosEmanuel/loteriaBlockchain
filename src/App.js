import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'

import artifacts from './artifacts/contracts/Main.sol/Main.json';

import BtnPozoAcumulado from './components/btnPozoAcumulado';
import BtnTokensDisponibles from './components/btnTokensDisponibles';
import BtnMisTokens from './components/btnMisTokens';
import BtnMisTickets from './components/btnMisTickets';
import BtnComprarTokens from './components/btnComprarTokens';
import BtnComprarTickets from './components/btnComprarTickets';
import BtnDevolverTokens from './components/btnCanjearTokens';

import BtnGeneraTokens from './components/btnGenerarTokens';
import BtnGeneraGanador from './components/btnGenerarGanador';


function App() {
  const Artifact = artifacts;

  return (
        <div className='App'>
          <div>
            <BtnGeneraTokens contract={Artifact} />
            <BtnGeneraGanador contract={Artifact} />
          </div>
          <div className="App2">
            <Container>
              <Row>
                <Col><BtnPozoAcumulado contract={Artifact} /></Col>
              </Row><br />
              <Row>
                <Col><BtnTokensDisponibles contract={Artifact} /></Col>
              </Row><br />
              <Row>
                <Col><BtnComprarTokens contract={Artifact} /></Col>
                <Col><BtnComprarTickets contract={Artifact} /></Col>
              </Row><br />
              <Row>
                <Col><BtnMisTokens contract={Artifact} /></Col>
                <Col><BtnMisTickets contract={Artifact} /></Col>
              </Row><br />
              <Row>
                <Col><BtnDevolverTokens contract={Artifact} /></Col>
              </Row>         
            </Container>     
    </div>  
      </div>
      
  );
}

export default App;



