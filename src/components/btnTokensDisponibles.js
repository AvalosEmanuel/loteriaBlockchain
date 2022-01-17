import { useState } from 'react';
import { ethers } from 'ethers';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Message from './Mensaje'

//Address del contrato implementado en blockchain..
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const BtnTokensDisponibles = (props) => {

  const [tokens, setTokens] = useState();
  const [vistaTokens, setVistaTokens] = useState(false);

  //Lógica para visulizar tokens disponibles para la compra..
  async function tokensDisponibles() {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, props.contract.abi, provider);
      try {
        const cantidadTokens = await contract.tokensDisponibles();
        setTokens(cantidadTokens.toString());
        setVistaTokens(true);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  return(
    <div>
      <Card style={{background: "rgba(160, 242, 186, 0.8)"}}> 
        <Card.Body>
          <div className="d-grid gap-2">
            <Button onClick={tokensDisponibles} variant="success" size="lg">TOKENS DISPONIBLES</Button>
            {vistaTokens ? <Message tokens={tokens}/> : null}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default BtnTokensDisponibles;