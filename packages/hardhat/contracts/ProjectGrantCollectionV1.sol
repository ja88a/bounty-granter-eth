// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./ProjectGrantCollection.sol";

contract ProjectGrantCollectionV1 is ProjectGrantCollection
{
    constructor(string memory name, string memory tokenSymbol, string memory version) 
        ProjectGrantCollection(name, tokenSymbol, version) 
    {}

}
