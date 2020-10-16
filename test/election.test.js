import Computer from 'bitcoin-computer'
import Mnemonic from 'bsv/mnemonic'
import { ExpansionPanelActions } from '@material-ui/core'
//import FileUtils from './../src/utilities/FileUtils'
//import Vote from './../public/contracts/Vote'
// import fs from 'fs'

const bsv = 'BSV'
const network = "testnet"
const seed = 'actual perfect tag maid suit device street mule guitar strong effort empower'
//const path = Constants.ELECTION_PATH

const voters = [
 {
    key: {
        private: "c9848f39fc6c46c8178f7c8687a65ab090a14ca51aa63f9db49500098ce484d6",
        public: "0257d7d3968646dd53ca2488620300c9ddad3f6bd63f651e24899c6edfb6b83394"
    },
    name: "Unselfish Grandmother",
    seed: "pear scrap sock bachelor course hen hour jaguar neck scene inside punch"
    }
]

const createCandidate = (name) => {
    const mn = Mnemonic.fromRandom()
    const computer = new Computer({
        seed: mn.toString(),
        chain: bsv, 
        network: network
    })
    const newCand = {
        name: name,
        seed: mn.toString(),
        key:{
            private:computer.db.wallet.getPrivateKey().toString(),
            public:computer.db.wallet.getPublicKey().toString()
        }
    }
    return newCand
}

// test('should initialize computer', () => {
//     const computer = new Computer()
//     expect(computer).toBeDefined()
//     console.log(computer.db.wallet.mnemonic.toString())
// })
it('should run election', async () => {
    const computerElection = new Computer({
        network: network,
        chain:bsv,
        seed:seed
    })
    console.log(computerElection)
    const epubKey = computerElection.db.wallet.getPublicKey().toString()
    // console.log(epubKey)
    // from MintElection, create election
    // const ELECTION = fs.readFileSync('./public/contracts/Vote.js')
    // console.log(`Created Election from file \n ${ELECTION}`)
    const CANDIDATE1 = createCandidate("Candidate 1")
    const CANDIDATE2 = createCandidate("Candidate 2")
    let _election = await computerElection.new(Vote, [
        epubKey, epubKey, "Test Election", 
        voters.length, 
        CANDIDATE1.name, CANDIDATE1.key.public, 
        CANDIDATE2.name, CANDIDATE2.key.public
      ])
    console.log(_election)
    const voter = voters[0]
    // from SendVote, distribute votes to voters
    let tx = await _election.distribute(
        voter.key.public
    )
    console.log(tx)
    // simulate what app does, puts vote on voter object
    voter.votetx = tx
    // voter votes
    const vcomputer = new Computer({ 
        chain:bsv,
        network: network, 
        seed: voter.seed
    })
    console.log(`Bitcoin|Computer created on ${bsv}`)
    const voterPubKey = vcomputer.db.wallet.getPublicKey().toString()
    let currentVote = await vcomputer.sync(voter.votetx._rev)
    //vote for candidate1
    let castVote = await currentVote.voteA()
    console.log(castVote)
    // show results candidate 1
    const candidate1 = vcomputer.sync(castVote._rev)
    //expect candidate1 to be owner
    console.log('is can1 owner?',candidate1._owners[0] === castVote.can1PK)

}, 15000)

class Vote {
    constructor(to, distributor, name, numberOfVotes, 
      can1name, can1PK, 
      can2name, can2PK
      ) {
      this.votes = numberOfVotes
      this._owners = [to]
      // name of the election
      this.name = name
      this.can1name = can1name
      this.can2name = can2name
      this.cand1PK = can1PK
      this.cand2PK = can2PK 
      this.distributor = distributor
    }
  
    distribute(to) {
      if (this.votes < 1){ throw new Error("There are not enough votes to distribute")}
      if (this._owners[0].toString() !== this.distributor.toString()){
           throw new Error('You cannot send your vote to another person.')
      }
      this.votes -= 1
      return new Vote(to,
                      this.distributor, 
                      this.name, 
                      1,
                      this.can1name,
                      this.cand1PK,
                      this.can2name,
                      this.cand2PK,
                      )
    }
  
    voteA() {
      console.log(this.cand1PK)
      this._owners = [this.cand1PK]
    }
  
    voteB() {
      this._owners = [this.cand2PK]
    }
  }
