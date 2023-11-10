// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Staking {
    address public owner;
    uint public stakingPeriod;
    uint public totalRewards;
    mapping(address => uint) public userBalances;
    mapping(address => uint) public stakedBalances;
    mapping(address => uint) public stakingStartTimes;
    address[] public stakedUsers;

    constructor(uint _stakingPeriod, uint _totalRewards) {
        owner = msg.sender;
        stakingPeriod = _stakingPeriod;
        totalRewards = _totalRewards;
    }

    function stake(uint _amount) public {
        require(_amount > 0, "Staked amount must be greater than zero");
        require(userBalances[msg.sender] >= _amount, "Insufficient balance");
        userBalances[msg.sender] -= _amount;
        stakedBalances[msg.sender] += _amount;
        stakingStartTimes[msg.sender] = block.timestamp;
        if (stakingStartTimes[msg.sender] > 0) {
            stakedUsers.push(msg.sender);
        }
    }

    function calculateRewards(address _user) public view returns (uint) {
        uint stakedAmount = stakedBalances[_user];
        uint startTime = stakingStartTimes[_user];
        uint currentTime = block.timestamp;
        if (startTime == 0) {
            return 0; 
        }
        if (currentTime < startTime + stakingPeriod) {
            return 0;
        }
        uint timeStaked = currentTime - startTime;
        return (stakedAmount * timeStaked) / stakingPeriod;
    }

    function distributeRewards() public {
        require(msg.sender == owner, "Only the owner can distribute rewards");
        require(totalRewards > 0, "No rewards to distribute");
        for (uint i = 0; i < stakedUsers.length; i++) {
            address user = stakedUsers[i];
            uint rewards = calculateRewards(user);
            userBalances[user] += rewards;
            totalRewards -= rewards;
            stakedBalances[user] = 0;
            stakingStartTimes[user] = 0;
        }
        delete stakedUsers;
    }

    function withdraw() public {
        uint stakedAmount = stakedBalances[msg.sender];
        uint rewards = calculateRewards(msg.sender);
        uint totalAmount = stakedAmount + rewards;
        require(totalAmount > 0, "No funds to withdraw");
        stakedBalances[msg.sender] = 0;
        stakingStartTimes[msg.sender] = 0;
        userBalances[msg.sender] += totalAmount;
    }
}