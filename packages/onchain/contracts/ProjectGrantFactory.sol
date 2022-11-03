// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/utils/Strings.sol";

//import "./AccessController.sol";
import "./ProjectGrantCollection.sol";
import "./ProjectGrantRegistry.sol";
import "./AccessControlMember.sol";

/**
 * @title Factory of project grant NFTokens and management of collections
 */
contract ProjectGrantFactory is AccessControlMember {
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

    // not all of the fields are necessary, but they sure are useful
    event CreateProjectGrant(
        address creator,
        address indexed factory,
        address indexed collection,
        uint256 indexed tokenId,
        string name,
        address committee,
        uint256 timestamp
    );

    event ChangeProjectGrantFactoryRegistry(
        address initiator,
        address indexed factory,
        address indexed registry,
        uint256 timestamp
    );

    /**
     * @dev Constructor of the factory
     * @param _pgRegistry Address of the registry where newly created project grants are reported
     * @param _community Address of the owning community group (DAO)
     * @param _owner Committee owner of this factory (sub-DAO)
     * @param _admin Committee with admin rights (sub-DAO)
     */
    constructor(
      address _pgRegistry,
      address _community,
      address _owner,
      address _admin
    ) AccessControlMember(_community, _owner, _admin) {
      projectGrantRegistry = _pgRegistry;
    }

    /**
     * @dev Retrieve the project grants Registry set for this factory
     * @return address Address of the project grant registry contract
     */
    function getProjectGrantRegistry() public view returns (address) {
        return projectGrantRegistry;
    }

    /**
     * @dev Change the project grants Registry of the Factory. Action restricted to *Admin* members only.
     * @param _newRegistry New registry to report newly created project grants to
     * @return Address of the newly set registry
     */
    function changeProjectGrantRegistry(address _newRegistry)
        public
        onlyAdmin
        returns (address)
    {
        projectGrantRegistry = _newRegistry;

        emit ChangeProjectGrantFactoryRegistry(
            msg.sender,
            address(this),
            _newRegistry,
            block.timestamp
        );

        return projectGrantRegistry;
    }

    /**
     * @dev Register a new Project Grants collection to be used for minting a new type of contracts
     * @param _collAddress Collection contract address
     * @return collIndex Registration index in the factory list of collections
     */
    function registerProjectGrantCollection(address _collAddress)
        public
        onlyAdmin // TODO Review Admin Vs. Community Role (or specific commitee member role)
        returns (uint256 collIndex)
    {
        // => Checks
        // TODO Check collectionAddress is legit, e.g. ERC-165 implements IProjectGrantCollection

        // Check that a collection name and version number are provided
        string memory collLabel = ProjectGrantCollection(_collAddress).name();
        string memory collVersion = ProjectGrantCollection(_collAddress)
            .version();
        bytes32 empty = keccak256(bytes("")); // TRICK String comparison using bytes32=keccak256(bytes)
        require(
            !(keccak256(bytes(collLabel)) == empty ||
                keccak256(bytes(collVersion)) == empty),
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
        for (uint i = 0; i < index; i++) {
            address collection = projectGrantCollections[i];
            if (collection == _collAddress) {
                alreadyRegistered = i;
                break;
            }
        }
        require(
            alreadyRegistered == 0 ||
                (index > 0 && projectGrantCollections[0] != _collAddress),
            "ProjectGrantFactory: Project Grants Collection already registered"
        );

        // => Effects
        projectGrantCollections.push(_collAddress);

        collIndex = projectGrantCollections.length - 1;

        // => Interactions
        emit RegisterProjectGrantCollection(
            msg.sender,
            collIndex,
            _collAddress,
            collLabel,
            block.timestamp
        );
    }

    function getProjectGrantCollections()
        public
        view
        returns (address[] memory)
    {
        return projectGrantCollections;
    }

    function getProjectGrantCollectionByIndex(uint256 index)
        public
        view
        returns (address)
    {
        return projectGrantCollections[index];
    }

    /**
     * @dev Get the index of a registered project grants collection.
     * Revert if not found.
     * @param _collection project grants collection to search for
     * @return collIndex index of the found collection
     */
    function getCollectionIndex(address _collection)
        public
        view
        returns (uint256 collIndex)
    {
        require(
            _collection != address(0),
            "ProjectGrantFactory: Empty collection address"
        );
        for (uint256 i = 0; i < projectGrantCollections.length; i++) {
            if (projectGrantCollections[i] == _collection) {
                collIndex = i;
                break;
            }
        }
        require(
            collIndex > 0 ||
                (collIndex == 0 && projectGrantCollections[0] == _collection),
            "ProjectGrantFactory: Project grants Collection not registered"
        );
    }

    /**
     * @dev Create a new Project Grant part of a given collection and assign its owning committee
     * @param _collection The project grant collection to mint from. Must be registered by the factory.
     * @param _projectGrantName Name of the project grant, for better frontend UX
     * @param _ownerCommittee Address of the account or contract responsible for the project grant
     * @return tokenId ID of the created token
     */
    function createProjectGrant(
        address _collection,
        string calldata _projectGrantName,
        address _ownerCommittee
    ) public onlyCommitteeMember(_ownerCommittee) returns (uint256 tokenId) {
        // => Checks
        // Check if collection is registered
        uint256 collIndex;
        for (uint256 i = 0; i < projectGrantCollections.length; i++) {
            if (projectGrantCollections[i] == _collection) {
                collIndex = i;
                break;
            }
        }
        require(
            collIndex > 0 ||
                (collIndex == 0 && projectGrantCollections[0] == _collection),
            "ProjectGrantFactory: Unkown collection - not registered"
        );

        // => Effects
        // Mint new token
        tokenId = ProjectGrantCollection(_collection).mintItem(
            _ownerCommittee,
            _projectGrantName
        );

        // Register the newly created Project Grant token
        ProjectGrantRegistry(projectGrantRegistry).registerProjectGrant(
            _collection,
            tokenId
        );

        // => Interactions
        emit CreateProjectGrant(
            msg.sender,
            address(this),
            _collection,
            tokenId,
            _projectGrantName,
            _ownerCommittee,
            block.timestamp
        );
    }
}
