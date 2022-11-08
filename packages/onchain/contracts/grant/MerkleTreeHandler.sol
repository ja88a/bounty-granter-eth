// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.8.16;

import "../access/AccessControlRole.sol";

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title Handler of merkle tree computations and proofing
 * @dev Enable verifying/validating a submitted leaf value against 
 * provided proofs and the tree root.
 */ 
contract MerkleTreeHandler is AccessControlRole {

    /**
     * @notice Constructor
     * @param _community Address of the owning community group (DAO)
     * @param _owner Committee owner of this contract (sub-DAO)
     * @param _admin Committee with admin rights (sub-DAO)
     * @param _ownerActions Actions available to owners
     * @param _adminActions Actions available to admins
     */
    constructor(
        address _community,
        address _owner,
        address _admin,
        uint32[] memory _ownerActions,
        uint32[] memory _adminActions
        )
        AccessControlRole(
            _community,
            _owner,
            _admin,
            _ownerActions,
            _adminActions
            )
    {
        
    }

}