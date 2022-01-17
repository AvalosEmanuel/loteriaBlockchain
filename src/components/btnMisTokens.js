import { useState } from 'react';
import { ethers } from 'ethers';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Message from './Mensaje'

//Address del contrato implementado en blockchain..
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const BtnMisTokens = (props) => {
    const [tokensUser, setTokensUser] = useState();
    const [vistaTokens, setVistaTokens] = useState(false);

    //Lógica de visulización tokens de un usuario..
    async function tokensUsuario() {
        if(typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, props.contract.abi, signer);
            
            try {
                const cantidadTokens = await contract.misTokens();
                setTokensUser(cantidadTokens.toString());
                setVistaTokens(true);
            } catch (error) {
                console.log("Error: ", error);
            }
        }
    }

    return(
        <div>
            <Card style={{ background: "rgba(160, 209, 242, 0.8)"}}>
                <Card.Body>
                    <div className="d.grid gap-2">
                        <Button onClick={tokensUsuario} variant="info" size="lg">VER MIS TOKENS</Button>
                        {vistaTokens ? <Message tokens={tokensUser}/> : null}
                    </div>
                </Card.Body>
            </Card>
        </div>

    );
}

export default BtnMisTokens;