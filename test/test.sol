// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 参考文件 https://docs.openzeppelin.com/contracts/5.x/erc20
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol

// FundMe
// 1. 让FundMe的参与者，基于 mapping 来领取相应数量的通证
// 2. 让FundMe的参与者，transfer 通证
// 3. 在使用完成后， burn 销毁通证

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {FundMe} from "./FundMe.sol";

contract FundTokenERC20 is ERC20 {
    FundMe fundMe;

    constructor(address fundMeAddr) ERC20("FundTokenERC20", "FT") {
        fundMe = FundMe(fundMeAddr);
    }

    function mint(uint256 amountToMint) public {
        require(
            fundMe.funderToAmount(msg.sender) >= amountToMint,
            "You cannot mint this many tokens"
        );
        require(fundMe.getFundSuccess(), "The fundMe is not completed yet");
        _mint(msg.sender, amountToMint);
        fundMe.setFunderToAmount(
            msg.sender,
            fundMe.funderToAmount(msg.sender) - amountToMint
        );
    }

    // claim 申领资产
    function claim(uint256 amountToClaim) public {
        // complete claim    balanceOf 查看通证数量
        require(
            balanceOf(msg.sender) >= amountToClaim,
            "You do not have enough ERC20 tokens"
        );
        require(fundMe.getFundSuccess(), "The fundMe is not completed yet");
        // to do 加自己的一些操作逻辑
        // burn amountToClime Tokens 销毁掉申领的token
        _burn(msg.sender, amountToClaim);
    }
}
