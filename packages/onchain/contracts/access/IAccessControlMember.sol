// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.16;

import "./IAccessController.sol";

interface IAccessControlMember is IAccessController {
    
    /** @dev Event emitted on changes made to one of the contract's committee */
    event ChangeContractCommittee(
        address sender,
        address changedContract,
        bytes32 committeeType,
        address newCommittee,
        uint256 timestamp
    );
    
    /** 
     * @notice Get the module's memberships info
     * @return community The community owning the contract
     * @return committee The committee owning the contract
     * @return admin The committee with privileges to administrate the contract
     */
    function memberships()
        external
        view
        returns (address community, address committee, address admin);

    /**
     * @notice Change the committee in charge of administrating this contract. Change restricted to *Admin members* only.
     * @param _committee New committee administrator of the contract
     * @return The newly set admin committee
     */
    function changeCommitteeAdmin(address _committee) 
        external
        returns(address);

    /**
     * @notice Change the committee in charge of administrating this contract. Change restricted to *Admin members* only.
     * @param _committee New committee owner of the contract
     * @return The newly set owner committee
     */
    function changeCommitteeOwner(address _committee) 
        external
        returns (address);

    // function isCommunityMember()
    //     external
    //     view;

    // /**
    //  * @dev Check if the sender is member of the provided committee or is part of the default admin committee. 
    //  * If the committee is not provided, the sender must be part of either this fatory owner or the admin committee.
    //  * @param _committee Optional specification of the target committee
    //  * @return memberOfCommittee The matching committee for acknowledgement, else an empty address is returned.
    //  */
    // function isCommitteeMember(address _committee) 
    //     external
    //     view
    //     returns (address memberOfCommittee);

    // function _checkIfMemberOfCommunity(address _community, address _account) 
    //     external
    //     view
    //     returns (address partOfCommunity);

    // function _checkIfMemberOfCommittee(address _account, address[] memory _committee) 
    //     external
    //     view
    //     returns (address partOfCommittee);

    // function _checkIfCommitteePartOfCommunity(address _committee, address _community)
    //     external
    //     view
    //     returns (address partOfCommunity);

}