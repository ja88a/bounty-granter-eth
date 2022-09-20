// Hardhat deployment of contracts
// Learn more: https://www.npmjs.com/package/hardhat-deploy
const { ethers } = require("hardhat");

// Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
// args: [ "Hello", ethers.utils.parseEther("1.5") ],

module.exports = async ({ 
  getNamedAccounts, 
  deployments, 
  getChainId,
  getUnnamedAccounts
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("ProjectGrantRegistry", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    //args: [ "Hello", ethers.utils.parseEther("1.5") ],
    //gasLimit: 4000000, 
    log: true
  });

  // Getting a previously deployed contract
  const projectGrantRegistry = await ethers.getContract("ProjectGrantRegistry", deployer);

  // TODO Verify the contract with Etherscan for public chains
  // if (chainId !== "31337") {
  //   try {
  //     console.log(" 🎫 Verifing Contract on Etherscan... ");
  //     await sleep(3000); // wait 3 seconds for deployment to propagate bytecode
  //     await run("verify:verify", {
  //       address: projectGrant.address,
  //       contract: "contracts/ProjectGrant.sol:ProjectGrant",
  //       // contractArguments: [yourToken.address],
  //     });
  //   } catch (e) {
  //     console.log(" ⚠️ Failed to verify contract on Etherscan ");
  //   }
  // }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.tags = ["ProjectGrantRegistry"];
