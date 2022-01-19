import { ethers } from 'ethers';
import Button from 'react-bootstrap/Button';

//Address del contrato implementado en blockchain..
//const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';


const BtnGeneraGanador = (props) => {

    //Lógica para generar tokens por parte del propietario de la lotería..
    async function generarGanador() {
        if(typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(props.address, props.contract.abi, signer);
            try {
                if(await contract.owner() !== await signer.getAddress()) { 
                    alert('No tienes autorización para ejecutar esta acción..');
                    return;
                } 
                const transaction = await contract.generarGanador();
                await transaction.wait();
                const ticketGanador = await contract.ticketGanador();
                alert('Sorteo realizado con éxito..');
                alert('El ticket ganador es: ' + ticketGanador.toString());
                
            } catch (error) {
                console.log('Error: ', error);
                alert('Sorteo fallido..');
            }
        } else {
            alert('No existe proveedor de web3.. recomendamos Metamask..');
        }
    }

    return (
        <div className='btnGeneraGanador'>
            <Button variant='outline-light' onClick={generarGanador}>
                REALIZAR SORTEO
            </Button>
        </div>
    );
}

export default BtnGeneraGanador;