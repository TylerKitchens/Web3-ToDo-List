/*
 *  Contract Deployed to 0xC199D4dDe673E801ef631daF8f963CA35c1707ef
 */


// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

contract ToDo {
    event NewTask(
        address indexed from,
        uint256 timestamp,
        string task,
        bool isDone
    );

    struct Task {
        string task;
        bool isDone;
        uint256 timestamp;
    }

    //Map the user address to their tasks
    mapping(address => Task[]) private Users;

    constructor() {}

    //get the task data, find the user from their address, add new task
    function addTask(string memory _task) public {
        Task memory newTask = Task({
            task: _task,
            timestamp: block.timestamp,
            isDone: false
        });

        Users[msg.sender].push(newTask);
        emit NewTask(
            msg.sender,
            block.timestamp,
            _task,
            false
        );
    }

    function getTask(uint256 _taskIndex) public view returns (Task memory) {
        Task storage task = Users[msg.sender][_taskIndex];
        return task;
    }

    function updateStatus(uint256 _taskIndex, bool _status) public {
        Users[msg.sender][_taskIndex].isDone = _status;
    }

    function deleteTask(uint256 _taskIndex) external {
        delete Users[msg.sender][_taskIndex];
    }

    function getTasks() public view returns (Task[] memory) {
        return Users[msg.sender];
    }
}
