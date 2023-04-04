// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.16;

import "../access/IAccessControlMember.sol";

/**
 * @title Registry of project grants
 */
interface IProjectGrantRegistry is IAccessControlMember
{
    struct ProjectGrant {
        address collection; // the project grant contract address
        uint256 tokenId; // unique token ID of the project grant in its collection
    }

    /** @dev Event emitted on the effective registration of a new Project Grant in the Registry */
    event RegisterProjectGrant(
        address initiator,
        uint256 index,
        uint256 indexed tokenId,
        string collectionName,
        address indexed collectionAddress,
        uint256 timestamp
    );

    /**
     * @notice Make a project grant factory legit for registering minted tokens
     */
    function whitelistFactory(
        address projectGrantFactory
        )
        external;

    /**
     * @notice Register a new project grant
     * @param _collection Address of the project grants collection
     * @param _tokenId ID of the project grant token
     */
    function registerProjectGrant(
        address _collection, 
        uint256 _tokenId
        )
        external
        returns (ProjectGrant memory);

    /** 
     * @notice Get the number of registered project grants
     * @return Number of project grants, actual index
     */
    function numberOfProjectGrants() 
        external 
        view 
        returns (uint256);

    /**
     * @notice Get the reference of a project grant based on its registry index
     * @param _index Index in the registry of the target project grant
     * @param validate Optional validation of the project grant
     * @return The project grant collection and its token ID
     */
    function projectGrantByIndex(uint256 _index, bool validate) 
        external 
        view 
        returns (ProjectGrant memory);

    /**
     * @notice Validate a project grant contract
     */
    function validProjectGrant(
        address collection,
        uint256 tokenId
        )
        external
        view
        returns (bool);

}
