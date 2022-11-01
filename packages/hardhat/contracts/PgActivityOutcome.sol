// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./IProjectGrantCollection.sol";
import "./AccessControlMember.sol";

/**
 * @title Handler of project grants' Activity Outcomes
 */ 
contract PgActivityOutcome is AccessControlMember {

    /** List of available project grant collections */
    address[] internal projectGrantCollections;

    /** @dev Registration handler of created project grants */
    address internal projectGrantRegistry;

    // not all of the fields are necessary, but they sure are useful
    event RegisterProjectGrantCollection(
        address initiator,
        uint256 index,
        address indexed collectionAddress,
        string name,
        uint256 timestamp
    );

    /**
     * @notice Constructor of the factory
     * @param _pgRegistry Address of the registry where newly created project grants are reported
     * @param _community Address of the owning community group (DAO)
     * @param _owner Committee owner of this factory (sub-DAO)
     * @param _admin Committee with admin rights (sub-DAO)
     */
    constructor(address _pgRegistry,
        address _community,
        address _owner,
        address _admin
        )
        AccessControlMember(
            _community, 
            _owner, 
            _admin
            )
    {
        projectGrantRegistry = _pgRegistry;
    }

    /**
     * @notice Retrieve the project grants Registry set for this factory
     * @return address Address of the project grant registry contract
     */
    function getProjectGrantRegistry()
        public
        view
        returns (address)
    {
        return projectGrantRegistry;
    }
}