// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/utils/Strings.sol";

import "./AccessController.sol";
import "./ProjectGrantCollection.sol";
import "./ProjectGrantRegistry.sol";
import "./AccessControlMember.sol";

// @title Factory of new project grant tokens and management of collections
contract ProjectGrantFactory is AccessControlMember {

    // uint256 internal projectGrantCollectionNum = 0;
    // /** @dev Set of available project grant collections */
    // mapping (uint256 => address) projectGrantCollections;
    address[] internal projectGrantCollections;

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
        address creator,
        uint256 indexed tokenId,
        address indexed collectionAddress,
        string name,
        address committee,
        uint256 timestamp
    );

    /**
     * @dev Constructor of the factory
     * @param _pgRegistry Address of the registry where newly created project grants are reported
     * @param _owningCommunity Address of the owning community group
     * @param _adminCommittee Address of the committe with admin rights
     */
    constructor(address _pgRegistry, address _owningCommunity, address _adminCommittee)
        AccessControlMember(_owningCommunity, _adminCommittee)
    {
        projectGrantRegistry = _pgRegistry;
    }

    /**
     * @dev Register a new Project Grants collection to be used for minting a new type of contracts
     * @param _collAddress Collection contract address
     */
    function registerProjectGrantCollection(address _collAddress)
        public
        onlyRole(ADMIN) // TODO TEMP Review Admin Vs. Community Role (or specific commitee membership & role)
    {
        // => Checks

        // TODO Check collectionAddress inherits ProjectGrantCollection
        // Check that a collection name and version number are provided
        string memory collLabel = ProjectGrantCollection(_collAddress).name();
        string memory collVersion = ProjectGrantCollection(_collAddress).version();
        bytes32 empty = keccak256(bytes("")); // TRICK String comparison using bytes32=keccak256(bytes)
        require(
            !(keccak256(bytes(collLabel)) == empty || keccak256(bytes(collVersion)) == empty), 
            "ProjectGrantFactory: Invalid collection for registration - Review name and version"
        );
        // Check the collection label length
        require(
            bytes(collLabel).length < 120, 
            "ProjectGrantFactory: Collection name is too long - Max length is 120, without special characters"
        );
        // TODO Check that the version follows the pattern x.y

        // Check if collection is not already registered
        uint index = projectGrantCollections.length;
        uint alreadyRegistered = 0;
        for (uint i=0; i < index; i++) {
            address collection = projectGrantCollections[i];
            if (collection == _collAddress) {
                alreadyRegistered = i;
                break;
            }
        }
        require(
            alreadyRegistered == 0 || index > 0 && projectGrantCollections[0] != _collAddress,
            "ProjectGrantFactory: Project Grants Collection already registered"
        );

        // => Effects
        // uint256 index = projectGrantCollectionNum++;
        // address newCol = projectGrantCollections[index];
        // newCol = _collAddress;
        projectGrantCollections.push(_collAddress);

        // => Interactions
        emit RegisterProjectGrantCollection(
            index,
            _collAddress,
            msg.sender,
            collLabel,
            block.timestamp
        );
    }

    function getProjectGrantCollections()
        public
        view
        returns(address[] memory)
    {
        return(projectGrantCollections);
    }
    
    function getProjectGrantCollectionByIndex(uint256 index)
        public
        view
        returns(address)
    {
        return(projectGrantCollections[index]);
    }

    /**
     * @dev Create a new Project Grant part of a given collection and assign its owning committee
     * @param _collectionIndex Index of the project grant collection, used as a type of project grant to be minted
     * @param _projectGrantName Name of the project grant, for better frontend UX
     * @param _assignedCommittee Address of the account or contract responsible for the project grant
     */
    function createProjectGrant(uint256 _collectionIndex, string calldata _projectGrantName, address _assignedCommittee)
        public
        onlyCommitteeMember(_assignedCommittee)
    {
        // => Checks
        // TODO Check assignedCommittee is legit
        // TODO Check sender is at least part of the DAO [and sub-DAO]
        //require(hasRole(ADMIN, msg.sender)); // FIXME TEMP: Not just admin but member of the DAO
        //require(isCommunityMember(), "Allowed to community members only");

        require(
            _collectionIndex >= 0 && _collectionIndex < projectGrantCollections.length, 
            string.concat("ProjectGrantFactory: Collection index out of range - Max: ", Strings.toString(projectGrantCollections.length-1))
        );
        ProjectGrantCollection projectGrantCollection = ProjectGrantCollection(projectGrantCollections[_collectionIndex]);
        // TODO Check projectGrantCollection status

        // => Effects
        // Mint new token
        uint256 tokenId = projectGrantCollection.mintItem(_assignedCommittee, _projectGrantName);

        // Register the newly created Project Grant token
        // projectGrantRegistry.registerProjectGrant{
        //     collection: projectGrantCollection,
        //     tokenId: tokenId
        // }();
        ProjectGrantRegistry(projectGrantRegistry).registerProjectGrant(address(projectGrantCollection), tokenId);
        
        // => Interactions
        emit CreateProjectGrant(
            msg.sender,
            tokenId,
            address(projectGrantCollection),
            _projectGrantName,
            _assignedCommittee,
            block.timestamp
        );
    }
}
