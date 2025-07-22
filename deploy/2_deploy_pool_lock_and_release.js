const { getNamedAccounts, network } = require("hardhat")
const { developmentChain, networkConfig } = require("../helper-hardhat-config")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;
    log("NFTPoolLockAndRelease deploying");
    let sourceChainRouter;
    let linkTokenAddr;
    console.log(network.config.chainId, 'network.config.chainId');
    if (developmentChain.includes(network.name)) {
        const CCIPLocalSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
        const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", CCIPLocalSimulatorDeployment.address);
        const ccipConfig = await ccipSimulator.configuration();
        sourceChainRouter = ccipConfig.sourceRouter_;
        linkTokenAddr = ccipConfig.linkToken_;
    } else {
        sourceChainRouter = networkConfig[network.config.chainId].router;
        linkTokenAddr = networkConfig[network.config.chainId].linkToken;
    }
    //   NFTPoolLockAndRelease   address _router, address _link, address nftAddr

    const nftDeployment = await deployments.get("MyToken");
    const nftAddr = nftDeployment.address;
    await deploy("NFTPoolLockAndRelease", {
        contract: "NFTPoolLockAndRelease",
        from: firstAccount,
        log: true,
        args: [sourceChainRouter, linkTokenAddr, nftAddr]
    })
    log("NFTPoolLockAndRelease deployed successfully")

}
module.exports.tags = ["sourcechain", "all"]