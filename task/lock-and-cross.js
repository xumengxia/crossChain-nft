const { task } = require("hardhat/config");
const { networkConfig } = require("../helper-hardhat-config");
// const { deployments, getNamedAccounts, ethers } = require("hardhat");
task("lock-and-cross")
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
            const nftPoolBurnAndMintDeployment =
                await hre.companionNetworks["destChain"].deployments.get("NFTPoolBurnAndMint")
            receiver = await nftPoolBurnAndMintDeployment.address;
            console.log(`receiver is not set in command`);
        }

        console.log(`receiver's address is ${receiver}`);

        // transfer Link token to address of the pool
        // 转钱到池子里，保证有足够gasfee
        const linkTokenAddress = networkConfig[network.config.chainId].linkToken;
        const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddress);
        const nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstAccount);
        const transferTx = await linkToken.transfer(nftPoolLockAndRelease.target, ethers.parseEther('0.5'));
        await transferTx.wait(6);
        const balance = await linkToken.balanceOf(nftPoolLockAndRelease.target);
        console.log(`balance of pool is ${balance}`);


        // approve pool address to call transferFrom
        const nft = await ethers.getContract("MyToken", firstAccount);
        await nft.approve(nftPoolLockAndRelease.target, tokenId);
        console.log("Approve success.");

        // call lockAndSendNFT
        const lockAndSendNFTtx = await nftPoolLockAndRelease.lockAndSendNFT(
            tokenId,
            firstAccount,
            chainselector,
            receiver
        )
        console.log(`ccip transaction is sent, the tx hash is ${lockAndSendNFTtx}`);



    })
module.exports = {}