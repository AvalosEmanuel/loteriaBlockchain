const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Contrato Token', () => {

    let owner;
    let addr1;
    let addr2;
    let Token;
    let hardhatToken;

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        Token = await ethers.getContractFactory('Token');
        hardhatToken = await Token.deploy('Mannolette', 'MNT');
    });


    it('La implementación debe asignar el suministro total de tokens al propietario..', async () => {

        //Balance inicial del owner..
        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });

    it('Debe transferir tokens entre cuentas..', async () => {

        // Envío de 50 tokens, desde owner hacia addr1..
        await hardhatToken.transfer(addr1.address, 500);
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(500);

        // Envío de 50 tokens, desde addr1 hacia addr2..
        await hardhatToken.connect(addr1).transfer(addr2.address, 500);
        expect(await hardhatToken.balanceOf(addr2.address)).to.equal(500);
    });

    it('El balance luego de realizar una transaccion debe de mostrarse actualizado en ambas cuentas..', async () => {

        //Balance inicial del owner..
        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        //Tranferencia de tokens por parte del owner..
        await hardhatToken.transfer(addr1.address, 300);
        expect(await hardhatToken.balanceOf(owner.address)).to.equal(ownerBalance - 300);
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(300);
    });

    it('No permite realizar una transacción si no cuentas con los fondos suficientes..', async () => {

        await expect(hardhatToken.transfer(addr1.address, 1001)).to.be.revertedWith('La cantidad que deseas enviar en superior al saldo disponible..');
        await expect(hardhatToken.transferLoteria(owner.address, addr1.address, 1001)).to.be.revertedWith('La cantidad que deseas enviar en superior al saldo disponible..');
    });

    it('Luego de crear tokens el totalSupply debe verse actualizado..', async () => {

        //Creación de tokens..
        await hardhatToken.crearTokens(400);
        expect(await hardhatToken.totalSupply()).to.equal(1400);
    });
});
