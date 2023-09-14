
const hre = require("hardhat");

async function main() {
//connecting the contract 
  const VotingContractFactory = await hre.ethers.getContractFactory("Voting");
  const votingContract = await VotingContractFactory.deploy();
  await votingContract.deployed();
//console.logging the value
  console.log("VotingContract deployed to:", votingContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
