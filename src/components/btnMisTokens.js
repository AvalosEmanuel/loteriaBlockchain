import { useState } from 'react';
import { ethers } from 'ethers';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Message from './Mensaje'

//Address del contrato implementado en blockchain..
const CONTRACT_ADDRESS = '0xae9554B37D919Df61397F771e43F9098cEC824eE';

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
                console.log('Error: ', error);
                alert('Solicitud: Ver tokens fallida..');
            }
        } else {
            alert('No existe proveedor de web3.. recomendamos Metamask..');
        }
    }

    return(
        <div>
            <Card style={{ background: 'rgba(160, 209, 242, 0.8)'}}>
                <Card.Body>
                    <div className='d.grid gap-2'>
                        <Button onClick={tokensUsuario} variant='info' size='lg'>VER MIS TOKENS</Button>
                        {vistaTokens ? <Message tokens={tokensUser}/> : null}
                    </div>
                </Card.Body>
            </Card>
        </div>

    );
}

export default BtnMisTokens;