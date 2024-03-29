// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./IProjectGrantCollection.sol";
import "../access/AccessControlMember.sol";

/**
 * @title BountyGranter Project Grant collection NFT
 */
abstract contract ProjectGrantCollection is 
    IProjectGrantCollection,
    ERC721Enumerable,
    Ownable,
    AccessControlMember
{
    string private _version;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    //bytes32[] internal roles_mint;
    
//    using Strings for uint256;

    /** @dev Optional Mapping for tokens' URI */
    mapping(uint256 => string) private _tokenURIs;

    /**
     * @dev Constructor
     * @param collName_ Name of the collection, e.g. 'Project grants V1 for DAO XYZ'
     * @param tokenSymbol_ Symbol the token for this collection of project grants
     * @param version_ Version of the project grants collection, e.g. '1.0.3'
     * @param community_ Community (DAO) owning that collection
     * @param committee_ Owning committee which members have privileges [per their role]
     * @param admin_ Admin committee which members have privileges [per their role]
     */
    constructor(
        string memory collName_, 
        string memory tokenSymbol_, 
        string memory version_,
        address community_,
        address committee_, 
        address admin_
        ) 
        ERC721(collName_, tokenSymbol_)
        AccessControlMember(community_, committee_, admin_)
    {
        _version = version_;
    }

    function version()
        public
        view
        returns (string memory)
    {
        return _version;
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

    /**
     * @notice Retrieve the URL to a given project grant's definition doc
     * @dev See {IERC721Metadata-tokenURI}.
     * @param tokenId Target token ID, project grant instance
     * @return The URL for accessing to the project grant's reference specs
     */
    function tokenURI(uint256 tokenId) 
        public 
        view 
        virtual 
        override(ERC721, IProjectGrantCollection)
        returns (string memory) 
    {
        _requireMinted(tokenId);

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) 
        internal 
        virtual 
    {
        require(
            _exists(tokenId), 
            "ERC721URIStorage: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
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

    // function _beforeTokenTransfer(
    //     address from,
    //     address to,
    //     uint256 tokenId
    // ) internal virtual override(ERC721Enumerable, ERC721, IProjectGrantCollection) {
    //     super._beforeTokenTransfer(from, to, tokenId);
    // }


    /**
     * @dev See {ERC721-_burn}. This override additionally checks to see if a
     * token-specific URI was set for the token, and if so, it deletes the token URI from
     * the storage mapping.
     */
    function _burn(uint256 tokenId) 
        internal 
        virtual 
        override 
    {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }

    /** 
     * @notice ERC-165 support
     * @param interfaceId ID of the interface expected to be supported - Refer to `type(X).interfaceId`
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControlMember, ERC721Enumerable, IERC165)
        returns (bool)
    {
        return interfaceId == type(IProjectGrantCollection).interfaceId || super.supportsInterface(interfaceId);
    }
}
