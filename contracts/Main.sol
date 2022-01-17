// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";

contract Main is Ownable {
    Token tokenLoteria;
    address contrato;

    event TokensComprados(uint256 tokenAmounts_, address buyer_);

    constructor(string memory nameToken_, string memory symbolToken_) {
        //Instancia del token..
        tokenLoteria = new Token(nameToken_, symbolToken_);
        //Address del contrato desplegado..
        contrato = address(this);
    }

    //------------------------------- LOGICA DEL TOKEN ------------------------------- \\

    //Address del token..
    function addressToken() public view returns(address) {
        return tokenLoteria.addressContrat();
    }
    //Establecer precio en ethers..
    function precioToken(uint256 tokenAmounts_)
        internal
        pure
        returns (uint256)
    {
        return tokenAmounts_ * (1 ether);
    }

    //Generar tokens.. Solo accesible por el owner..
    function generarTokens(uint256 tokenAmounts_) public onlyOwner {
        tokenLoteria.crearTokens(tokenAmounts_);
    }

    //Ver cuantos tokens hay disponibles..
    function tokensDisponibles() public view returns (uint256) {
        return tokenLoteria.balanceOf(contrato);
    }

    //Comprar tokens de la lotería.. Para luego hacer uso de los mismo al adquirir Tickets o cualquier otro producto ofrecido..
    function comprarTokens(uint256 tokenAmounts_) public payable {
        //Calcular el coste total de los tokens a comprar..
        uint256 cost = precioToken(tokenAmounts_);

        //Se requiere que el valor de ethers pagados sea suficiente para cubrir el coste de los mismos..
        require(
            cost <= msg.value,
            "No tienes suficientes ethers para realizar esta accion"
        );

        //Calculamos la diferencia a favor del cliente en caso de abonar con una mayor cantidad de ethers de los requeridos..
        uint256 difference = msg.value - cost;

        //Retorno al cliente de la diferencia en ethers, en caso que sea necesario..
        //Debemos de castear la direccion a payable, de lo contrario arroja error..
        payable(msg.sender).transfer(difference);

        //Obtener el balance de tokens del contrato..
        uint256 balance = tokensDisponibles();

        //Filtro para evaluar los tokens a comprar en relación con los tokens disponibles..
        require(
            balance >= tokenAmounts_,
            "Desea comprar mas tokens de los existentes, rectifique la cantidad a comprar"
        );

        //Transferencia de tokens al comprador..
        tokenLoteria.transfer(msg.sender, tokenAmounts_);

        //Emitimos el evento de compra una vez realizada la misma..
        emit TokensComprados(tokenAmounts_, msg.sender);
    }

    //Obtener la cantidad de tokens acumulados en el pozo a modo de premio/bote..
    function pozoAcumulado() public view returns (uint256) {
        return tokenLoteria.balanceOf(owner());
    }

    //Obtener la cantidad de tokens que posee una persona cualquiera..
    function misTokens() public view returns (uint256) {
        return tokenLoteria.balanceOf(msg.sender);
    }

    //----------------------------- LOGICA DE LA LOTERIA ----------------------------- \\

    //Precio del ticket en tokens..
    uint256 public precioTicket = 2;

    //Relación entre las personas que compra los boletos y los números de los mismos..
    mapping(address => uint256[]) idPersona_Ticket;

    //Relación necesaria para identificar al ganador..
    mapping(uint256 => address) idTicket_Persona;

    //Número aleatorio.. Empleado en la generación del ganador..
    uint256 randNonce = 0;

    //Array de tickets comprados..
    uint256[] ticketsComprados;

    //Eventos..
    event TicketComprado(uint256 numTicket_, address buyer_); //Evento cuando se compra un boleto..
    event TicketGanador(uint256 numTicket_); //Evento boleto ganador..
    event TokensDevueltos(uint256 tokenAmounts_, address user_); //Evento cuando un usuario devuelve tokens y recibe ethers..

    //Función para comprar tickets de lotería..
    function comprarTicket(uint256 ticketAmounts_) public {
        //Precio total de los tickets a comprar..
        uint256 precioTotal = precioTicket * ticketAmounts_;

        //Filtrado de los tokens a pagar..
        require(precioTotal <= misTokens(), "Necesitas comprar mas tokens..");

        /*
            El cliente paga los tickets de lotería en tokens:
            Por este motivo fue necesario crear una función dentro del contrato ERC20.sol llamada 'transferLoteria()'
            ya que en caso de utilizar 'transfer()' o 'transferFrom()' la dirección tomada como owner sería incorrecta,
            debido a que asociaría 'msg.sender' con la dirección del contrato y eso nos arrojaría un error. 
            La dirección que debemos pasar es la del dueño del token, la persona física, no la del contrato desplegado..
        */
        //Tranferencia de tokens al owner -> quien es el encargado de almacenar el pozoAcumulado..
        tokenLoteria.transferLoteria(msg.sender, owner(), precioTotal);

        /*
            La siguiente función realiza las siguientes operaciones y procesos:
            - Toma la marca de tiempo actual -> ('block.timestamp'), toma quien llamada 
              a la función(msg.sender) y toma un número 'nonce' (un número que se utiliza solo una vez, para que no ejecutemos dos veces
              la misma función de hash con los mismos parámetrso de entrada) en incremento..
            - Luego empleamos keccak256 para convertir estas entradas a un número aleatorio..
            - Casteamos a uint el valor obtenido.. y al hacer módulo (%) de 10000, nos estamos quedando con los últimos 4 valores del mismo..
              Dando un valor aleatorio en este caso entre 0 - 9999..
        */

        for (uint256 i = 0; i < ticketAmounts_; i++) {
            uint256 random = uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            ) % 10000;

            //Incrementamos el randNonce para no repetirlo..
            randNonce++;

            //Almacenamos los datos de los tickets..
            idPersona_Ticket[msg.sender].push(random);

            //Número de ticket comprado..
            ticketsComprados.push(random);

            //Asignación del id del ticket para saber el ganador mas adelante..
            idTicket_Persona[random] = msg.sender;

            //Emisión del evento..
            emit TicketComprado(random, msg.sender);
        }
    }

    //Visualizar el/los número/s de ticket/s de una persona..
    function misTickets() public view returns (uint256[] memory) {
        return idPersona_Ticket[msg.sender];
    }

    //Función para generar un ganador, y realizar el envío del premio..
    function generarGanador() public onlyOwner {
        //Primero certificamos que haya tickets comprados para realizar el sorteo..
        require(
            ticketsComprados.length > 0,
            "No hay boletos comprados para este sorteo"
        );

        //Declaración de la longitud del array..
        uint256 longitud = ticketsComprados.length;

        //Aleatoriamente seleccionamos un número entre 0 y 'longitud'..
        //1- Elección de una posición aleatoria del array..
        uint256 posicionArray = uint256(
            uint256(keccak256(abi.encodePacked(block.timestamp))) % longitud
        );
        //2- Selección del número aleatorio, mediante la posición aleatoria del array..
        uint256 eleccionBoleto = ticketsComprados[posicionArray];

        //Emisión del evento al haber un ganador..
        emit TicketGanador(eleccionBoleto);

        //Recuperar la dirección del ganador..
        address ganadorPremio = idTicket_Persona[eleccionBoleto];

        //Envío del premio al ganador..
        tokenLoteria.transferLoteria(
            msg.sender,
            ganadorPremio,
            pozoAcumulado()
        );
    }

    //Devolución de los tokens..
    function devolverTokens(uint256 _numTokens) public payable {
        //El num de tokens a devolver debe ser mayor a 0..
        require(
            _numTokens > 0,
            "La cantidad de tokens a devolver debe ser mayor a 0(cero).."
        );
        //Quien devuelve los tokens debe de contar con esa cantidad de tokens en su cuenta..
        require(
            _numTokens <= misTokens(),
            "No cuentas con esa cantidad de tokens, ingresa la cantidad correcta.."
        );

        //DEVOLUCION:
        /*
        1- El cliente devuelve los tokens.. Nótese que aquí la devolución se realiza a la dirección del contrato, 
        a diferencia de la compra donde la dirección de envío era la del titular de la lotería, ya que requerimos que esa cantidad
        de tokens vuelvan a estar operativas y en circulación y no bloqueados en caso de realizar el pago al ganador.. 
        */
        tokenLoteria.transferLoteria(msg.sender, address(this), _numTokens);

        //2- La lotería paga en ethers, según la cantidad de tokens devueltos..
        payable(msg.sender).transfer(precioToken(_numTokens));

        //Emisión del evento devolución..
        emit TokensDevueltos(_numTokens, msg.sender);
    }
}
