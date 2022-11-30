// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.8.16;

import "./IAccessControlMember.sol";

/**
 * @title Committee Members Role-based Access Controller for contracts' methods & inner actions.
 * @dev Support for checking allowances of only 2 committees: an admin and an owner committee handling the contract.
 * A maximum number of 2^8 actions can be registered for each committee.
 * Only members of the admin committee can change the supported actions and associated member roles for a specific committee.
 * When changing a committee associated to the contract, admin or owner, associated allowed roles must be set again.
 
 * @dev Caution: When instantiating such a contract, restricted actions are set via the constructor, but whitelisted committee member Roles must be set afterwhile
 */
interface IAccessControlRole is IAccessControlMember {

    /** @notice Effective change on registered allowed actions for a given committee */
    event ChangeCommitteeActions (
        address sender,
        address changedContract,
        address committee,
        uint32[] actions,
        uint256 timestamp
    );

    /** @notice Effective change on committee member roles allowed to perform an action */
    event ChangeActionRoles (
        address sender,
        address changedContract,
        uint32 action,
        address committee,
        bytes32[] roles,
        uint256 timestamp
    );

    /**
     * @notice List the roles required for performing a given action
     * @param _action The action for which granted roles are requested
     * @param _committee The committee for which specific roles are requested: admin or owner committee
     * @return roles Committee roles granted to perform the action
     */
    function getActionRoles(uint32 _action, address _committee)
        external
        view
        returns (bytes32[] memory roles);

    /** 
     * @notice Get the list of allowed actions for the members of a given committee
     * @param _committee Target committee
     */
    function listAllowedActions(address _committee)
        external
        view
        returns (uint32[] memory actionsR);

    /**
     * @notice Change the set of allowed actions for a given committee. Restricted to *Admin members* only.
     * @param _committee Target committee
     * @param _actions Allowed actions
     * @return actionsSet The list of actions as updated
     */
    function setAllowedActions(address _committee, uint32[] memory _actions) 
        external
        returns (uint32[] memory actionsSet);

    /** 
     * @notice Associate member roles to a given action in order to allow their access to gated functions. Change restricted to *Admin members* only.
     * @param _action Action to which committee roles must be associated. Actions are contract specific.
     * @param _committee The committe to which roles refer to: either the admin or owner committee
     * @param _roles List of members' roles granted to perform the action
     * @return rolesSet List the newly set roles of the committee members granted to perform the action 
     */
    function setActionRoles(uint32 _action, address _committee, bytes32[] memory _roles) 
        external
        returns (bytes32[] memory rolesSet);

    /** 
     * @notice Change the contract's owner committee
     * **Caution**: Granted member roles for actions are emptied and must be set again
     * @param _committee New committee owning the contract
     */
    function changeCommitteeOwner(address _committee) override
        external
        returns(address);

    /** 
     * @notice Change the contract's admin committee
     * **Caution**: Granted member roles for actions are emptied and must be set again
     * @param _committee New committee administrating the contract
     */
    function changeCommitteeAdmin(address _committee) override
        external
        returns (address);
}