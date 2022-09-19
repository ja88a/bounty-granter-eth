// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./ProjectGrantCollection.sol";
import "./ProjectGrantRegistry.sol";

// @title Factory of new project grant tokens and management of collections
contract ProjectGrantFactory {
    /** @dev Set of available project grant collections */
    ProjectGrantCollection[] internal projectGrantCollections;

    /** @dev Registration handler of created project grants */
    address internal projectGrantRegistry;

    // not all of the fields are necessary, but they sure are useful
    event RegisterProjectGrantCollection(
        uint256 indexed id,
        address indexed collectionAddress,
        address creator,
        string name,
        uint256 timestamp
    );

    // not all of the fields are necessary, but they sure are useful
    event CreateProjectGrant(
        uint256 indexed tokenId,
        address indexed collectionAddress,
        address creator,
        string name,
        address committee,
        uint256 timestamp
    );

    /**
     * @dev Constructor of the factory
     * @param _pgRegistry Address of the registry to register newly created project grants
     */
    constructor(address memory _pgRegistry) {
        projectGrantRegistry = _pgRegistry;
    }

    /**
     * @dev Register a new Project Grants collection to be used for minting a new type of contracts
     * @param _collAddress Collection contract address
     */
    function registerProjectGrantCollection(address memory _collAddress)
        public
    {
        // => Checks
        // TODO Check msg.sender is admin

        // TODO Check collectionAddress exists & inherits ProjectGrantCollection

        // TODO Check label is provided and doesn't exceed n chars
        // TODO Check version number is provided and follows the pattern x.y.z
        string collLabel = "BG Project Grants Collection";
        string collVersion = "0.0.1";

        // Check if collection is not already registered
        uint alreadyRegistered = 0;
        for (uint i=0; i < this.projectGrantCollections.length; i++) {
            address collection = address(this.projectGrantCollections[i]);
            if (collection == _collAddress) {
                alreadyRegistered = i;
                break;
            }
        }
        require(
            alreadyRegistered > 0 || this.projectGrantCollections.length > 0 && address(this.projectGrantCollections[0]) == _collAddress,
            "Project Grants Collection already registered"
        );

        // => Effects
        uint256 id = projectGrantCollections.length;
        projectGrantCollections.push(collAddress);

        // => Interactions
        emit RegisterProjectGrantCollection(
            id,
            _collAddress,
            msg.sender,
            collLabel,
            block.timestamp
        );
    }

    function getProjectGrantCollections()
        public
        view
        returns(ProjectGrantCollection[])
    {
        return(this.projectGrantCollections);
    }

    /**
     * @dev Create a new Project Grant part of a given collection and assign its owning committee
     * @param _collectionIndex Index of the project grant collection, used as a type of project grant to be minted
     * @param _projectGrantName Name of the project grant, for better frontend UX
     * @param _assignedCommittee Address of the account or contract responsible for the project grant
     */
    function createProjectGrant(uint256 memory _collectionIndex, string memory _projectGrantName, address memory _assignedCommittee)
        public
    {
        // => Checks
        require(
            _collectionIndex >= 0 && _collectionIndex < this.projectGrantCollections.length, 
            "Collection index out of range"
        );
        ProjectGrantCollection projectGrantCollection = this.projectGrantCollections[_collectionIndex];
        // TODO Check projectGrantCollection status
        // TODO Check assignedCommittee is legit

        // => Effects
        // Mint new token
        uint256 tokenId = projectGrantCollection.mintItem(_projectGrantName, _assignedCommittee);

        // Register the newly created Project Grant token
        projectGrantRegistry.registerProjectGrant{
            collection: address(projectGrantCollection),
            tokenId: tokenId
        }();

        // => Interactions
        emit CreateProjectGrant(
            tokenId,
            address(projectGrantCollection),
            msg.sender,
            _projectGrantName,
            _assignedCommittee,
            block.timestamp
        );
    }
}
