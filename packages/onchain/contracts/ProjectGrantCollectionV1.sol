// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.8.16;

import "./ProjectGrantCollection.sol";

contract ProjectGrantCollectionV1 is ProjectGrantCollection
{
    constructor(
        string memory _name, 
        string memory _tokenSymbol, 
        string memory _version,
        address _community,
        address _committee,
        address _admin
        ) 
        ProjectGrantCollection(
            _name,
            _tokenSymbol,
            _version, 
            _community,
            _committee,
            _admin
        ) 
    {}

}
