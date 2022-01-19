import { useState } from 'react';
import { ethers } from 'ethers';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Alert } from 'react-bootstrap';


const MessageTickets = ({ tickets }) => {
    return (
      <div>
      <Alert className='alertTickets' variant='info'> Tickets : {tickets}</Alert>
      </div>
  )
}

const BtnMisTickets = (props) => {
    const [ticketsUser, setTicketsUser] = useState();
    const [vistaTickets, setVistaTickets] = useState(false);

    //Lógica de visulización tokens de un usuario..
    async function ticketsUsuario() {
        if(typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(props.address, props.contract.abi, signer);
            try {
                const cantidadTokens = await contract.misTickets();
                setTicketsUser(cantidadTokens.toString());
                setVistaTickets(true);
            } catch (error) {
                console.log('Error: ', error);
                alert('Solicitud: Ver tickets fallida..');
            }
        } else {
            alert('No existe proveedor de web3.. recomendamos Metamask..');
        }
    }

    return(
        <div>
            <Card style={{ background: 'rgba(238, 243, 93, 0.8)'}}>
                <Card.Body>
                    <div className='d.grid gap-2'>
                        <Button onClick={ticketsUsuario} variant='warning' size='lg'> VER MIS TICKETS </Button>
                        {vistaTickets ? <MessageTickets tickets={ticketsUser}/> : null}
                    </div>
                </Card.Body>
            </Card>
        </div>

    );
}

export default BtnMisTickets;