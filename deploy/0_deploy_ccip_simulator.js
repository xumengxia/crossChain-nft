const { getNamedAccounts, deployments, network } = require("hardhat");
module.exports = async ({ getNamedAccounts, deployments }) => {
  console.log(process.env.PRIVATE_KEY, 'process.env.PRIVATE_KEY');

  const { firstAccount } = await getNamedAccounts();
  const { deploy, log } = deployments;
  console.log("firstAccount", firstAccount);

  log("Deploying CCIP Simulator contract");
  await deploy("CCIPLocalSimulator", {
    contract: "CCIPLocalSimulator",
    from: firstAccount,
    log: true,
    args: [],
  });
  log("CCIP Simulator contract deployed successfully");
};
module.exports.tags = ["all", "test"];
