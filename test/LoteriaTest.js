const { expect } = require('chai');
const { ethers } = require('hardhat');


describe('Contrato Loteria', () => {

    let owner;
    let addr1;
    let addr2;
    let Loteria;
    let hardhatLoteria;

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        Loteria = await ethers.getContractFactory('Main');
        hardhatLoteria = await Loteria.deploy('Mannolette', 'MNT');
        await hardhatLoteria.deployed();
    });

    it('constructor(): El constructor debe de crear los tokens correctamente..', async () => {

        //Corroboramos que el balance inicial de tokens sea el correcto..
        expect(await hardhatLoteria.tokensDisponibles()).to.equal(1000);
    });

    it('generarTokens(): Creando tokens por parte del owner', async () => {

        await hardhatLoteria.generarTokens(500);
        expect(await hardhatLoteria.tokensDisponibles()).to.equal(1500);
    });

    it('generarTokens(): Creando tokens por parte de otro usuario que no sea el owner, mnj error..', async () => {

        await expect(hardhatLoteria.connect(addr1).generarTokens(500)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('comprarTokens(): Comprar tokens por parte de un usuario y que sean asignados de forma correcta..', async () => {

        //Conversión de ethers para realizar la compra..
        const addr1Ethers = ethers.utils.parseEther('4.0');

        //Realizamos la compra de tokens..
        await hardhatLoteria.connect(addr1).comprarTokens(4, { value: addr1Ethers });
        expect(await hardhatLoteria.connect(addr1).misTokens()).to.equal(4);
    });

    it('comprarTokens(): Que al realizarse la compra de tokens se descuenten de los tokens disponibles..', async () => {

        //Conversión de ethers para realizar la compra..
        const addr1Ethers = ethers.utils.parseEther('4.0');

        //Realizamos la compra de tokens..
        await hardhatLoteria.connect(addr1).comprarTokens(4, { value: addr1Ethers });
        const tokensDiponiblesPosCompra = (await hardhatLoteria.tokensDisponibles()).toNumber();
        expect(tokensDiponiblesPosCompra).to.equal(996);

    });

    it('comprarTokens(): Que al realizarse la compra de tokens se emita el evento tokensComprados..', async () => {

        //Conversión de ethers para realizar la compra..
        const addr1Ethers = ethers.utils.parseEther('4.0');

        //Verificamos la emisión del evento TicketComprado..
        await expect(hardhatLoteria.connect(addr1).comprarTokens(4, { value: addr1Ethers }))
            .to.emit(hardhatLoteria, 'TokensComprados')
            .withArgs(4, addr1.address);

    });

    it('comprarTokens(): Intentar comprar tokens por parte de un usuario sin ethers suficientes, mnj error..', async () => {

        //Conversión de ethers para realizar la compra..
        const addr1Ethers = ethers.utils.parseEther('3.0');

        //Realizamos la compra esperando el mensaje de error..
        await expect(hardhatLoteria.connect(addr1).comprarTokens(4, { value: addr1Ethers })).to.be.revertedWith('No tienes suficientes ethers para realizar esta accion');
    });

    it('comprarTicket(): Al realizarse una compra de tickets deben de asignarse al usuario y actualizar el pozoAcumulado..', async () => {

        const addr1Ethers = ethers.utils.parseEther('4.0');
        await hardhatLoteria.connect(addr1).comprarTokens(4, { value: addr1Ethers });

        //Realizamos la compra de tickets..
        await hardhatLoteria.connect(addr1).comprarTicket(2);
        const addr1Tickets = (await hardhatLoteria.connect(addr1).misTickets()).length;

        //Verificamos el pozoAcumulado..
        expect(await hardhatLoteria.pozoAcumulado()).to.equal(4);
        //Verificamos los tickets del usuario..
        expect(addr1Tickets).to.equal(2);
    });

    it('comprarTicket(): Intentar comprar tickets por parte de un usuario sin tokens suficientes, mnj error..', async () => {

        const addr1Ethers = ethers.utils.parseEther('3.0');
        await hardhatLoteria.connect(addr1).comprarTokens(3, { value: addr1Ethers });

        await expect(hardhatLoteria.connect(addr1).comprarTicket(2)).to.be.revertedWith('Necesitas comprar mas tokens..');
    });

    it('generarGanador(): Generar un ganador y se envíen los fondos al  mismo..', async () => {

        //Conversión de ethers para realizar la compra..
        const addr1Ethers = ethers.utils.parseEther('2.0');
        const addr2Ethers = ethers.utils.parseEther('2.0');

        //Realizamos la compra de tokens..
        await hardhatLoteria.connect(addr1).comprarTokens(2, { value: addr1Ethers });
        await hardhatLoteria.connect(addr2).comprarTokens(2, { value: addr2Ethers });

        //Realizamos la compra de tickets..
        await hardhatLoteria.connect(addr1).comprarTicket(1);
        await hardhatLoteria.connect(addr2).comprarTicket(1);

        //Generamos un ganador..
        await hardhatLoteria.generarGanador();

        //Considero que no es la manera correcta de realizar el test, pero luego de una busqueda y no haber 
        //encontrado nada, se me ocurrió hacerlo de forma rústica para tener un resultado al respecto de la funcionalidad..
        if (await hardhatLoteria.connect(addr1).misTokens() > 0) {
            expect(await hardhatLoteria.connect(addr1).misTokens()).to.equal(4);
        } else {
            expect(await hardhatLoteria.connect(addr2).misTokens()).to.equal(4);
        }
    });

    it('generarGanador(): Que al intentar generar un ganador se revierta la operación si no es el owner quien llama a la función..', async () => {

        await expect(hardhatLoteria.connect(addr1).generarGanador()).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('generarGanador(): Que al intentar generar un ganador se revierta la operación al no haber tickets comprados..', async () => {

        await expect(hardhatLoteria.generarGanador()).to.be.revertedWith('No hay boletos comprados para este sorteo');
    });

    it('devolverTokens(): Realizar el canje de tokens por ethers.. ', async () => {

        const addr1Ethers = ethers.utils.parseEther('4.0');
        await hardhatLoteria.connect(addr1).comprarTokens(4, { value: addr1Ethers });

        await expect(hardhatLoteria.connect(addr1).devolverTokens(4))
            .to.emit(hardhatLoteria, 'TokensDevueltos')
            .withArgs(4, addr1.address);
    });

    it('devolverTokens(): Operación revertida si intentamos devolver 0(cero) tokens..', async () => {

        const addr1Ethers = ethers.utils.parseEther('4.0');
        await hardhatLoteria.connect(addr1).comprarTokens(4, { value: addr1Ethers });

        await expect(hardhatLoteria.connect(addr1).devolverTokens(0)).to.be.revertedWith('La cantidad de tokens a devolver debe ser mayor a 0(cero)..');
    });

    it('devolverTokens(): Operación revertida si intentamos devolver más tokens de los que disponemos..', async () => {

        const addr1Ethers = ethers.utils.parseEther('4.0');
        await hardhatLoteria.connect(addr1).comprarTokens(4, { value: addr1Ethers });

        await expect(hardhatLoteria.connect(addr1).devolverTokens(5)).to.be.revertedWith('No cuentas con esa cantidad de tokens, ingresa la cantidad correcta..');
    });
});