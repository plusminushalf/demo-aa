// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "hardhat/console.sol";

/**
 * @title Singleton Factory (EIP-2470)
 * @dev Extended version from EIP-2470 for testing purposes
 * @author Ricardo Guilherme Schmidt (Status Research & Development GmbH)
 */
contract Greeter {
    mapping(address => uint256) greets;
    mapping(address => uint256) greetcount;

    function getGreets(address person) external view returns (uint256) {
        return greets[person];
    }

    function getGreetCount(address person) external view returns (uint256) {
        return greetcount[person];
    }

    function addGreet() external payable {
        console.log(address(msg.sender));
        console.log(msg.value);
        greets[msg.sender] += msg.value;
        greetcount[msg.sender] += 1;
        console.log(greets[msg.sender]);
    }

    function withdrawGreet(uint256 amount) external payable {
        if (greets[msg.sender] < amount) return;
        greets[msg.sender] = greets[msg.sender] - amount;
        payable(msg.sender).transfer(amount);
    }
}
