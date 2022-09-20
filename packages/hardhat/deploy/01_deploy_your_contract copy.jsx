// deploy/00_deploy_your_contract.js
// deploy/00_deploy_projectGrantFactory_contracts.js

const { ethers } = require("hardhat");

// Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
// args: [ "Hello", ethers.utils.parseEther("1.5") ],

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("ProjectGrantRegistry", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
  });

  await deploy("ProjectGrantFactory", {
    from: deployer,
    log: true,
  });

  await deploy("ProjectGrantCollectionV1", {
    from: deployer,
    log: true,
  });

  // Getting a previously deployed contract
  const projectGrantFactory = await ethers.getContract("ProjectGrantFactory", deployer);

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

module.exports.tags = ["ProjectGrantFactory"];
