import { useState } from 'react';
import { ethers } from 'ethers';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


const BtnDevolverTokens = (props) => {
    const [cantTokens, setCantidadTokens] = useState();

    //Lógica para la devolución/canje de tokens por parte del usuario..
    async function devolucionDeTokens() {
        if(typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(props.address, props.contract.abi, signer);
            try {
                const transaction = await contract.devolverTokens(cantTokens);
                await transaction.wait();
                alert('Tokens devueltos, ya tienes tus Ethers de nuevo..')
            } catch (error) {
                console.log("Error: ", error);
                alert('Devolución de tokens fallida..');
            }
        } else {
            alert('No existe proveedor de web3.. recomendamos Metamask..');
        }
    }

    return(
        <div>
            <Card style={{background: 'rgba(52, 75, 156, 0.8)'}}> 
            <Card.Body>
                <div className='d-grid gap-2'>
                    <Button onClick={devolucionDeTokens} variant='dark' size='lg'>
                        CANJEAR TOKENS
                    </Button><br />
                    <input  className='inputDevolverTokens' 
                            onChange={e => setCantidadTokens(e.target.value)} placeholder='Ingrese cantidad..'
                    />      
                </div>
            </Card.Body>
            </Card>
        </div>      
    );
}

export default BtnDevolverTokens;