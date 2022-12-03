// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.8.16;

import "@openzeppelin/contracts/utils/Strings.sol";

import "./IProjectGrantCollection.sol";
import "./IProjectGrantFactory.sol";
import "./IProjectGrantRegistry.sol";
import "../access/AccessControlMember.sol";

/**
 * @title Factory of project grant NFTokens
 * @dev Management of project grant collections, minting of new project grant tokens,
 * and registration of new project grants
 */
contract ProjectGrantFactory is AccessControlMember, IProjectGrantFactory {
    /** @dev List of available project grant collections */
    address[] internal _projectGrantCollections;

    /** @dev Registration handler of created project grants */
    address internal _projectGrantRegistry;

    /**
     * @dev Constructor of the factory
     * @param pgRegistry_ Address of the registry where newly created project grants are reported
     * @param community_ Address of the owning community group (DAO)
     * @param owner_ Committee owner of this factory (sub-DAO)
     * @param admin_ Committee with admin rights (sub-DAO)
     */
    constructor(
        address pgRegistry_,
        address community_,
        address owner_,
        address admin_
    ) AccessControlMember(community_, owner_, admin_) {
        _projectGrantRegistry = pgRegistry_;
    }

    /**
     * @notice Retrieve the project grants Registry set for this factory
     * @return address Address of the project grant registry contract
     */
    function projectGrantRegistry() public view returns (address) {
        return _projectGrantRegistry;
    }

    /**
     * @notice Change the project grants Registry of the Factory. Action restricted to *Admin* members only.
     * @param _newRegistry New registry to report newly created project grants to
     * @return Address of the newly set registry
     */
    function changeProjectGrantRegistry(
        address _newRegistry
    ) public onlyAdmin returns (address) {
        // CHECKS
        require(_newRegistry == address(_newRegistry), "Invalid address");

        // EFFECTS
        _projectGrantRegistry = _newRegistry;

        // INTERACTIONS
        emit ChangeProjectGrantFactoryRegistry(
            msg.sender,
            address(this),
            _newRegistry,
            block.timestamp
        );

        return _projectGrantRegistry;
    }

    /**
     * @notice Register a new Project Grant Collection to be used for minting new types
     * @param collAddress_ Collection contract address
     * @return collIndex Registration index in the factory list of collections
     */
    function registerProjectGrantCollection(
        address collAddress_
    )
        public
        onlyAdmin // TODO Review Admin Vs. Community Role (or specific commitee member role)
        returns (uint256 collIndex)
    {
        // => Checks
        this.validProjectGrantCollection(collAddress_);

        // Check if collection is not already registered
        address[] memory _pgCollections = _projectGrantCollections;
        uint256 index = _pgCollections.length;
        uint32 alreadyRegistered = 0;
        for (uint32 i = 0; i < index; i++) {
            address collection = _pgCollections[i];
            if (collection == collAddress_) {
                alreadyRegistered = i;
                break;
            }
        }
        require(
            alreadyRegistered == 0 ||
                (index > 0 && _pgCollections[0] != collAddress_),
            "PGFactory: Collection already registered"
        );

        // => Effects
        _projectGrantCollections.push(collAddress_);

        collIndex = index; // TODO @todo Double check that shortcut
        string memory collName = IProjectGrantCollection(collAddress_).name();

        // => Interactions
        emit RegisterProjectGrantCollection(
            msg.sender,
            collIndex,
            collAddress_,
            collName, // FIXME REVIEW Costly...
            block.timestamp
        );
    }

    /**
     * @notice Validate a project grant collection
     * @param _collAddress Address of the collection to validate
     * @return `true` only if the collection is considered as valid
     */
    function validProjectGrantCollection(
        address _collAddress
    ) public view returns (bool) {
        IProjectGrantCollection pgCollection = IProjectGrantCollection(
            _collAddress
        );

        // ERC-165 support for IProjectGrantCollection
        require(
            pgCollection.supportsInterface(
                type(IProjectGrantCollection).interfaceId
            ),
            "Unsupported interface"
        );

        // Check that a collection name and version number are provided
        string memory collLabel = pgCollection.name();
        string memory collVersion = pgCollection.version();
        bytes32 empty = keccak256(bytes("")); // TRICK String comparison using bytes32=keccak256(bytes)
        require(
            !(keccak256(bytes(collLabel)) == empty ||
                keccak256(bytes(collVersion)) == empty), // abi.encode(collVersion)
            "Invalid collection - Review name and version"
        );
        // Check the collection label length
        require(
            bytes(collLabel).length > 5 && bytes(collLabel).length < 120,
            "Invalid collection - Review name length"
        );

        // TODO Further constrain the PG collections' validity

        return true;
    }

    function projectGrantCollections()
        public
        view
        returns (address[] memory)
    {
        return _projectGrantCollections;
    }

    function projectGrantCollectionByIndex(uint256 index_) 
        public
        view
        returns (address)
    {
        return _projectGrantCollections[index_];
    }

    /**
     * @dev Get the index of a registered project grants collection.
     * Revert if not found.
     * @param collection_ project grants collection to search for
     * @return collIndex index of the found collection
     */
    function collectionIndex(address collection_) 
        public
        view
        returns (uint256 collIndex) 
    {
        require(
            collection_ != address(0),
            "PGFactory: Empty address"
        );

        address[] memory pgCollections = _projectGrantCollections;
        for (uint256 i = 0; i < pgCollections.length; i++) {
            if (pgCollections[i] == collection_) {
                collIndex = i;
                break;
            }
        }

        require(
            collIndex > 0 ||
                (collIndex == 0 && pgCollections[0] == collection_),
            "PGFactory: Collection not registered"
        );
    }

    /**
     * @dev Create a new Project Grant part of a given collection and assign its owning committee
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
        public onlyCommitteeMember(_ownerCommittee) 
        returns (uint256 tokenId)
    {
        // => Checks
        // Check if collection is registered
        collectionIndex(_collection);
        // TODO Check for the submitted project grant name
        // TODO Check for the submitted committee address

        // => Effects
        // Mint new token
        tokenId = IProjectGrantCollection(_collection).mintItem(
            _ownerCommittee,
            _projectGrantName
        );

        // Register the newly created Project Grant token
        IProjectGrantRegistry(_projectGrantRegistry).registerProjectGrant(
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

    /**
     * @notice ERC-165 support
     * @param interfaceId ID of the interface expected to be supported - Refer to `type(X).interfaceId`
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControlMember, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IProjectGrantFactory).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
