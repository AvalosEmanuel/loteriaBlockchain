import { ethers } from 'ethers';
import Button from 'react-bootstrap/Button';

//Address del contrato implementado en blockchain..
const CONTRACT_ADDRESS = '0xae9554B37D919Df61397F771e43F9098cEC824eE';

const BtnGeneraGanador = (props) => {

    //Lógica para generar tokens por parte del propietario de la lotería..
    async function generarGanador() {
        if(typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, props.contract.abi, signer);
            try {
                if(await contract.owner() !== await signer.getAddress()) { 
                    alert('No tienes autorización para ejecutar esta acción..');
                    return;
                } 
                const transaction = await contract.generarGanador();
                await transaction.wait();
                alert('Sorteo realizado con éxito..')
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