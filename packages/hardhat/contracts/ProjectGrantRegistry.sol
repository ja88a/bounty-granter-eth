// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./AProjectGrantCollection.sol";

contract ProjectGrantFactory {

    struct ProjectGrant {
        address collection; // the project grant contract address
        uint256 tokenId; // unique token ID of the project grant in its collection
        address committee; // community responsible for this grant management
        address treasury;
    }
    ProjectGrant[] projectGrants;

    // not all of the fields are necessary, but they sure are useful
    event RegisterProjectGrant(
        uint256 indexed contractId,
        address indexed contractAddress,
        address creator,
        string name,
        uint256 timestamp
    );

    constructor() {}

    /**
     * @dev Register a new project grant
     * @param collection Address of the project grants collection
     * @param tokenId ID of the project grant token
     */
    function registerProjectGrant(address collection, uint256 tokenId)
        external
    {
        // => Checks
        require(projectGrants.get)

        // => Effects
        uint256 id = projectGrants.length;

        projectGrants.push(contractAddress);

        // => Interactions
        emit RegisterProjectGrant(
            id,
            contractAddress,
            msg.sender,
            name,
            block.timestamp
        );
    }

    function numberOfContracts() public view returns (uint256) {
        return projectGrants.length;
    }

    function contractById(uint256 id) public view returns (address) {
        return projectGrants[id];
    }
}
