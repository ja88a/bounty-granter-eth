// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./IProjectGrantCollection.sol";
import "./AccessControlMember.sol";

abstract contract ProjectGrantCollection is IProjectGrantCollection,
//    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable,
    AccessControlMember
{
    string public version;

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    bytes32[] internal roles_mint;

    /**
     * @dev Constructor
     * @param name Name of the collection, e.g. 'Project grants V1'
     * @param tokenSymbol Symbol the token for this collection of project grants
     * @param _version Version of the project grants collection, e.g. '1.0.3'
     * @param _community Community owning that collection
     * @param _committee Owning committee which members have privileges [per their role]
     */
    constructor(string memory name, string memory tokenSymbol, string memory _version, address _community, address _committee) 
        ERC721(name, tokenSymbol)
        AccessControlMember(_community, _committee)
    {
        version = _version;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function mintItem(address to, string memory uri) 
        external 
        onlyCommitteeMember()
        returns (uint256) 
    {
        // require(
        //     checkMemberHasRole(roles_mint),
        //     "ProjectGrant: Minting not allowed -  "
        // );
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
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
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControlEnumerable, ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
