async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Despliegue de contratos con la cuenta:', deployer.address);

  const loteriaBis = await ethers.getContractFactory('Main');
  const loteria = await loteriaBis.deploy('Mannolette', 'MNT');

  console.log('Loteria address: ', loteria.address);
  console.log('Token address: ', await loteria.addressToken());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
