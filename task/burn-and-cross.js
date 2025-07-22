const { task } = require("hardhat/config");
const { networkConfig } = require("../helper-hardhat-config");
// const { deployments, getNamedAccounts, ethers } = require("hardhat");
task("burn-and-cross")
    .addOptionalParam("chainselector", "chain selector of dest chain")
    .addOptionalParam("receiver", "receiver address on dest chain")
    .addParam("tokenid", "token ID to be crossed chain")
    .setAction(async (taskArgs, hre) => {
        let chainselector;
        let receiver;
        const tokenId = taskArgs.tokenid
        const { firstAccount } = await getNamedAccounts();

        if (taskArgs.chainselector) {
            chainselector = taskArgs.chainselector
        } else {
            chainselector = networkConfig[network.config.chainId].companionChainSelector
            console.log(`chainSelecter is not set in command`);

        }
        console.log(`chainSelector is ${chainselector}`);



        if (taskArgs.receiver) {
            receiver = taskArgs.receiver
        } else {
            // companionNetworks
            const nftPoolLockAndReleaseDeployment =
                await hre.companionNetworks["destChain"].deployments.get("NFTPoolLockAndRelease")
            receiver = await nftPoolLockAndReleaseDeployment.address;
            console.log(`receiver is not set in command`);
        }

        console.log(`receiver's address is ${receiver}`);

        // transfer Link token to address of the pool
        // 转钱到池子里，保证有足够gasfee
        const linkTokenAddress = networkConfig[network.config.chainId].linkToken;
        const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddress);
        const nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint", firstAccount);
        const transferTx = await linkToken.transfer(nftPoolBurnAndMint.target, ethers.parseEther('0.5'));
        await transferTx.wait(6);
        const balance = await linkToken.balanceOf(nftPoolBurnAndMint.target);
        console.log(`balance of pool is ${balance}`);


        // approve pool address to call transferFrom
        const wnft = await ethers.getContract("WrappedMyToken", firstAccount);
        await wnft.approve(nftPoolBurnAndMint.target, tokenId);
        console.log("Approve success.");

        // call lockAndSendNFT
        const burnAndSendNFTtx = await nftPoolBurnAndMint.BurnAndSendNFT(
            tokenId,
            firstAccount,
            chainselector,
            receiver
        )
        console.log(`ccip transaction is sent, the tx hash is ${burnAndSendNFTtx}`);



    })
module.exports = {}