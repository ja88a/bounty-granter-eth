// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.16;

import "../access/IAccessControlMember.sol";

/**
 * @title Factory of project grant NFTokens 
 * @dev Management of project grant collections, minting of new project grant tokens, 
 * and registration of new project grants
 */
interface IProjectGrantFactory is IAccessControlMember {

    /** @notice Event emitted on the registration of a project grant collection */
    event RegisterProjectGrantCollection(
        address initiator,
        uint256 index,
        address indexed collectionAddress,
        string name,
        uint256 timestamp
    );

    /** @notice Event emitted on a new project grant creation */
    event CreateProjectGrant(
        address creator,
        address indexed factory,
        address indexed collection,
        uint256 indexed tokenId,
        string name,
        address committee,
        uint256 timestamp
    );

    /** @notice Event emitted on updates of the factory's registry */
    event ChangeProjectGrantFactoryRegistry(
        address initiator,
        address indexed factory,
        address indexed registry,
        uint256 timestamp
    );

    /**
     * @notice Retrieve the project grants Registry set for this factory
     * @return address Address of the project grant registry contract
     */
    function projectGrantRegistry() 
        external
        view 
        returns (address);

    /**
     * @notice Change the project grants Registry of the Factory. Action restricted to *Admin* members only.
     * @param _newRegistry New registry to report newly created project grants to
     * @return Address of the newly set registry
     */
    function changeProjectGrantRegistry(address _newRegistry)
        external
        returns (address);

    /**
     * @notice Register a new Project Grant Collection to be used for minting new types
     * @param _collAddress Collection contract address
     * @return collIndex Registration index in the factory list of collections
     */
    function registerProjectGrantCollection(address _collAddress)
        external
        returns (uint256 collIndex);

    /**
     * @notice Validate a project grant collection
     * @param _collAddress Address of the collection to validate
     * @return `true` only if the collection is considered as valid
     */
    function validProjectGrantCollection(
        address _collAddress
        )
        external
        view
        returns (bool);

    function projectGrantCollections()
        external
        view
        returns (address[] memory);

    function projectGrantCollectionByIndex(uint256 index)
        external
        view
        returns (address);

    /**
     * @notice Get the index of a registered project grants collection.
     * Revert if not found.
     * @param _collection project grants collection to search for
     * @return collIndex index of the found collection
     */
    function collectionIndex(address _collection)
        external
        view
        returns (uint256 collIndex);

    /**
     * @notice Create a new Project Grant part of a given collection and assign its owning committee
     * @param _collection The project grant collection to mint from. Must be registered by the factory.
     * @param _projectGrantName Name of the project grant, for better frontend UX
     * @param _ownerCommittee Address of the committee contract responsible for the project grant
     * @return tokenId ID of the created token
     */
    function createProjectGrant(
        address _collection,
        string calldata _projectGrantName,
        address _ownerCommittee
        ) 
        external
        returns (uint256 tokenId);
}
