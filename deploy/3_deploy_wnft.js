// 无论哪个网络都需要执行
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;
    log("Deploying wnft contract");
    await deploy("WrappedMyToken", {
        contract: "WrappedMyToken",
        from: firstAccount,
        log: true,
        args: ["WrappedMyToken", "WMT"]
    })
    log("wnft contract deployed successfully");



}
module.exports.tags = ["destchain", "all"]