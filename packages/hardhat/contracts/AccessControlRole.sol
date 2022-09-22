// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.8.16;

import "./AccessControlMember.sol";

/**
 * @title Committee Members Role-based Access Controller for contracts' methods & inner actions.
 * Support for checking allowances of only 2 committees: an admin and an owner committee handling the contract.
 * A maximum number of 2^8 actions can be registered for each committee.
 * Only members of the admin committee can change the supported actions and associated member roles for a specific committee.
 * When changing a committee associated to the contract, admin or owner, associated allowed roles must be set again.
 
 * Caution: When instantiating such a contract, restricted actions are set via the constructor, but whitelisted committee member roles must be set afterwhile
 */
abstract contract AccessControlRole is AccessControlMember {

    /** @dev Supported actions for which a given role in the owning committee is required */
    bytes32[] private actionsCommittee;

    /** @dev Association of actions towards their allowed roles for members of the owner committee */
    mapping (bytes32 => bytes32[]) internal actionRolesCommittee;

    /** @dev Supported actions for which a given role in the admin committee is required */
    bytes32[] private actionsAdmin;

    /** @dev Association of actions towards their allowed roles for members of the admin committee */
    mapping (bytes32 => bytes32[]) internal actionRolesAdmin;

    /** @dev Effective change on registered allowed actions for a given committee */
    event ChangeCommitteeActions (
        address sender,
        address changedContract,
        address committee,
        bytes32[] actions
    );

    /** @dev Effective change on committee member roles allowed to perform an action */
    event ChangeActionRoles (
        address sender,
        address changedContract,
        bytes32 action,
        address committee,
        bytes32[] roles
    );

    /**
     * @dev Constructor
     * @param _actionsCommittee List of actions requiring a specific member role from the owning Committee to access some contract methods
     * @param _actionsAdmin List of actions requiring a specific member role from the admin Committee to access some contract methods
     */
    constructor(address _community, address _ownerCommittee, address _adminCommittee, 
        bytes32[] memory _actionsCommittee, bytes32[] memory _actionsAdmin) 
        AccessControlMember(_community, _ownerCommittee, _adminCommittee)
    {
        uint256 acl = _checkActionsLength(_actionsCommittee);
        uint256 aal = _checkActionsLength(_actionsAdmin);
        require(
            acl > 0 || aal > 0,
            "AccessControlRole: no need for role-based action control"
        );
        actionsCommittee = _actionsCommittee;
        actionsAdmin = _actionsAdmin;
    }

    function _checkActionsLength(bytes32[] memory _actions) 
        private
        pure
        returns (uint256 len)
    {
        len = _actions.length;
        // require(
        //     acl > 0,
        //     "AccessControlRole: No role-based actions specified"
        // );
        require(
            len < 256,
            "AccessControlRole: Number of actions is limited to 256 per comittee"
        );
    }

    /** 
     * @dev Check if sender has the necessary committee role to perform the action
     * @param _action Action to be granted, registered as supported by the contract
     */
    modifier onlyCommitteeRole(bytes32 _action) {
        bytes32[] memory allowedRoles = getActionRoles(_action, ownerCommittee);
        require(
            allowedRoles.length > 0,
            string.concat("AccessControlRole: No committee roles associated to action ", string(abi.encodePacked(_action)))
        );

        // TODO AUT Extract current msg.sender roles for the specified committee & check if matching

        _;
    }
    
    /** 
     * @dev Check if sender has the necessary admin role to perform the action
     * @param _action Action to be granted, registered as supported by the contract
     */
    modifier onlyAdminRole(bytes32 _action) {
        require(
            isCommitteeMember(adminCommittee) != address(0),
            "AccessControlRole: Must be admin"
        );

        bytes32[] memory allowedRoles = getActionRoles(_action, adminCommittee);
        require(
            allowedRoles.length > 0,
            string.concat("AccessControlRole: No admin roles associated to action ", string(abi.encodePacked(_action)))
        );

        // TODO AUT Extract current msg.sender roles & check if matching

        _;
    }

    /**
     * @dev List the roles required for performing a given action
     * @param _action The action for which granted roles are requested
     * @param _committee The committee for which specific roles are requested: admin or owner committee
     * @return roles Committee roles granted to perform the action
     */
    function getActionRoles(bytes32 _action, address _committee)
        public
        view
        onlyCommitteeMember(address(0))
        returns (bytes32[] memory roles)
    {
        if (_committee == ownerCommittee) {
            roles = actionRolesCommittee[_action];
        }
        else if (_committee == adminCommittee) {
            roles = actionRolesAdmin[_action];
        }
    }

    /** 
     * @dev Get the list of allowed actions for the members of a given committee
     * @param _committee Target committee
     */
    function listAllowedActions(address _committee)
        public
        view
        returns (bytes32[] memory actionsR)
    {
        require(
            _committee == ownerCommittee || _committee == adminCommittee,
            "AccessControlRole: Unsupported committee"
        );
        if (_committee == ownerCommittee)
            actionsR = actionsCommittee;
        else
            actionsR = actionsAdmin;
    }

    /**
     * @dev Change the set of allowed actions for a given committee. Restricted to *Admin members* only.
     * @param _committee Target committee
     * @param _actions Allowed actions
     * @return actionsSet The list of actions as updated
     */
    function setAllowedActions(address _committee, bytes32[] memory _actions) 
        public
        onlyAdmin
        returns (bytes32[] memory actionsSet)
    {
        // => Checks
        _checkActionsLength(_actions);
        require(
            _committee != address(0) && (_committee == ownerCommittee || _committee == adminCommittee),
            "AccessControlRole: Invalid target committee"
        );

        // => Effects
        if (_committee == adminCommittee)
            actionsAdmin = _actions;
        else
            actionsCommittee = _actions;

        actionsSet = _actions;

        // => Interactions
        emit ChangeCommitteeActions(
            msg.sender,
            address(this),
            _committee,
            actionsSet
        );
    }

    /** 
     * @dev Associate member roles to a given action in order to allow their access to gated functions. Change restricted to *Admin members* only.
     * @param _action Action to which committee roles must be associated. Actions are contract specific.
     * @param _committee The committe to which roles refer to: either the admin or owner committee
     * @param _roles List of members' roles granted to perform the action
     * @return rolesSet List the newly set roles of the committee members granted to perform the action 
     */
    function setActionRoles(bytes32 _action, address _committee, bytes32[] memory _roles) 
        public
        onlyAdmin
        returns (bytes32[] memory rolesSet)
    {
        // => Checks
        require(
            _action != "",
            "AccessControlRole: Empty action"
        );
        require(
            _roles.length > 0,
            "AccessControlRole: At least one role must be specified"
        );

        // check if the action is registered
        bytes32 tAction;

        bytes32[] memory registeredActions;

        if (_committee == ownerCommittee) {
            registeredActions = actionsCommittee;
        }
        else if (_committee == adminCommittee) {
            registeredActions = actionsAdmin;
        }

        for (uint32 i=0; i < registeredActions.length; i++) {
            if (registeredActions[i] == _action) {
                tAction = _action;
                break;
            }
        }
        require(
            tAction != "",
            "AccessControlRole: Action not registered as allowed for the committee"
        );

        // => Effects
        if (_committee == ownerCommittee) {
            actionRolesCommittee[tAction] = _roles;
            rolesSet = _roles;
        }
        else if (_committee == adminCommittee) {
            actionRolesAdmin[tAction] = _roles;
            rolesSet = _roles;
        }
        
        // => Interactions
        emit ChangeActionRoles(
            msg.sender,
            address(this),
            _action,
            _committee,
            _roles
        );
    }

    /** 
     * @dev Change the contract's owner committee
     * **Caution**: Granted member roles for actions are emptied and must be set again
     * @param _committee New committee owning the contract
     */
    function changeCommitteeOwner(address _committee) override
        public
        onlyAdmin
    {
        bytes32[] memory empty = new bytes32[](0);
        for (uint256 i=0; i < actionsCommittee.length; i++) {
            actionRolesCommittee[actionsCommittee[i]] = empty;
        }
        super.changeCommitteeOwner(_committee);
    }

    
    /** 
     * @dev Change the contract's admin committee
     * **Caution**: Granted member roles for actions are emptied and must be set again
     * @param _committee New committee administrating the contract
     */
    function changeCommitteeAdmin(address _committee) override
        public
        onlyAdmin
    {
        bytes32[] memory empty = new bytes32[](0);
        for (uint256 i=0; i < actionsAdmin.length; i++) {
            actionRolesAdmin[actionsAdmin[i]] = empty;
        }
        super.changeCommitteeAdmin(_committee);
    }
}