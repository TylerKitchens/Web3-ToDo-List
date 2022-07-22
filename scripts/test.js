// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");


async function main() {
    const [owner] = await hre.ethers.getSigners()

    const ToDo = await hre.ethers.getContractFactory("ToDo")
    const toDo = await ToDo.deploy()
    await toDo.deployed()

    console.log('ToDo Deployed To: ', toDo.address)
    await toDo.connect(owner).addTask("Eat Shit")

    const tasks = await toDo.getTasks()
    for (const task of tasks) {
        console.log(`Task: ${task.task}, isDone: ${task.isDone ? 'YES' : 'NO'}`)
    }
    console.log('---- UPDATING TASK ----')
    await toDo.updateStatus(0, true)

    const tasks2 = await toDo.getTasks()
    for (const task of tasks2) {
        console.log(`Task: ${task.task}, isDone: ${task.isDone ? 'YES' : 'NO'}`)
    }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
