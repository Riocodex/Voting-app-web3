const { expect } = require("chai");
const { ethers } = require("hardhat");

const money = {value: hre.ethers.utils.parseEther("10")};

describe('Votingapp', ()=>{
    let electionOwner, candidate1, candidate2, candidate3, voter1, voter2,  voter3, voter4
    let votingContract, winner
    let highestVotes = 0

    it('saves the addresses', async() =>{

        //setup accounts
        [electionOwner, candidate1, candidate2, candidate3, voter1, voter2,  voter3, voter4] = await ethers.getSigners()

        //deploy Voting app
        const VotingContract = await ethers.getContractFactory('Voting')
        votingContract = await VotingContract.deploy()
        console.log(votingContract.address)
    })
    it('starts election', async () =>{
           //start Election
           let transaction = await votingContract.connect(electionOwner).startElection("president",20,money)
           await transaction.wait()
            //getting details of the election
           let returnElectionDetails = await votingContract.getElectionDetails();

           expect( returnElectionDetails.title).to.be.equal('president')
    })



    it('allows users to register', async()=>{
        //register as candidates
        await votingContract.connect(candidate1).register('rio' , money);
        await votingContract.connect(candidate2).register('patrick' , money);
        await votingContract.connect(candidate3).register('king' , money);

        //getting details from the candidates array
        let candidates = await votingContract.getCandidates();
        //comparing details
        expect(candidates[0].name).to.be.equal('rio')
        expect(candidates[1].name).to.be.equal('patrick')
        expect(candidates[2].name).to.be.equal('king')
    })
    
  

    it('allows users to vote', async () =>{
        //voting operation
        await votingContract.connect(voter1).vote('rio' , money);
        await votingContract.connect(voter2).vote('rio' , money);
        await votingContract.connect(voter3).vote('patrick' , money);
        await votingContract.connect(voter4).vote('king' , money);

         //getting details from the candidates array
         let candidates = await votingContract.getCandidates();

         expect(candidates[0].numVotes).to.be.equal(2)//for rio
         expect(candidates[1].numVotes).to.be.equal(1)//for patrick
         expect(candidates[2].numVotes).to.be.equal(1)//for king


         
    })

    it('picks a winner', async() =>{
        let candidates = await votingContract.getCandidates();
            //return winner
            for(var i = 0; i<candidates.length; i++){
                if(candidates[i].numVotes > highestVotes ){
                    highestVotes = candidates[i].numVotes ;   
                }
            }

            for(var i = 0; i< candidates.length; i++){
                if(candidates[i]. numVotes == highestVotes){
                    winner = candidates[i].name;
                }
                
            }
            //since winner is rio cuz he has highest votes
            expect(winner).to.be.equal('rio')
        
    })


})
