import React, {useState, useEffect} from "react"
import Computer from 'bitcoin-computer'
import * as Constants from './../constants/LocalStorageConstants.js'
import {Button, Card, Grid} from '@material-ui/core'
import MintElection from './../components/MintElection.js'
import useInterval from './../utilities/UseInterval'
import VoteWallet from './../components/VoteWallet.js'
import AddressDetails from './../components/AddressDetails.js'

function Elections({_objects})
{
    const [computer, setComputer] = useState(null)
    const [objects, setObjects] = useState(_objects)
    const [chain, setChain] = useState('BSV')
    const [address, setAddress] = useState('Loading...')
    const [balance, setBalance] = useState(0)
    const [publicKey, setPublicKey] = useState('Loading...')
  
    useInterval(() => {
      // BIP_39_KEY & CHAIN is set on login and we fetch it from local storage
      const password = window.localStorage.getItem(Constants.SEED)
      setChain("BSV")
  
      const isLoggedIn = password && chain
      // if you are currently logging in
      if (isLoggedIn && !computer){
        setComputer(new Computer({ chain: "BSV", network: 'testnet', seed: password, path: Constants.ELECTION_PATH }))
        console.log("Bitcoin Computer created on " + chain)
      // if you are currently logging out
      } else if (!isLoggedIn && computer){
        console.log("You have been logged out")
        setComputer(null)
      }

      const refresh = async () => {
        if (computer) {
          let a = await computer.db.wallet.getAddress().toString()
          setAddress(a)
          let b = await computer.db.wallet.getBalance()
          setBalance(b)
          console.log('async initializing the  default computer')
          setPublicKey(computer.db.wallet.getPublicKey().toString())
          console.log(publicKey)
          const revs = await computer.getRevs(publicKey)
          console.log(revs)
          let objs = await Promise.all(revs.map(async rev =>  computer.sync(rev)))
          console.log(objs)
          setObjects(objs)
        }
      }
      refresh()
    }, 5000)
  
    const groupByRoot = (list) => list.reduce(
      (acc, obj) => ({
        ...acc,
        [obj['_rootId']]: (acc[obj['_rootId']] || []).concat(obj)
      }),
      {}
    )

    const getVoters = () => {
      let voters = localStorage.getItem(Constants.VOTERS)
      if (!voters) return []
      if (voters.length === 0) return []
      //console.log(voters)
      try {
          return JSON.parse(voters)
      } catch (err) {
          console.error(voters)
          return []
      }
  }

  const getFirstVoter = () => {
    const voters = getVoters().filter(v => v.votetx === undefined)
    if (voters.length === 0) return null
    return voters[0]
  }

  const resetVoting = () => {
    const voters = getVoters()
    for( let i = 0; i < voters.length; i++) {
      delete voters[i].votetx 
    }
    saveVoters(voters)
  }
  
  const saveVoters = (voters) => {
    localStorage.setItem(Constants.VOTERS,JSON.stringify(voters))
  }

    return (
        <div>
          <AddressDetails computer={computer} balance={balance} address={address} publicKey={publicKey} />
          <Grid container> 
            <Grid item xs={12} md={4} align='center'>
              <MintElection computer={computer} />
            </Grid>
            <Grid item md={8}>
              <Grid container>
                {objects && Object.values(groupByRoot(objects)).map((o) => 
                <VoteWallet key={o[0]._id} option="distribute" voter={getFirstVoter()} votes={o} computer={computer} publicKey={publicKey} />
                )}
              </Grid>
            </Grid>
          </Grid>
          <Button onClick={() => resetVoting()}>Reset Voting</Button>
        </div>
    )
  }
  
  export default Elections