// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { MyToken } from "./MyToken";
constact WrappedMyToken is MyToken{
    constructor(string memory tokenName,string memory tokenSymbol)
    MyToken(tokenName,tokenSymbol){}
    function mintTokenWithSpecificTokenId(address to,uint256 tokenId) public {
        _safeMint(to, tokenId);
    }
}