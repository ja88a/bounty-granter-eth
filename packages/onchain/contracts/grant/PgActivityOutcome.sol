// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.16;

import "../project/IProjectGrantRegistry.sol";
import "../project/IProjectGrantCollection.sol";
import "../access/AccessControlRole.sol";

/**
 * @title Handler of project grants' Activity Outcomes
 * @dev 
 * - Decode the submitted activity outcome to be processed on-chain: based on a CBOR decoding
 * - Check for the validity of submitted project grant activity outcome: based on a merkle tree proofing mechanism
 *      - extract actual leaf value
 *      - hashing of the leaf value
 *      - submitted proofs and the hash are verfied against the project grant root value
 * - Computation of amounts to transfer to actors
 *      - query conditions' computed ratings, based on their associated oracle output
 *      - apply ratings to the transfers' amount
 * - Trigger asset transfers based on the associated sharing model among actors
 * - Report the results of a claim for unlocking assets
 */ 
contract PgActivityOutcome is AccessControlRole {

    /** @dev Registration handler of created project grants */
    address private projectGrantRegistry;

    /** @notice Event emited on successful claim for asset transfer(s) */
    event ClaimActivityOutcomeTransfer(
        address initiator,
        uint256 index,
        address indexed collectionAddress,
        string name,
        uint256 timestamp
    );

    /**
     * @dev Constructor of the factory
     * @param _pgRegistry Address of the registry where project grants are reported
     * @param _community Address of the owning community group (DAO)
     * @param _owner Committee owner of this contract (sub-DAO)
     * @param _admin Committee with admin rights (sub-DAO)
     * @param _ownerActions Actions available to owners
     * @param _adminActions Actions available to admins
     */
    constructor(
        address _pgRegistry,
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
        projectGrantRegistry = _pgRegistry;
    }

    /**
     * @notice Retrieve the project grants Registry set for this factory
     * @return Address of the project grant registry contract
     */
    function getProjectGrantRegistry()
        public
        view
        returns (address)
    {
        return projectGrantRegistry;
    }

    /**
     * @notice Submit the processing of a Project Grant Activity Outcome in order to unlock its allowed asset transfers
     * @param projectGrantId Target project grant ID which activity outcome is to be handled
     * @param activityOutcome Original activity Outcome specifications, CBOR encoded
     * @param proofs Merkle tree proofs to check for the validity of the submitted activity outcome
     * @return Total number of unlocked assets
     */
    function processOutcome(
        uint256 projectGrantId,
        bytes calldata activityOutcome,
        bytes32[] calldata proofs
        )
        public
        returns(uint)
    {
        IProjectGrantRegistry.ProjectGrant memory projectGrant = IProjectGrantRegistry(projectGrantRegistry).projectGrantByIndex(projectGrantId, true);
        
        // CHECKS
        IProjectGrantCollection pgCollection = IProjectGrantCollection(projectGrant.collection);
        require(
            pgCollection.supportsInterface(type(IProjectGrantCollection).interfaceId)
        );
        

        // EFFECTS

        // INTERACTIONS
    }
}