// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.16;

import "./IAccessController.sol";

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

abstract contract AccessController is IAccessController, AccessControlEnumerable
{
    bytes32 public constant ADMIN = keccak256("ADMIN");

    // AccessControlEnumerable fn: onlyRole(ADMIN)
    // AccessControlEnumerable fn{}: require(hasRole(ADMIN, msg.sender));

    // ReentrancyGuard fn: nonReentrant
}