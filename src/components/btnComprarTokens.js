import { useState } from 'react';
import { ethers } from 'ethers';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


//Address del contrato implementado en blockchain..
const CONTRACT_ADDRESS = '0xae9554B37D919Df61397F771e43F9098cEC824eE';



const BtnComprarTokens = (props) => {
    const [cantTokens, setCantidadTokens] = useState();

    //Lógica para la compra de tokens por parte de usuarios..
    async function ejecutarCompra() {
        if(typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, props.contract.abi, signer);
            try {
                const transaction = await contract.comprarTokens(cantTokens, {value: ethers.utils.parseEther(cantTokens)});
                await transaction.wait();
                alert("Tokens comprados..")

                //--------------------------------------------------------
                contract.on("Transfer", (from, to, amount, event) => {
                    console.log(from, to, amount, event) });
                //--------------------------------------------------------
            } catch (error) {
                console.log("Error: ", error);
            }
        }
    }

    return(
        <div>
            <Card style={{background: "rgba(160, 209, 242, 0.8)"}}> 
            <Card.Body>
                <div className="d-grid gap-2">
                    <Button onClick={ejecutarCompra} variant="info" size="lg">
                        COMPRAR TOKENS
                    </Button><br />
                    <input  className="inputCompraTokens" 
                            onChange={e => setCantidadTokens(e.target.value)} placeholder="Ingrese cantidad.." 
                    />      
                </div>
            </Card.Body>
            </Card>
        </div>      
    );
}

export default BtnComprarTokens;






