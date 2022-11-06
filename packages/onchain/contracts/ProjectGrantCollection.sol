// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./IProjectGrantCollection.sol";
import "./AccessControlMember.sol";

/**
 * @title BountyGranter Project Grant collection NFT
 */
abstract contract ProjectGrantCollection is 
    IProjectGrantCollection,
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable,
    AccessControlMember
{
    string public version;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    //bytes32[] internal roles_mint;

    /**
     * @dev Constructor
     * @param _collName Name of the collection, e.g. 'Project grants V1 for DAO XYZ'
     * @param _tokenSymbol Symbol the token for this collection of project grants
     * @param _version Version of the project grants collection, e.g. '1.0.3'
     * @param _community Community (DAO) owning that collection
     * @param _committee Owning committee which members have privileges [per their role]
     * @param _admin Admin committee which members have privileges [per their role]
     */
    constructor(
        string memory _collName, 
        string memory _tokenSymbol, 
        string memory _version, 
        address _community, 
        address _committee, 
        address _admin
        ) 
        ERC721(_collName, _tokenSymbol)
        AccessControlMember(_community, _committee, _admin)
    {
        version = _version;
    }

    /**
     * @notice Returns the collection tokens' default base URI
     */
    function _baseURI() 
        internal 
        pure 
        override 
        returns (string memory) 
    {
        return "https://ipfs.io/ipfs/";
    }

    function mintItem(
        address _committee,
        string memory uri
        )
        external 
        onlyCommitteeMember(_committee)
        returns (uint256) 
    {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(_committee, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage, IProjectGrantCollection)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControlEnumerable, ERC721, ERC721Enumerable, IProjectGrantCollection)
        returns (bool)
    {
        return interfaceId == type(IProjectGrantCollection).interfaceId || super.supportsInterface(interfaceId);
    }
}
