// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.8.16;

// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

interface IProjectGrantCollection is 
    IERC721Metadata
{
    function mintItem(address to, string memory uri) 
        external 
        returns (uint256);

    function tokenURI(uint256 tokenId)
        external
        view
        returns (string memory);

    function supportsInterface(bytes4 interfaceId)
        external
        view
        returns (bool);
}
