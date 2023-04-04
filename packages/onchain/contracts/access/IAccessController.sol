// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.16;

import "@openzeppelin/contracts/access/IAccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IAccessController is IAccessControlEnumerable, IERC165
{
    
}