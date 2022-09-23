// Hardhat deployment of contracts
// Learn more: https://www.npmjs.com/package/hardhat-deploy

const { ethers } = require("hardhat");

// Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
// args: [ "Hello", ethers.utils.parseEther("1.5") ],

const CHAIN_ID_LOCAL = "31337";

module.exports = async ({ 
  getNamedAccounts, 
  deployments, 
  getChainId,
  getUnnamedAccounts
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("projectGrantFactory", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    //args: [ "Hello", ethers.utils.parseEther("1.5") ],
    //gasLimit: 4000000, 
    //waitConfirmations: 5,
    log: true
  });

  // Getting a previously deployed contract
  //  /!\ Error: ERROR processing /home/simon/dev/workspace/bounty-granter-eth_tmp-tes/deploy/00_deploy_projectGrantFactory.js:
  //  TypeError: ethers.getContract is not a function
  //const projectGrantRegistry = await ethers.getContract("projectGrantFactory", deployer);

  // Verify from the command line by running `yarn verify`

  // Verify the contract with Etherscan for public chains
  // if (chainId !== CHAIN_ID_LOCAL) {
  //   try {
  //     console.log(" 🎫 Verifing Contract on Etherscan... ");
  //     await sleep(3000); // wait 3 seconds for deployment to propagate bytecode
  //     await run("verify:verify", {
  //       address: projectGrantRegistry.address,
  //       contract: "contracts/projectGrantFactory.sol:projectGrantFactory",
  //       // contractArguments: [yourToken.address],
  //     });
  //   } catch (e) {
  //     console.log(" ⚠️ Failed to verify contract on Etherscan ");
  //   }
  // }

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  // try {
  //   if (chainId !== localChainId) {
  //     await run("verify:verify", {
  //       address: YourContract.address,
  //       contract: "contracts/YourContract.sol:YourContract",
  //       constructorArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
  /*
  // To take ownership of yourContract using the ownable library uncomment next line and add the 
  // address you want to be the owner. 
  await YourContract.transferOwnership(
    "ADDRESS_HERE"
  );
    //const YourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  // If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.tags = ["projectGrantFactory"];
