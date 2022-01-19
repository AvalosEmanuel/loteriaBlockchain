//Esto es necesario para mantener fuera de acceso nuestras claves, tanto PRIVATE_KEY como ALCHEMY_KEY..
//Traemos esos datos desde un archivo aparte..
require("dotenv").config();
require("@nomiclabs/hardhat-waffle");


  // Configuración para desplegar contrato en red de prueba ropten..
  // Utilizando un nodo Alchemy..
  
  module.exports = {
    solidity: "0.8.0",
    //defaultNetwork: "hardhat",
    paths: {
      artifacts: './src/artifacts',
    },
    networks: {
      //hardhat: {},
      ropsten: {
        //En esta línea traemos la clave de 'Alchemy' desde el archivo '.env'..
        //Previamente incluimos la dependencia => 'npm install --save-dev dotenv' <=
        url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
        accounts: [`${process.env.PRIVATE_KEY}`]
      }
    },
  };



// Configuración para desplegar contrato en LocalHost..

/*
  module.exports = {
    solidity: "0.8.0",
    paths: {
      artifacts: './src/artifacts',
      },
    networks: {
      hardhat: {
        chainId: 1337
      }
    }
  };
*/

// --------------------------------------------------------