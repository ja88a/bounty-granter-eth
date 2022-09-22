// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.8.16;

import "./AccessController.sol";
//import "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract AccessControlMember is AccessController {

    // fn: onlyCommunityMember()
    // fn{}: require(hasRole(ADMIN, msg.sender));

    // fn: nonReentrant

    /** @dev Community owning the module */
    address internal community;

    /** @dev Committee group owning the module */
    address internal ownerCommittee;

    /** @dev Committee group with admin privileges [per members role] */
    address internal adminCommittee;

    event ChangeContractCommittee(
        address sender,
        address changedContract,
        bytes32 committeeType,
        address newCommittee
    );

    constructor(address _community, address _ownwerCommittee, address _adminCommittee) {
        // TODO Check validity of specified community & committee
        community = _community;
        ownerCommittee = _ownwerCommittee;
        adminCommittee = _adminCommittee;
    }

    /** 
     * @dev Get the module's memberships info
     * @return owningCommunity The community owning the contract
     * @return owningCommittee The committee owning the contract
     * @return administratingCommittee The committee with privileges to administrate the contract
     */
    function memberships()
        public
        view
        returns (address owningCommunity, address owningCommittee, address administratingCommittee)
    {
        owningCommunity = community;
        owningCommittee = ownerCommittee;
        administratingCommittee = adminCommittee;
    }

    /**
     * @dev Change the committee in charge of administrating this contract. Change restricted to *Admin members* only.
     * @param _committee New committee administrator of the contract
     */
    function changeCommitteeAdmin(address _committee) 
        public
        virtual
        onlyAdmin
    {
        adminCommittee = _committee;

        emit ChangeContractCommittee(
            msg.sender,
            address(this),
            "admin",
            _committee
        );
    }

    /**
     * @dev Change the committee in charge of administrating this contract. Change restricted to *Admin members* only.
     * @param _committee New committee owner of the contract
     */
    function changeCommitteeOwner(address _committee) 
        public
        virtual
        onlyAdmin
    {
        ownerCommittee = _committee;

        emit ChangeContractCommittee(
            msg.sender,
            address(this),
            "owner",
            _committee
        );
    }

    modifier onlyCommunityMember() {
        _checkIfMemberOfCommunity(community, _msgSender());
        _;
    }

    function isCommunityMember()
        internal
        view
        virtual 
    {
        _checkIfMemberOfCommunity(community, _msgSender());
    }

    /**
     * @dev Access guard. Limit access to a member of a given committee
     */
    modifier onlyCommitteeMember(address _committee) {
        require(
            isCommitteeMember(_committee) != address(0), 
            "AccessControlMember: Not Allowed - Must be member of dedicated committee(s)"
        );
        _;
    }

    modifier onlyAdmin() {
        require(
            isCommitteeMember(adminCommittee) == adminCommittee,
            "AccessControlMember: Not Allowed - Must be member of the admin committee"
        );
        _;
    }

    /**
     * @dev Check if the sender is member of the provided committee or is part of the default admin committee. 
     * If the committee is not provided, the sender must be part of either this fatory owner or the admin committee.
     * @param _committee Optional specification of the target committee
     * @return memberOfCommittee The matching committee for acknowledgement, else an empty address is returned.
     */
    function isCommitteeMember(address _committee) 
        internal
        view
        virtual 
        returns (address memberOfCommittee)
    {
        address[] memory targetCommittee;
        targetCommittee = new address[](2);
        if (_committee == address(0)) {
            
            targetCommittee[0] = ownerCommittee;
        } 
        else {
            targetCommittee[0] = _committee;
        }
        targetCommittee[1] = adminCommittee;
        memberOfCommittee = _checkIfMemberOfCommittee(_msgSender(), targetCommittee);
    }

    function _checkIfMemberOfCommunity(address _community, address _account) 
        internal
        view
        virtual
        returns (bool isMember)
    {
        // TODO AUT integration to check for BG DAO membership
        //require()
        return true;
    }

    function _checkIfMemberOfCommittee(address _account, address[] memory _committee) 
        internal
        view
        virtual
        returns (address partOfCommittee)
    {
        //address memory partOfCommunity = _checkIfCommitteePartOfCommunity(community, _account);

        // TODO AUT integration to check for sub-DAO/Committee membership
        // require()
        partOfCommittee = _committee[0];
    }

    function _checkIfCommitteePartOfCommunity(address _committee, address _community)
        internal
        view
        virtual
        returns (address partOfCommunity)
    {
        // TODO AUT integration to check that the sub-DAO/Committee belongs to a given community, e.g. BG DAO

        partOfCommunity = _community;
    }

}