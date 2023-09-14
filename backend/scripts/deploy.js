
const hre = require("hardhat");

async function main() {
//connecting the contract 
  const VotingContractFactory = await hre.ethers.getContractFactory("Voting");
  const votingContract = await VotingContractFactory.deploy();
  await votingContract.deployed();
//console.logging the value
  console.log("VotingContract deployed to:", votingContract.address);

  //operations
//statevariables

const money = {value: hre.ethers.utils.parseEther("10")};
//candidate accounts
const [owner, tipper, tipper2, tipper3 , tipper4 ] = await hre.ethers.getSigners();

//voters accounts
const [voter1 , voter2 ,voter3 , voter4] = await hre.ethers.getSigners();

//start election
await votingContract.connect(tipper).startElection('deployer' , 20 ,money);

//register as candidates
await votingContract.connect(tipper2).register('rio' , money);
await votingContract.connect(tipper3).register('patrick' , money);
await votingContract.connect(tipper4).register('king' , money);

//voting operation
await votingContract.connect(voter1).vote('rio' , money);
await votingContract.connect(voter2).vote('rio' , money);
await votingContract.connect(voter3).vote('patrick' , money);
await votingContract.connect(voter4).vote('king' , money);

//deciding winner
await votingContract.decideWinner();



//return candidates
let candidates = await votingContract.getCandidates();
console.log("candidates for the election are: ", candidates);

//return winner
let winner = await votingContract.viewWinner();
console.log("and the winner of this election is...." , winner);
// return electionDetails
let returnElectionDetails = await votingContract.getElectionDetails();
console.log('Election Details are: ', returnElectionDetails);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
