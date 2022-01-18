import Button from 'react-bootstrap/Button'

const BtnConectar = () => {

    async function conectar() {
        if(window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setEstadoConexion(true);
    
            } catch (error) {
            alert('Solicitud: Conectar wallet fallida..');
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

export default BtnConectar;





    