import { useState } from 'react';
import { ethers } from 'ethers';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


//Address del contrato implementado en blockchain..
//const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const BtnComprarTickets = (props) => {
    const [cantTickets, setCantidadTickets] = useState();

    //Lógica para la compra de tickets por parte de usuarios..
    async function ejecutarCompra() {
        if(typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(props.address, props.contract.abi, signer);
            try {
                const transaction = await contract.comprarTicket(cantTickets);
                await transaction.wait();
                alert('Tickets comprados..')
            } catch (error) {
                alert('Compra de tickets fallida..');
            }
        } else {
            alert('No existe proveedor de web3.. recomendamos Metamask..');
        }
    }

    return(
        <div>
            <Card style={{background: 'rgba(238, 243, 93, 0.8)'}}> 
            <Card.Body>
                <div className='d-grid gap-2'>
                    <Button onClick={ejecutarCompra} variant='warning' size='lg'>
                        COMPRAR TICKETS
                    </Button><br />
                    <input  className='inputCompraTickets'
                            onChange={e => setCantidadTickets(e.target.value)} placeholder='Ingrese cantidad..' />      
                </div>
            </Card.Body>
            </Card>
        </div>      
    );
}

export default BtnComprarTickets;