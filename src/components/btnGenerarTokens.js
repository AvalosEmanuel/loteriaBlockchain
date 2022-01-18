import { ethers } from 'ethers';
import Button from 'react-bootstrap/Button';

//Address del contrato implementado en blockchain..
const CONTRACT_ADDRESS = '0xae9554B37D919Df61397F771e43F9098cEC824eE';

const BtnGeneraTokens = (props) => {

    //Lógica para generar tokens por parte del propietario de la lotería..
    async function generarTokens() {
        if(typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, props.contract.abi, signer);
            try {
                if(await contract.owner() !== await signer.getAddress()) { 
                    alert('No tienes autorización para ejecutar esta acción..');
                    return;
                } 
                const transaction = await contract.generarTokens(1000);
                await transaction.wait();
                alert("1000 tokens fueron generados..")
            } catch (error) {
                console.log("Error: ", error);
                alert("Error al intentar generar mas tokens..");
            }
        } else {
            alert("No existe proveedor de web3.. recomendamos Metamask..");
        }
    }

    return (
        <div className='btnGeneraTokens'>
            <Button variant="outline-light" onClick={generarTokens}>
                GENERAR TOKENS
            </Button>
        </div>
    );
}

export default BtnGeneraTokens;