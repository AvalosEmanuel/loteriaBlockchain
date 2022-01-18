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

import BtnConectar from './components/btnConectar';


function App() {

  return (  
        <div className='App'>
          <div>
            <BtnGeneraTokens contract={artifacts} /> 
            <BtnGeneraGanador contract={artifacts} />
          </div>
          <div>
            <BtnConectar />
          </div>
          <div className='App2'>
            <Container>
              <Row>
                <Col><BtnPozoAcumulado contract={artifacts} /></Col>
              </Row><br />
              <Row>
                <Col><BtnTokensDisponibles contract={artifacts} /></Col>
              </Row><br />
              <Row>
                <Col><BtnComprarTokens contract={artifacts} /></Col>
                <Col><BtnComprarTickets contract={artifacts} /></Col>
              </Row><br />
              <Row>
                <Col><BtnMisTokens contract={artifacts} /></Col>
                <Col><BtnMisTickets contract={artifacts} /></Col>
              </Row><br />
              <Row>
                <Col><BtnDevolverTokens contract={artifacts} /></Col>
              </Row>         
            </Container>     
          </div>  
        </div>  
  );
}

export default App;



