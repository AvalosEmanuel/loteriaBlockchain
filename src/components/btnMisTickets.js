import { useState } from 'react';
import { ethers } from 'ethers';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { Alert } from 'react-bootstrap';

//Address del contrato implementado en blockchain..
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const MessageTickets = ({ tickets }) => {
    return (
      <div>
      <Alert className="alertTickets" variant="info"> Tickets : {tickets}</Alert>
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
            const contract = new ethers.Contract(CONTRACT_ADDRESS, props.contract.abi, signer);
            try {
                const cantidadTokens = await contract.misTickets();
                setTicketsUser(cantidadTokens.toString());
                setVistaTickets(true);
            } catch (error) {
                console.log("Error: ", error);
            }
        }
    }

    return(
        <div>
            <Card style={{ background: "rgba(238, 243, 93, 0.8)"}}>
                <Card.Body>
                    <div className="d.grid gap-2">
                        <Button onClick={ticketsUsuario} variant="warning" size="lg"> VER MIS TICKETS </Button>
                        {vistaTickets ? <MessageTickets tickets={ticketsUser}/> : null}
                    </div>
                </Card.Body>
            </Card>
        </div>

    );
}

export default BtnMisTickets;