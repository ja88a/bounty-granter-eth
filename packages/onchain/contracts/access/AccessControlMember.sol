// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.8.16;

import "./AccessController.sol";
//import "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract AccessControlMember is AccessController {

    // fn: onlyCommitteeMember(address(0))
    // fn{}: require(isCommitteeMember(_committee));

    /** @dev Community owning the module */
    address internal ownerCommunity;

    /** @dev Committee group owning the module */
    address internal ownerCommittee;

    /** @dev Committee group with admin privileges [per members role] */
    address internal adminCommittee;

    /** @dev Event emitted on changes made to one of the contract's committee */
    event ChangeContractCommittee(
        address sender,
        address changedContract,
        bytes32 committeeType,
        address newCommittee,
        uint256 timestamp
    );

    /**
     * @dev Contructor
     * @param _community The community DAO owner of the contract
     * @param _ownerCommittee The community sub-comittee owner of the contract
     * @param _adminCommittee The admin comittee of the contract
     */
    constructor(
        address _community, 
        address _ownerCommittee, 
        address _adminCommittee
        ) {
        /// TODO Check for the validity of specified community & committees
        ownerCommunity = _community;
        ownerCommittee = _ownerCommittee;
        adminCommittee = _adminCommittee;
    }

    /** 
     * @dev Get the module's memberships info
     * @return community The community owning the contract
     * @return committee The committee owning the contract
     * @return admin The committee with privileges to administrate the contract
     */
    function memberships()
        public
        view
        returns (address community, address committee, address admin)
    {
        community = ownerCommunity;
        committee = ownerCommittee;
        admin = adminCommittee;
    }

    /**
     * @dev Change the committee in charge of administrating this contract. Change restricted to *Admin members* only.
     * @param _committee New committee administrator of the contract
     * @return The newly set admin committee
     */
    function changeCommitteeAdmin(address _committee) 
        public
        virtual
        onlyAdmin
        returns(address)
    {
        adminCommittee = _committee;

        emit ChangeContractCommittee(
            msg.sender,
            address(this),
            "admin",
            _committee,
            block.timestamp
        );

        return adminCommittee;
    }

    /**
     * @dev Change the committee in charge of administrating this contract. Change restricted to *Admin members* only.
     * @param _committee New committee owner of the contract
     * @return The newly set owner committee
     */
    function changeCommitteeOwner(address _committee) 
        public
        virtual
        onlyAdmin
        returns (address)
    {
        ownerCommittee = _committee;

        emit ChangeContractCommittee(
            msg.sender,
            address(this),
            "owner",
            _committee,
            block.timestamp
        );

        return ownerCommittee;
    }

    modifier onlyCommunityMember() {
        _checkIfMemberOfCommunity(ownerCommunity, _msgSender());
        _;
    }

    function isCommunityMember()
        internal
        view
        virtual 
    {
        _checkIfMemberOfCommunity(ownerCommunity, _msgSender());
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
        returns (address partOfCommunity)
    {
        // TODO AUT integration to check for BG DAO membership
        //require()
        return _community;
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