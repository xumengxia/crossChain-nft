const { task } = require("hardhat/config");
task("check-nft").setAction(async (taskAgus, hre) => {
    const { firstAccount } = await getNamedAccounts();
    const wnft = await ethers.getContract("WrappedMyToken", firstAccount)
    const totalSupply = await wnft.totalSupply();
    console.log("checking status of WrappedMyToken");
    for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
        const owner = await wnft.ownerOf(tokenId);
        console.log(`TokenId${tokenId} -- owner:${owner}`);

    }

})
module.exports = {}