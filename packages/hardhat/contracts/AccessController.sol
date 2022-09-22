// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.8.16;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

abstract contract AccessController is AccessControlEnumerable, ReentrancyGuard {
    bytes32 public constant ADMIN = keccak256("ADMIN");

    // fn: onlyRole(ADMIN)
    // fn{}: require(hasRole(ADMIN, msg.sender));

    // fn: nonReentrant
}