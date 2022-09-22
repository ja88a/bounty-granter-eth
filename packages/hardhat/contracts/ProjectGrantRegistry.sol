// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/utils/Strings.sol";

import "./ProjectGrantCollection.sol";
import "./AccessControlMember.sol";

contract ProjectGrantRegistry is AccessControlMember {

    struct ProjectGrant {
        address collection; // the project grant contract address
        uint256 tokenId; // unique token ID of the project grant in its collection
    }
    
    /** @dev Count of actual number of registered project grants */
    uint32 private projectGrantNum = 0;

    /** @dev List of the registered project grants */
    mapping(uint256 => ProjectGrant) internal projectGrants;

    /** Reference to the funds treasury associated to this registry */
    address internal treasury;

    /** @dev Effective registration of a new Project Grant in the Registry */
    event RegisterProjectGrant(
        uint256 indexed index,
        uint256 indexed tokenId,
        address indexed collectionAddress,
        address creator,
        string collectionName,
        string grantName,
        uint256 timestamp
    );

    constructor(address _community, address _committee, address _admin) 
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
    {
        // => Checks
        // TODO Check that the collection is a legit ProjectGrantCollection
        ProjectGrantCollection collection = ProjectGrantCollection(_collection);
        string memory collName = collection.name();
        string memory tokenUri = collection.tokenURI(_tokenId);

        // TODO Check that the token is valid & its status
        // require(projectGrants.get)

        // // => Effects
        uint256 index = projectGrantNum++;
        ProjectGrant storage newProjectGrant = projectGrants[index];
        newProjectGrant.collection = _collection;
        newProjectGrant.tokenId = _tokenId;

        // => Interactions
        emit RegisterProjectGrant(
            index,
            _tokenId,
            _collection,
            msg.sender,
            collName,
            tokenUri,
            block.timestamp
        );
    }

    function numberOfProjectGrants() 
        public view 
        returns (uint256) 
    {
        return projectGrantNum;
    }

    function projectGrantByIndex(uint256 index) 
        public view 
        returns (ProjectGrant memory) 
    {
        require(index < projectGrantNum, string.concat("ProjectGrantRegistry: Bad index - Max: ", Strings.toString(projectGrantNum-1)));
        return projectGrants[index];
    }

}
