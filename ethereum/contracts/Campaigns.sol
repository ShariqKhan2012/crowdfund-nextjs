//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        mapping (address => bool) approvers;
        bool completed;
        uint approvalsCount;
    }

    Request[] public requests;

    address public manager;
    mapping (address => bool) public contributors;
    uint public minContribution;
    uint contributorsCount;
    
    constructor(uint minAmt, address creator) {
        manager = creator;
        minContribution = minAmt;
    }

    function getMinContribution() public view returns (uint){
        return minContribution;
    }

    function getManager() public view returns (address){
        return manager;
    }

    /*function getContributors() public view returns (mapping(address => bool) memory){
        return contributors;
    }*/

    function getBalance() public view returns (uint){
        return address(this).balance;
    }

    function getCampaignSummary() public view returns(uint, uint, uint, uint, address) {
        return (
            minContribution,
            address(this).balance,
            requests.length,
            contributorsCount,
            manager
        );
    }

    function getRequestsCount() public view returns(uint) {
        return requests.length;
    }

    /*function getRequests() public view returns (Request[]) {
        return requests;
    }*/

    /*function getRequestDetail(uint reqIndex) public returns(Request memory) {

    }*/
    

    function contribute() public payable {
        require(msg.value >= minContribution);

        /*
         * Uncomment this line if you want to prevent 
         * users from contributing more than once
         */
        //require(!contributors[msg.sender]);
        
        contributors[msg.sender] = true;
        contributorsCount++;    
    }

    function createRequest(string memory desc, uint val, address payable rcpnt ) public only_manager_can_execute{
        /*Request memory req = Request({
            description: desc,
            value: val,
            recipient: rcpnt,
            completed: false,
            //approvers: 
            approvalsCount: 0
        });
        */

        Request storage req = requests.push();
        req.description = desc;
        req.value = val;
        req.recipient = rcpnt;
        req.completed = false;
        req.approvalsCount = 0;
        //requests.push(req);      
    }

    function approveRequest(uint reqIndex) public {
        // Reqmt #1. User must be a contributor
        require(contributors[msg.sender]);

        // Reqmt #2. User must not be be able to approve a completed request
        Request storage req = requests[reqIndex];
        require(!req.completed);
        
        // Reqmt #3. User must not be be able to approve twice
        require(!req.approvers[msg.sender]);    

        req.approvers[msg.sender] = true;
        req.approvalsCount++;
    }

    function finalizeRequest(uint reqIndex) public only_manager_can_execute {
        Request storage req = requests[reqIndex];

        require(!req.completed);

        require(req.approvalsCount > contributorsCount/2);

        uint amt = req.value;
        req.recipient.transfer(amt);

        req.completed = true;
    }

    modifier only_manager_can_execute() {
        require(msg.sender == manager);
        _;
    }
}

contract CampaignFactory {
    address[] public deployedCampaigns;

    function getdeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }

    function createCampaign(uint minAmt) public {
        address campaignAddr = address(new Campaign(minAmt, msg.sender));
        deployedCampaigns.push(campaignAddr);
    }
}