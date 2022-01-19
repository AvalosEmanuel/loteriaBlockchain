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

const CONTRACT_ADDRESS = '0xB4d1b8D6B4Adc393EDEF8b87d32F7a78EA64724D';

function App() {

  return (  
        <div className='App'>
          <div>
            <BtnGeneraTokens contract={artifacts} address={CONTRACT_ADDRESS} /> 
            <BtnGeneraGanador contract={artifacts} address={CONTRACT_ADDRESS}/>
          </div>
          <div>
            <BtnConectar />
          </div>
          <div className='App2'>
            <Container>
              <Row>
                <Col><BtnPozoAcumulado contract={artifacts} address={CONTRACT_ADDRESS} /></Col>
              </Row><br />
              <Row>
                <Col><BtnTokensDisponibles contract={artifacts} address={CONTRACT_ADDRESS} /></Col>
              </Row><br />
              <Row>
                <Col><BtnComprarTokens contract={artifacts} address={CONTRACT_ADDRESS} /></Col>
                <Col><BtnComprarTickets contract={artifacts} address={CONTRACT_ADDRESS} /></Col>
              </Row><br />
              <Row>
                <Col><BtnMisTokens contract={artifacts} address={CONTRACT_ADDRESS} /></Col>
                <Col><BtnMisTickets contract={artifacts} address={CONTRACT_ADDRESS} /></Col>
              </Row><br />
              <Row>
                <Col><BtnDevolverTokens contract={artifacts} address={CONTRACT_ADDRESS} /></Col>
              </Row>         
            </Container>     
          </div>  
        </div>  
  );
}

export default App;



