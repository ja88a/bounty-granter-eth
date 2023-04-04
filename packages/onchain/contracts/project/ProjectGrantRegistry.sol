// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.16;

import "@openzeppelin/contracts/utils/Strings.sol";

import "./IProjectGrantRegistry.sol";
import "./IProjectGrantFactory.sol";
import "./IProjectGrantCollection.sol";
import "../access/AccessControlMember.sol";

/**
 * @title Registry of project grants
 */
contract ProjectGrantRegistry is IProjectGrantRegistry, AccessControlMember 
{   
    /** @dev Count of actual number of registered project grants */
    uint32 internal projectGrantNum = 0;

    /** @dev List of registered project grants */
    mapping(uint256 => ProjectGrant) internal projectGrants;

    /** Reference to the funds Treasury associated to the registry */
//    address internal treasury;

    /** @dev List of whitelisted project grant factories where collections are registered */
    address[] internal factories;

    /**
     * @dev Constructor of PG Registry
     * @param _factories List of whitelisted project grant factories
     * @param _community DAO community to which the registry is affiliated to, e.g. BG DAO
     * @param _committee sub-DAO committee to which the registry belongs
     * @param _admin sub-DAO committee by which the registry is administrated
     */
    constructor(
        address[] memory _factories,
        address _community,
        address _committee,
        address _admin
        )
        AccessControlMember(_community, _committee, _admin) 
    {
        factories = _factories;
    }

    function whitelistFactory(
        address projectGrantFactory
        )
        onlyAdmin
        public
    {
        // CHECKS
        IProjectGrantFactory pgFactory = IProjectGrantFactory(projectGrantFactory);
        require(
            //Utils.isContract(pgFactory, "Invalid contract") &&
            pgFactory.supportsInterface(type(IProjectGrantFactory).interfaceId),
            "Invalid PGFactory"
        );

        // TODO Implement whitelisting of PG Factories
    }

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
        onlyCommitteeMember(address(0))
        returns (ProjectGrant memory)
    {
        // CHECKS
        this.validProjectGrant(_collection, _tokenId);

        // EFFECTS
        uint256 index = projectGrantNum++;
        ProjectGrant storage newProjectGrant = projectGrants[index];
        newProjectGrant.collection = _collection;
        newProjectGrant.tokenId = _tokenId;

        // INTERACTIONS
        IProjectGrantCollection pgCollection = IProjectGrantCollection(_collection);
        emit RegisterProjectGrant(
            msg.sender,
            index,
            _tokenId,
            pgCollection.name(),
            _collection,
            block.timestamp
        );

        return newProjectGrant;
    }

    /** 
     * @notice Get the number of registered project grants
     * @return Number of project grants, actual index
     */
    function numberOfProjectGrants() 
        public 
        view 
        returns (uint256) 
    {
        return projectGrantNum;
    }

    /**
     * @notice Get the reference of a project grant based on its registry index
     * @param _index Index in the registry of the target project grant
     * @param validate Optional validation of the project grant
     * @return The project grant collection and its token ID
     */
    function projectGrantByIndex(uint256 _index, bool validate) 
        public 
        view 
        returns (ProjectGrant memory) 
    {
        require(
            _index < projectGrantNum, 
            "PGRegistry: Wrong index"
        );
        
        ProjectGrant memory projectGrant = projectGrants[_index];

        if (validate)
            this.validProjectGrant(projectGrant.collection, projectGrant.tokenId);

        return projectGrant;
    }

    function validProjectGrant(
        address collection,
        uint256 tokenId
        )
        external
        view
        returns (bool)
    {
        // Collection
        require(
            collection == address(collection) 
            && collection != address(0),
            "Invalid PG address"
        );

        IProjectGrantCollection pgCollection = IProjectGrantCollection(collection);
        require(
            pgCollection.supportsInterface(type(IProjectGrantCollection).interfaceId)
        );
        // require(
        //     pgCollection.supportsInterface(type(IProjectGrantCollection).interfaceId)
        // );
        string memory collName = pgCollection.name();
        require(
            bytes(collName).length > 5,
            "Invalid collection name"
        );
        string memory tokenUri = pgCollection.tokenURI(tokenId);

        // Token
        
        //string memory grantName = collection.tokenName(_tokenId);

        // TODO Check that the token is valid & its status
        // require(projectGrants.get)

        return true;

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
        return interfaceId == type(IProjectGrantRegistry).interfaceId || super.supportsInterface(interfaceId);
    }

}
