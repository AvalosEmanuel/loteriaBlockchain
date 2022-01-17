import Button from 'react-bootstrap/Button'

const btnConectar = () => {
    async function conectar() {
        if(window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
    
            } catch (error) {
            console.log("Error botón cenectar..")
            console.log("Error: ", error); 
            }
        } else {
          alert("Necesitas un proovedor web3.. Recomendamos Metamask..");
        }
    }

    return (
        <div>
            <Button className='btnConectar' 
                    onClick={conectar} 
                    variant="outline-primary" size="lg">CONECTAR WALLET</Button>
        </div>
    
    );
}

export default btnConectar;





    