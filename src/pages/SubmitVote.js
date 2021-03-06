import React, { useState, useEffect } from 'react'
import * as Constants from './../constants/LocalStorageConstants.js'
import {
    useHistory
} from "react-router-dom"
import { Avatar, Box, Button, Grid, Card, CardActions, Link, TextField, Typography, Container, CssBaseline } from '@material-ui/core'
import Computer from 'bitcoin-computer'
import VoteWallet from './../components/VoteWallet.js'

export default function SubmitVote() {
    let history = useHistory()
    const [voterList, setVoterList] = useState([])
    const [elections, setElections] = useState(null)
    const [publicKey, setPublicKey] = useState('')
    // computer object for the election
    const [computer, setComputer] = useState(async () => {
        const password = window.localStorage.getItem(Constants.SEED)
        const chain = "BSV"
        const computer = new Computer({ chain: chain, network: 'testnet', seed: password, path: Constants.ELECTION_PATH })
        console.log(`Bitcoin|Computer created on ${chain}`)
        const pubKey = computer.db.wallet.getPublicKey().toString()
        setPublicKey(pubKey)
        console.log(pubKey)
        const revs = await computer.getRevs(pubKey)
        console.log(revs)
        let objs = await Promise.all(revs.map(async rev => computer.sync(rev)))
        //essentially, these are elections
        setElections(objs)
        console.log(objs)
        return computer
    })

    const saveVoters = (voters) => {
        setVoterList(voters)
        localStorage.setItem(Constants.VOTERS, JSON.stringify(voters))
    }

    const getVoters = () => {
        let voters = localStorage.getItem(Constants.VOTERS)
        if (!voters) return []
        if (voters.length === 0) return []
        try {
            return JSON.parse(voters)
        } catch (err) {
            console.error(voters)
            return []
        }
    }

    // const loginVoter = (key) => {
    //     const voter = getVoters().find(v => v.key.public === key)
    //     // login as them
    //     console.log(voter)
    //     localStorage.setItem(Constants.SEED, voter.seed)
    //     history.push('/elections/results')
    // }

    const getElection = (voter) => {
        return [voter.votetx]
        // if (!elections) return [{name:"UNKN ELEC"}]
        // console.log(elections)
        // console.log(voter)
        // const elec = elections.filter(e => e._id === voter._rootId)
        // console.log(elec)
        // return elec
    }

    const renderVoters = () => {
        return getVoters().map(v => {
            const key = v.key.public
            console.log(v)
            //<li key={`${key}`}>{`${v.name} (${v.key.public})`} <button onClick={() => loginVoter(key)}>Login</button></li>
            return (
                <VoteWallet key={`${key}`} option="vote" voter={v} votes={getElection(v)} computer={computer} publicKey={publicKey} />
            )
        })
    }

    return (
        <Container component="main"  >
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h3>Submit Ballots</h3>
                    </div>
                </div>
                <div>
                    <div>{getVoters().length} Votes uncast</div>
                    <div>
                        {renderVoters()}
                    </div>
                </div>
            </div>
        </Container>
    )
}