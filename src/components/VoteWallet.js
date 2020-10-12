import React, {useEffect, useState} from 'react'
import * as Constants from './../constants/LocalStorageConstants.js'
import {useHistory} from 'react-router-dom'
import {Button, Card, CardContent, CardActions, Grid, Typography} from '@material-ui/core'
import SendVote from './../components/SendVote.js'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { makeStyles } from '@material-ui/core/styles';
import Computer from 'bitcoin-computer'

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      padding: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    paddedPaper: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    darkPaperLeft: {
      padding: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      backgroundColor: '#000', color: '#fff'
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    }
  }));

  // this will sync the vote
function VoteWallet({option, voter, votes, computer, publicKey, rev}){
    // first is the vote contract object! for election?
    const [election] = votes || [{name:"invalid"}]
    const [votePublicKey, setVotePublicKey] = useState('')
    const [voteObjs, setVoteObjs] = useState(null)
    // computer object for the voter
    const [computerVoter, setComputerVoter] = useState(async () => {
      if (option == 'distribute') return null
      const password = voter.seed
      const chain = "BSV"
      const vcomputer = new Computer({ chain: chain, network: 'testnet', seed: password, path: Constants.ELECTION_PATH })
      console.log(`Bitcoin|Computer created on ${chain}`)
      const pubKey = vcomputer.db.wallet.getPublicKey().toString()
      setVotePublicKey(pubKey)
      console.log(pubKey)
      const revs = await vcomputer.getRevs(pubKey)
      console.log(revs)
      let objs = await Promise.all(revs.map(async rev =>  vcomputer.sync(rev)))
      setVoteObjs(objs)
      console.log(objs)
      return vcomputer
  })

    let classes = useStyles()
    // useEffect(()=>{
    //   const setUp = async () => {
    //     console.log('rev ' + rev)
    //     console.log(votes[0].distributor + " " + publicKey + "" + votes[0].can1PK)
    //     if(votes[0].distributor === publicKey){
    //       setDistribute(true)
    //     }
    //     let _vote = await computer.sync(rev)
    //     console.log(_vote)
    //     setVote(_vote)
    //   }
    //   setUp()
    // }, [votes, publicKey, rev, computer])

    useEffect(()=>{
      // console.log(option)
      console.log(election)
      console.log(voter)
      console.log(voteObjs)
      // if (votes && votes.length>0) {
      //   console.log(votes)
      //   console.log(election.distributor)
      //   console.log(election.cand1PK)
      // }
    })

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

    const getFirstVoter = () => {
      const voters = getVoters().filter(v => v.votetx === undefined)
      if (voters.length === 0) return null
      return voters[0]
    }

    const findVoteInThisElection = () => {
      if (voteObjs === null) {
        console.log(`no votes available`)
        return null
      }
      const find = voteObjs.filter(v => v._id === election._id)
      if (find.length === 0) return null
      return find[0]
    }

    const candidate1Click = async (e) =>{
      try{
        let tx = await voteObjs[0].voteA(publicKey)
        console.log(tx)
      }catch(err){alert(err)}
    }

    const candidate2Click = async (e) =>{
      try{
        let tx = await voteObjs[0].voteB(publicKey)
        console.log(tx)
      }catch(err){alert(err)}
  }

    // const candidate3Click = async (e) =>{
    //   let tx = await first.voteC(publicKey)
    //   console.log(tx)
    // }

   const history = useHistory()
   //votes && votes.length>0 && votes[0].distributor === publicKey
    return(
        <Grid item xs={12}  className={classes.paddedPaper}>
            <Card style={{margin:'6px', outlineColor:'#000', color: '#000', outlineWidth:'2px'}}>
                <Grid container align='center' className={classes.paddedPaper}>
                    <Grid item xs={12}>
                        <Typography variant="h4" control="p" ><MonetizationOnIcon fontSize='large' color='primary'/> {election ? election.name:'UNK'}</Typography>
                        {(option && option === 'distribute') ?
                          (<>
                          <Typography variant="h6" control="p">{election?election.votes:'?'} undistributed votes</Typography>
                          <Typography variant="body1" control="p">{election?election._id:'UNKNOWN ELECTION'}</Typography>
                          </>
                          )
                          :(<>
                          <Typography variant="body1" control="p">{voter.name}</Typography>
                          <Typography variant="h6" control="p">{findVoteInThisElection() ?findVoteInThisElection().votes:'UNK'} uncast votes</Typography>
                          <Typography variant="body1" control="p">{findVoteInThisElection()?findVoteInThisElection()._id:'UNK'}</Typography>
                          </>
                          )
                        }
                        <Button onClick={(e)=>{history.push(`/elections/results/${election?election._id:''}`)}} variant='contained' color='secondary'>View Results</Button>
                    </Grid>
                    <Grid item xs={12}>
                      
                      {(option && option === 'distribute') 
                        ? election.votes === 0 ? (<div></div>) :
                          ( 
                          <div className={classes.paddedPaper}>
                            <SendVote votes={votes} computer={computer} voter={getFirstVoter()} />
                          </div>
                        ) : (
                          <div>
                            <div> Cast Your Vote For: </div>
                            <Grid container> 
                              <Grid item xs={12} md={4}>
                                <Button onClick={candidate1Click} > {election?election.can1name:'UNK Candidate 1'}</Button> 
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Button  onClick={candidate2Click}> {election?election.can2name:'UNK Candidate 2'} </Button>
                              </Grid>
                              {/* <Grid item xs={12} md={4}>
                                <Button  onClick={candidate3Click}> {first.can3name} </Button>
                              </Grid> */}
                            </Grid>
                          </div>
                        )
                      } 
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}

export default VoteWallet