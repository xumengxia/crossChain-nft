const { task } = require("hardhat/config");
task("check-nft").setAction(async (taskAgus, hre) => {
    const { firstAccount } = await getNamedAccounts();
    const nft = await ethers.getContract("MyToken", firstAccount)
    const totalSupply = await nft.totalSupply();
    console.log("checking status of MyToken");
    for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
        const owner = await nft.ownerOf(tokenId);
        console.log(`TokenId${tokenId} -- owner:${owner}`);

    }

})
module.exports = {}