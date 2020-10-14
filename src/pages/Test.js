import React, {useEffect} from 'react'
import FileUtils from './../utilities/FileUtils.js'
import * as Constants from './../constants/LocalStorageConstants.js'
import Computer from 'bitcoin-computer'
import Mnemonic from 'bsv/mnemonic'

export default function TestComputer() {

    const makeCandidate = (name) => {
        const mn = Mnemonic.fromRandom()
        const computer = new Computer({
            seed: mn.toString(),
            chain: "BSV", 
            network: "testnet"
        })
        const newCandidate = {
            name: name,
            seed: mn.toString(),
            key:{
                private:computer.db.wallet.getPrivateKey().toString(),
                public:computer.db.wallet.getPublicKey().toString()
            }
        }
        return newCandidate
    }

    // useEffect(() => {
    //     async function simulateElection() {
    //         const chain = "BSV"

    //         const seedElection = "chunk romance charge minor game hint else verb ghost rubber present team"
    //         const ecomputer = new Computer({ chain: chain, network: 'testnet', seed: seedElection, path: Constants.ELECTION_PATH })
    //         const pubKeyElection = ecomputer.db.wallet.getPublicKey().toString()
    //         console.log(`Election Key: ${pubKeyElection}`)
    //         const ELECTION = await FileUtils.importFromPublic('/contracts/Vote.js')
    //         console.log(`Created Election from file \n ${ELECTION}`)
    //         const title=`Test Election`
    //         const cand1 = makeCandidate("Cand One")
    //         const cand2 = makeCandidate("Cand Two")
    //         let _election = await ecomputer.new(ELECTION, [pubKeyElection, pubKeyElection, title,
    //           1, cand1.name, cand1.key.public, 
    //           cand2.name, cand2.key.public, 
    //           // can3name, can3PK
    //         ])
    //         console.log("created Election on the blockchain. ")
    //         console.log(_election)
            
    //         const password = "pear scrap sock bachelor course hen hour jaguar neck scene inside punch"
    //         const vcomputer = new Computer({ chain: chain, network: 'testnet', seed: password, path: Constants.ELECTION_PATH })
    //         console.log(`Voter Bitcoin|Computer created on ${chain}`)
    //         const pubKey = vcomputer.db.wallet.getPublicKey()
    //         console.log(`Voter ${pubKey}`)
    //         await _election.distribute(pubKey.toString())

    //         //get the voters vote
    //         const voter_revs = await vcomputer.getRevs(pubKey)
    //         const voter_rev = await vcomputer.getLatestRev(voter_revs[0])
    //         console.log(voter_revs)
    //         let currentVote = await vcomputer.sync(voter_revs)
    //         console.log(currentVote)
            
    //         const candidate1 = currentVote.cand1PK
    //         console.log(currentVote._owners[0])
    //         console.log(candidate1)
    //         if (currentVote._owners[0] === candidate1) {
    //             console.log(`Vote is already cast!`)
    //         } else {
    //             let tx = await currentVote.voteA()
    //             console.log(tx)
    //             console.log(currentVote)
    //         }
    //     }
    //     simulateElection()
    // },[])

    useEffect(() => {
        async function executeVote() {
            const password = "pear scrap sock bachelor course hen hour jaguar neck scene inside punch"
            const chain = "BSV"
            const vcomputer = new Computer({ chain: chain, network: 'testnet', seed: password, path: Constants.ELECTION_PATH })
            console.log(`Bitcoin|Computer created on ${chain}`)
            const pubKey = vcomputer.db.wallet.getPublicKey()
            console.log(`Owner ${pubKey}`)
            const voter_rev = '11ff963a7f23e47f8ebbf1f7192ff59b3e9c8fe71d3aeb788ce6a25d4dd40a28:1'
            
            console.log(await vcomputer.getRevs(pubKey))
            let currentVote = await vcomputer.sync(voter_rev)
            console.log(currentVote)
            console.log(await vcomputer.getLatestRev(currentVote._id))
            const candidate1 = currentVote.cand1PK
            console.log(currentVote._owners[0])
            console.log(candidate1)
            if (currentVote._owners[0] === candidate1) {
                console.log(`Vote is already cast!`)
            } else {
                let tx = await currentVote.voteA()
                console.log(tx)
                console.log(currentVote)
            }
        }
        executeVote()
    },[])
    return (
        <div>Look at your console output</div>
    )
}