const { getNamedAccounts, deployments, network } = require("hardhat");
const { developmentChain } = require("../helper-hardhat-config");


module.exports = async ({ getNamedAccounts, deployments }) => {
  if (developmentChain.includes(network.name)) {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;

    log("Deploying CCIP Simulator contract");
    await deploy("CCIPLocalSimulator", {
      contract: "CCIPLocalSimulator",
      from: firstAccount,
      log: true,
      args: [],
    });
    log("CCIP Simulator contract deployed successfully");
  }

};
module.exports.tags = ["all", "test"];
