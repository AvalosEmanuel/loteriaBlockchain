import { useState } from 'react';
import { ethers } from 'ethers';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Message from './Mensaje'

//Address del contrato implementado en blockchain..
const CONTRACT_ADDRESS = '0x07F0a828bd9050f9e374f5069fFBe77Ed10D72c9';

const BtnPozoAcumulado = (props) => {
    const [tokensPozo, setTokensPozo] = useState();
    const [vistaTokens, setVistaTokens] = useState(false);

    //Lógica de visulización tokens acumulados para próximo sorteo..
    async function pozoAcumulado() {
        if(typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, props.contract.abi, provider);
            try {
                const cantidadTokens = await contract.pozoAcumulado();
                setTokensPozo(cantidadTokens.toString());
                setVistaTokens(true);
            } catch (error) {
                console.log('Error: ', error);
                alert('Solicitud: Ver pozo acumulado fallida..');
            }
        } else {
            alert('No existe proveedor de web3.. recomendamos Metamask..');
        }
    }

    return(
        <div>
            <Card style={{ background: 'rgba(247, 90, 114, 0.8)'}}>
                <Card.Body>
                    <div className='d.grid gap-2'>
                        <Button onClick={pozoAcumulado} variant='danger' size='lg'> POZO ACUMULADO</Button>
                        {vistaTokens ? <Message tokens={tokensPozo}/> : null}
                    </div>
                </Card.Body>
            </Card>
        </div>

    );
}

export default BtnPozoAcumulado;