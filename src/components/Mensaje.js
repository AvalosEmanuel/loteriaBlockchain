import Alert from 'react-bootstrap/Alert';

const Mensaje = ({ tokens }) => {
    return (
      <div>
      <Alert className='alertMensaje' variant='info'> Tokens : {tokens}</Alert>
      </div>
  )
}

export default Mensaje;