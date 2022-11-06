// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.8.16;

import "@openzeppelin/contracts/utils/Strings.sol";

import "./IProjectGrantCollection.sol";
import "./AccessControlMember.sol";

/**
 * @title Registry of project grants
 */
contract ProjectGrantRegistry is 
    AccessControlMember 
{

    struct ProjectGrant {
        address collection; // the project grant contract address
        uint256 tokenId; // unique token ID of the project grant in its collection
    }
    
    /** @dev Count of actual number of registered project grants */
    uint32 private projectGrantNum = 0;

    /** @dev List of registered project grants */
    mapping(uint256 => ProjectGrant) internal projectGrants;

    /** Reference to the funds Treasury associated to the registry */
    address internal treasury;

    /** @dev Event emitted on the effective registration of a new Project Grant in the Registry */
    event RegisterProjectGrant(
        address initiator,
        uint256 index,
        uint256 indexed tokenId,
        string tokenUri,
        string collectionName,
        address indexed collectionAddress,
        uint256 timestamp
    );

    /**
     * @dev Constructor of PG Registry
     * @param _community DAO community to which the registry is affiliated to, e.g. BG DAO
     * @param _committee sub-DAO committee to which the registry belongs
     * @param _admin sub-DAO committee by which the registry is administrated
     */
    constructor(
        address _community,
        address _committee,
        address _admin
        )
        AccessControlMember(_community, _committee, _admin) 
    {
    }

    /**
     * @dev Register a new project grant
     * @param _collection Address of the project grants collection
     * @param _tokenId ID of the project grant token
     */
    function registerProjectGrant(address _collection, uint256 _tokenId)
        external
        onlyCommitteeMember(address(0))
        returns (ProjectGrant memory)
    {
        // => Checks
        // TODO Check that the collection is a legit ProjectGrantCollection

        IProjectGrantCollection collection = IProjectGrantCollection(_collection);
        string memory collName = collection.name();
        string memory tokenUri = collection.tokenURI(_tokenId);
        //string memory grantName = collection.tokenName(_tokenId);

        // TODO Check that the token is valid & its status
        // require(projectGrants.get)

        // => Effects
        uint256 index = projectGrantNum++;
        ProjectGrant storage newProjectGrant = projectGrants[index];
        newProjectGrant.collection = _collection;
        newProjectGrant.tokenId = _tokenId;

        // => Interactions
        emit RegisterProjectGrant(
            msg.sender,
            index,
            _tokenId,
            tokenUri,
            collName,
             _collection,
            block.timestamp
        );

        return newProjectGrant;
    }

    /** 
     * @dev Get the number of registered project grants
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
     * @dev Get the reference of a project grant based on its registry index
     * @param _index Index in the registry of the target project grant
     * @return The project grant collection and its token ID
     */
    function projectGrantByIndex(uint256 _index) 
        public 
        view 
        returns (ProjectGrant memory) 
    {
        require(
            _index < projectGrantNum, 
            string.concat("ProjectGrantRegistry: Bad index - Max: ", Strings.toString(projectGrantNum-1))
        );
        return projectGrants[_index];
    }

}
