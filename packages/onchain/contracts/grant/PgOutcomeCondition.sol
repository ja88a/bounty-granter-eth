// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.16;

import "../access/AccessControlRole.sol";

/**
 * @title Handler of project grants' Activity Outcome Conditions
 * @dev Compute a rating based on associated oracle contracts and 
 * their specified mapping.
 */ 
contract PgOutcomeCondition is AccessControlRole {

    /**
     * @notice Constructor of the factory
     * @param _community Address of the owning community group (DAO)
     * @param _owner Committee owner of this contract (sub-DAO)
     * @param _admin Committee with admin rights (sub-DAO)
     * @param _ownerActions Actions available to owners
     * @param _adminActions Actions available to admins
     */
    constructor(
        address _community,
        address _owner,
        address _admin,
        uint32[] memory _ownerActions,
        uint32[] memory _adminActions
        )
        AccessControlRole(
            _community, 
            _owner, 
            _admin,
            _ownerActions,
            _adminActions
            )
    {
    }

}