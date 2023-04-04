// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

interface IProjectGrantCollection is 
    IERC721Metadata, IERC721Enumerable
{
    function version()
        external
        view
        returns (string memory);

    function mintItem(address to, string memory uri) 
        external 
        returns (uint256);

    function tokenURI(uint256 tokenId)
        external
        view
        returns (string memory);

}
